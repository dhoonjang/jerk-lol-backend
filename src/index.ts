import express from 'express';
import cors from 'cors';
import router from './api';
import { GoogleService } from './google';

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.use('/api', router);

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);

  const client = new GoogleService();
  await client.authorize();
  console.log(await client.getPeople());
  console.log(
    await client.updatePeople({
      name: '장동훈',
      reason: '잘해서',
      type: 'down',
    })
  );
  console.log(
    await client.logPeople({
      name: '장동훈',
      reason: '못해서',
      type: 'down',
    })
  );
});

export default app;
