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
  const service = new GoogleService();
  await service.authorize();

  const tier = await service.updatePeople(req.body);

  await service.logPeople(req.body);

  res.json({
    tier,
  });
});

export default router;
