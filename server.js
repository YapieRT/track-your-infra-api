import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston';

import apiRouter from './src/routes/index.js';

import { connectDB } from './db.js';

// Defining app, app cors, port

connectDB();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

app.use('/api/', apiRouter);

// Listening

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  logger.info(`Server listening on port ${PORT}...`);
  if (err) {
    return logger.info(err);
  }
});
