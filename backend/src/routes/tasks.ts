import { Router } from 'express';
import { mockTasks } from '../mocks/index';

const router = Router();

router.get('/', (_, res) => {
  res.json(mockTasks);
});

router.get('/:id', (req, res) => {
  const task = mockTasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

export default router;
