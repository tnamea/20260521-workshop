import express from 'express';
import cors from 'cors';
import agentsRouter from './routes/agents';
import tasksRouter from './routes/tasks';
import logsRouter from './routes/logs';
import strategiesRouter from './routes/strategies';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/agents', agentsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/logs', logsRouter);
app.use('/api/strategies', strategiesRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
