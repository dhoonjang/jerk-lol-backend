import express from 'express';
import router from './api';

const port = process.env.PORT || 80;
const app = express();

app.use('/api', router);

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
