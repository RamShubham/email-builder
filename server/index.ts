import 'dotenv/config';
import './renderHtml.js';

import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

import { chat, chatStream, resetSession } from './ai/templateAgent.js';
import pool from './db.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import templateRoutes from './routes/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '8008', 10);
const startTime = Date.now();

const distPath = path.resolve(__dirname, '../packages/editor-sample/dist');
app.use(express.static(distPath));

const allowedOrigins = [
  process.env.TINYCOMMAND_ORIGIN,
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  process.env.REPLIT_DEPLOYMENT_URL ? `https://${process.env.REPLIT_DEPLOYMENT_URL}` : null,
  'https://email-builder-shubhamram2992.replit.app',
  'http://localhost:5000',
  'http://localhost:3001',
  'http://0.0.0.0:5000',
  'https://email-dev.oute.app',
].filter(Boolean) as string[];

const apiCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

function apiTimeout(defaultMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let ms = defaultMs;
    if (req.path === '/image/generate') ms = 60000;
    if (req.path === '/chat/stream') ms = 120000;

    req.setTimeout(ms);

    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: 'Request timed out' });
      }
    }, ms);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    next();
  };
}

app.use('/api', apiCors);
app.use('/api', express.json({ limit: '50mb' }));
app.use('/api', authMiddleware);
app.use('/api', rateLimitMiddleware);
app.use('/api', apiTimeout(30000));
app.use(templateRoutes);

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chat(sessionId, message);
    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await chatStream(sessionId, message, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ type: 'done', responseType: result.type, content: result.content, template: result.template })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Chat stream error:', error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
});

app.post('/api/chat/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  resetSession(sessionId);
  res.json({ success: true });
});

app.post('/api/image/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { aspectRatio = 'landscape' } = req.body;
    const sizeMap: Record<string, string> = {
      square: '1024x1024',
      landscape: '1536x1024',
      portrait: '1024x1536',
    };
    const size = sizeMap[aspectRatio] || sizeMap.landscape;

    console.log(`Generating image for prompt: "${prompt.substring(0, 80)}..." (${size})`);

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: size as any,
      quality: 'medium',
    });

    const base64 = response.data[0]?.b64_json ?? '';

    if (!base64) {
      return res.status(500).json({ error: 'No image data returned' });
    }

    const dataUrl = `data:image/png;base64,${base64}`;
    res.json({ url: dataUrl });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const status = error?.status || 500;
    const message = error?.message || 'Failed to generate image';
    res.status(status).json({ error: message });
  }
});

app.get('/api/health', async (_req, res) => {
  const result: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    services: {
      database: { status: string; latencyMs?: number; error?: string };
      openai: { configured: boolean };
    };
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    services: {
      database: { status: 'unknown' },
      openai: { configured: false },
    },
  };

  try {
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    result.services.database = {
      status: 'connected',
      latencyMs: Date.now() - dbStart,
    };
  } catch (err: any) {
    result.services.database = {
      status: 'disconnected',
      error: err.message,
    };
    result.status = 'unhealthy';
  }

  result.services.openai = {
    configured: Boolean(process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL),
  };

  if (result.status === 'healthy' && !result.services.openai.configured) {
    result.status = 'degraded';
  }

  const httpStatus = result.status === 'unhealthy' ? 503 : 200;
  res.status(httpStatus).json(result);
});

app.all('/api/{*splat}', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
