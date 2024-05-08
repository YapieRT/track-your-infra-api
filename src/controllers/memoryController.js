import os from 'os';
const getRAMUtilization = async () => {
  const availableMem = os.freemem();
  const totalMem = os.totalmem();

  return ((totalMem - availableMem) / totalMem) * 100 - 2;
};

export const utilization = async (req, res) => {
  try {
    const ramUtilization = await getRAMUtilization();
    res.status(200).json({ ramUtilization: ramUtilization.toFixed(2) });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
  }
};
