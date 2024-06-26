import { exec } from 'child_process';
import winston from 'winston';
import os from 'os';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const getKernelName = () => {
  return new Promise((resolve, reject) => {
    exec('uname -s', (error, stdout, stderr) => {
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

const getKernelVersion = () => {
  return new Promise((resolve, reject) => {
    exec('uname -v', (error, stdout, stderr) => {
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

const getKernelRelease = () => {
  return new Promise((resolve, reject) => {
    exec('uname -r', (error, stdout, stderr) => {
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

const getHardwareArchitectureName = () => {
  return new Promise((resolve, reject) => {
    exec('uname -m', (error, stdout, stderr) => {
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

const getProcesses = () => {
  return new Promise((resolve, reject) => {
    exec('ps aux | wc -l', (error, stdout, stderr) => {
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

const getCpuInfo = () => {
  return new Promise((resolve, reject) => {
    exec('lscpu', (error, stdout, stderr) => {
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

const getDockerInfo = () => {
  return new Promise((resolve, reject) => {
    exec('docker version', (error, stdout, stderr) => {
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
    const processes = await getProcesses();

    return res.status(200).json({ processes });
  } catch (err) {
    res.status(500).json({
      message: 'Getting system processes failed',
    });
  }
};

export const info = async (req, res) => {
  try {
    const kernelName = await getKernelName();
    const kernelVersion = await getKernelVersion();
    const kernelRelease = await getKernelRelease();
    const hardwareArchitectureName = await getHardwareArchitectureName();

    const cpuRegexPatterns = [
      /Model name:\s+(.*)/,
      /Thread\(s\) per core:\s+(\d+)/,
      /Core\(s\) per socket:\s+(\d+)/,
      /CPU max MHz:\s+([\d.]+)/,
      /CPU min MHz:\s+([\d.]+)/,
    ];

    const dockerRegexPatterns = [/Version:\s+(.*)/, /API version:\s+(.*)/, /Go version:\s+(.*)/];

    const cpuSettings = await getCpuInfo();
    const dockerSettings = await getDockerInfo();

    const cpuMatches = cpuRegexPatterns.map((pattern) => {
      const match = cpuSettings.match(pattern);
      return match ? match[1] : 'NaN';
    });

    const dockerMatches = dockerRegexPatterns.map((pattern) => {
      const match = dockerSettings.match(pattern);
      return match ? match[1] : 'NaN';
    });

    const [modelName, threadsPerCore, coresPerSocket, cpuMaxMhz, cpuMinMhz] = cpuMatches;

    const [dockerVersion, dockerApiVersion, dockerGoVersion] = dockerMatches;

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
          cpuMaxMhz: cpuMaxMhz.split('.')[0],
          cpuMinMhz: cpuMinMhz.split('.')[0],
        },
        docker: {
          version: dockerVersion,
          apiVersion: dockerApiVersion,
          goVersion: dockerGoVersion,
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
