import os from 'os';

const getCPUUtilization = async () => {
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

  return 100 - (100 * idle) / total;
};

export const utilization = async (req, res) => {
  try {
    const cpuUtilization = await getCPUUtilization();
    res.status(200).json({ cpuUtilization: cpuUtilization.toFixed(2) });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};
