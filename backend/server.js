import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

initDB();

app.use('/api/v1', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'inclusive-vision-api', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Inclusive Vision API → http://localhost:${PORT}`);
});
