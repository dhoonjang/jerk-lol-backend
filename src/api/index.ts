import express from 'express';
import { GoogleService } from '../google';

const router = express.Router();

router.get('/people', async (req, res) => {
  const service = new GoogleService();

  await service.authorize();

  const people = await service.getPeople();

  res.json({ people });
});

router.post('/people', async (req, res) => {
  const { lolName, type }: { lolName: string; type: 'up' | 'down' } = req.body;
  const service = new GoogleService();
  await service.authorize();

  const success = await service.updatePeople(lolName, type);

  res.json({
    success,
  });
});

export default router;
