import AlarmModel from '../database/models/AlarmModel.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const findAlarms = async (email) => {
  const alarms = await AlarmModel.find({ email });
  return alarms;
};

export const getAlarms = async (req, res) => {
  try {
    const { email } = req.query;

    const alarms = await findAlarms(email);

    const alarmData = {};
    alarms.forEach((alarm) => {
      alarmData[alarm.type] = alarm.threshold;
    });

    res.status(200).json({
      alarmData,
    });
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      message: 'Alarm fetch failed',
    });
  }
};
