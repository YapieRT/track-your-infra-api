import os from 'os';
import cron from 'node-cron';
import winston from 'winston';
import fs from 'fs';
import { getLastLogs } from '../scripts/logs.js';

let currentRamUtilization;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const getRAMUtilization = () => {
  const availableMem = os.freemem();
  const totalMem = os.totalmem();

  return (((totalMem - availableMem) / totalMem) * 100 - 2).toFixed(3);
};

const writeLogsTask = cron.schedule(
  '*/1 * * * * *',
  () => {
    const ramTimestamp = Date.now();
    const ramUtilization = getRAMUtilization();
    currentRamUtilization = ramUtilization;
    const data = {
      ramTimestamp,
      ramUtilization,
    };

    fs.writeFile('logs/ramLogs.txt', JSON.stringify(data) + '\n', { flag: 'a' }, (err) => {
      if (err) {
        logger.error('Error appending to file:', err);
        return;
      }
    });
  },
  {
    scheduled: true,
  }
);

export const chartUtilization = async (req, res) => {
  writeLogsTask.stop();
  const { timeline } = req.body;
  getLastLogs('logs/ramLogs.txt', +timeline + 1, (err, lastLogs) => {
    if (err) {
      res.status(500).json({ message: 'Error reading logs' });
      return;
    }
    const pattern = /\{"ramTimestamp":\d+,"ramUtilization":"\d+(\.\d+)?"\}/;
    lastLogs.pop();
    const data = lastLogs.map((line) => {
      if (pattern.test(line)) {
        return JSON.parse(line);
      }
    });
    res.status(200).json({ data: data });
  });
  writeLogsTask.start();
};

export const utilization = async (req, res) => {
  try {
    res.status(200).json({ ramUtilization: currentRamUtilization });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};
