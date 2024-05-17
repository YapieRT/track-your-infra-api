import fs from 'fs';
import { containsSystemDirs } from '../scripts/logs.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const doesLogsExists = async (req, res) => {
  try {
    const { path } = req.query;

    if (containsSystemDirs(path)) {
      res.status(200).json({ logs: 'Access denied' });
    } else {
      const fileExists = fs.existsSync(path);

      if (fileExists) {
        res.status(200).json({ logs: true });
      } else {
        res.status(200).json({ logs: false });
      }
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};

export const getLogs = async (req, res) => {
  try {
    const { path } = req.query;

    const data = fs.readFileSync(path, 'utf8');

    let lines = data.split('\n');

    lines.pop();

    const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`);

    res.status(200).json({ logs: numberedLines.join('\n') });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};
