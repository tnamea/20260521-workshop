import { Router } from 'express';
import { mockLogs, generateRandomLog } from '../mocks/index';
import { LogEntry } from '../types/index';

const router = Router();

const logs: LogEntry[] = [...mockLogs];

router.get('/', (_, res) => {
  res.json(logs);
});

router.post('/memo', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }
  const entry: LogEntry = {
    ...generateRandomLog(),
    message,
    level: 'info',
    agentId: 'user',
    agentName: '사용자',
  };
  logs.push(entry);
  if (logs.length > 100) logs.shift();
  return res.status(201).json(entry);
});

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.flushHeaders();

  res.write(': connected\n\n');

  const interval = setInterval(() => {
    const log = generateRandomLog();
    logs.push(log);
    if (logs.length > 100) logs.shift();
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;
