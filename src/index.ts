import express from 'express';
import cors from 'cors';
import router from './api';

const port = process.env.PORT || 8080;
const app = express();

const whitelist = [
  'http://localhost:8080',
  'https://dhoonjang.github.io/jerk-lol',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not Allowed Origin!'));
      }
    },
  })
);

app.use('/api', router);

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
