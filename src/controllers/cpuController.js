import os from 'os';
import cron from 'node-cron';
import winston from 'winston';
import fs from 'fs';
import { getLastLogs } from '../scripts/logs.js';

let currentCpuUtilization;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const getCPUUtilization = () => {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;

  return (100 - (100 * idle) / total).toFixed(3);
};

const writeLogsTask = cron.schedule(
  '*/1 * * * * *',
  () => {
    const cpuTimestamp = Date.now();
    const cpuUtilization = getCPUUtilization();
    currentCpuUtilization = cpuUtilization;
    const data = {
      cpuTimestamp,
      cpuUtilization,
    };

    fs.writeFile('logs/cpuLogs.txt', JSON.stringify(data) + '\n', { flag: 'a' }, (err) => {
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
  getLastLogs('logs/cpuLogs.txt', +timeline + 1, (err, lastLogs) => {
    if (err) {
      res.status(500).json({ message: 'Error reading logs' });
      return;
    }
    const pattern = /\{"cpuTimestamp":\d+,"cpuUtilization":"\d+(\.\d+)?"\}/;
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
    res.status(200).json({ cpuUtilization: currentCpuUtilization });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};
