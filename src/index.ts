import express from 'express';
import cors from 'cors';
import router from './api';

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
