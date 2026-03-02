import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { chat, chatStream, resetSession } from './ai/templateAgent.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

    console.log(`Generating image for prompt: "${prompt.substring(0, 80)}..."`);

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
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
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI server running on port ${PORT}`);
});
