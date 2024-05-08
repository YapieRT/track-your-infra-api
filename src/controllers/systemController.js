import { exec } from 'child_process';
import winston from 'winston';
import os from 'os';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const callCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
};

export const uptime = async (req, res) => {
  try {
    const uptime = new Date(os.uptime() * 1000).toISOString().slice(11, 19);

    return res.status(200).json({ uptime });
  } catch (err) {
    res.status(500).json({
      message: 'Getting system uptime failed',
    });
  }
};
export const processes = async (req, res) => {
  try {
    const processes = await callCommand('ps aux | wc -l');

    return res.status(200).json({ processes });
  } catch (err) {
    res.status(500).json({
      message: 'Getting system processes failed',
    });
  }
};
export const info = async (req, res) => {
  try {
    const unameCommands = ['uname -s', 'uname -v', 'uname -r', 'uname -m'];

    const [kernelName, kernelVersion, kernelRelease, hardwareArchitectureName] = await Promise.all(
      unameCommands.map(callCommand)
    );

    const regexPatterns = [
      /Model name:\s+(.*)/,
      /Thread\(s\) per core:\s+(\d+)/,
      /Core\(s\) per socket:\s+(\d+)/,
      /CPU max MHz:\s+([\d.]+)/,
      /CPU min MHz:\s+([\d.]+)/,
    ];

    const cpuSettings = await callCommand('lscpu');

    const matches = regexPatterns.map((pattern) => {
      const match = cpuSettings.match(pattern);
      return match ? match[1] : 'NaN';
    });

    const [modelName, threadsPerCore, coresPerSocket, cpuMaxMhz, cpuMinMhz] = matches;

    return res.status(200).json({
      system: {
        linux: {
          kernelName: kernelName,
          kernelVersion: kernelVersion,
          kernelRelease: kernelRelease,
          hardwareArchitectureName: hardwareArchitectureName,
        },
        cpu: {
          modelName: modelName,
          threadsPerCore: threadsPerCore,
          coresPerSocket: coresPerSocket,
          cpuMaxMhz: cpuMaxMhz,
          cpuMinMhz: cpuMinMhz,
        },
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
