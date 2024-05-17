import fs from 'fs';

const directoryPath = 'logs';

export const createLogsDirectory = () => {
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
      return;
    }
  });
};

export const replaceNullsWithPrevious = (arr) => {
  let prevValue = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null && prevValue !== null) {
      arr[i] = prevValue;
    } else if (arr[i] !== null) {
      prevValue = arr[i];
    }
  }
  return arr;
};

export const getLastLogs = (filePath, n, callback) => {
  let lines = [];
  let lineCount = 0;
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  stream.on('data', (chunk) => {
    const chunkLines = chunk.split('\n');
    lines.push(...chunkLines);
    lineCount += chunkLines.length;
    if (lineCount > n) {
      lines = lines.slice(lineCount - n);
      lineCount = n;
    }
  });
  stream.on('end', () => {
    callback(null, lines.slice(-n));
  });
  stream.on('error', (err) => {
    callback(err);
  });
};

export const containsSystemDirs = (path) => {
  const systemDirs = ['/etc', '/bin', '/sbin', '/usr/bin', '/usr/sbin', '/root', '/proc', '/sys'];

  for (let i = 0; i < systemDirs.length; i++) {
    if (path.includes(systemDirs[i])) {
      return true;
    }
  }

  return false;
};
