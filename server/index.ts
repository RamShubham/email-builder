import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

import { chat, chatStream, resetSession } from './ai/templateAgent.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { generateImageName, uploadImageToCdn } from './uploadImageToCdn.js';
import { CreditService } from './services/credits/creditService.js';
import { getToken, requireWorkspaceId } from './utils/requestContext.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || '8008', 10);
const startTime = Date.now();

const distPath = path.resolve(__dirname, '../packages/editor/dist');
app.use(express.static(distPath));

const isDev = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  process.env.TINYCOMMAND_ORIGIN,
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
  process.env.REPLIT_DEPLOYMENT_URL ? `https://${process.env.REPLIT_DEPLOYMENT_URL}` : null,
  'https://email-builder-shubhamram2992.replit.app',
  'https://email-dev.oute.app',
  'https://email.oute.app',
  ...(isDev ? ['http://localhost:5000'] : []),
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

    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing token header' });
    }

    const workspaceId = requireWorkspaceId(req, res);
    if (!workspaceId) return;

    const credits = await CreditService.getCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    const availableCredits = credits?.data?.availableCredits || 0;

    if (availableCredits <= 0) {
      return res.status(400).json({ error: 'No credits available' });
    }

    const response = await chat(sessionId, message);

    await CreditService.deductCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    res.json(response);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing token header' });
    }

    const workspaceId = requireWorkspaceId(req, res);
    if (!workspaceId) return;

    const credits = await CreditService.getCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    const availableCredits = credits?.data?.availableCredits || 0;

    if (availableCredits <= 0) {
      return res.status(400).json({ error: 'No credits available' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await chatStream(sessionId, message, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    });

    await CreditService.deductCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        responseType: result.type,
        content: result.content,
        template: result.template,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    console.error('Chat stream error:', error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to process message' })}\n\n`);
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
    const { prompt, workspaceId, aspectRatio = 'landscape' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!workspaceId || typeof workspaceId !== 'string') {
      return res.status(400).json({ error: 'Missing workspace_id parameter' });
    }

    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ error: 'Missing token header' });
    }
    const sizeMap: Record<string, string> = {
      square: '1024x1024',
      landscape: '1536x1024',
      portrait: '1024x1536',
    };
    const size = sizeMap[aspectRatio] || sizeMap.landscape;

    console.log(`Generating image for prompt: "${prompt.substring(0, 80)}..." (${size})`);

    const credits = await CreditService.getCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    const availableCredits = credits?.data?.availableCredits || 0;

    if (availableCredits <= 0) {
      return res.status(400).json({ error: 'No credits available' });
    }

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

    const bytes = Buffer.from(base64, 'base64');
    const name = generateImageName(prompt);

    const cdnUrl = await uploadImageToCdn(
      {
        bytes,
        mimeType: 'image/png',
        name,
      },
      token
    );

    await CreditService.deductCredits({
      access_token: token,
      workspace_id: workspaceId,
    });

    res.json({ url: cdnUrl });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const status = error?.status || 500;
    res.status(status).json({ error: 'Failed to generate image' });
  }
});

app.get('/health', async (_req, res) => {
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
