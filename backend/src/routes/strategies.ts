import { Router } from 'express';
import { mockStrategies } from '../mocks/index';

const router = Router();

router.get('/', (_, res) => {
  res.json(mockStrategies);
});

export default router;
