import express from 'express';
import './config/database';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('OctoFit Tracker API');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
});
