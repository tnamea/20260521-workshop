import { Router } from 'express';
import { mockAgents } from '../mocks/index';

const router = Router();

router.get('/', (_, res) => {
  res.json(mockAgents);
});

router.get('/:id', (req, res) => {
  const agent = mockAgents.find(a => a.id === req.params.id);
  if (agent) {
    res.json(agent);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

export default router;
