import AlarmModel from '../database/models/AlarmModel.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const findAlarms = async (email) => {
  const alarms = await AlarmModel.findOne({ email }).lean();
  return alarms;
};

export const getAlarms = async (req, res) => {
  try {
    const { email } = req.query;

    const entry = await findAlarms(email);

    const alarmData = {};

    for (const [key, value] of Object.entries(entry.alarms)) {
      alarmData[key] = value.threshold;
    }

    res.status(200).json({
      alarmData,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      message: 'Alarm fetch failed',
    });
  }
};

export const updateAlarms = async (req, res) => {
  const { email, alarms } = req.body;
  logger.info(req.body);
  if (!email || !alarms) {
    return res.status(400).send({ message: 'Invalid request data' });
  }

  try {
    const updatedAlarm = await AlarmModel.findOneAndUpdate({ email }, { alarms });

    res.send({ message: 'Alarms updated successfully', alarms: updatedAlarm });
  } catch (error) {
    console.error('Error updating alarms:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const getAllAlarms = async (req, res) => {
  try {
    const mails = await AlarmModel.find().select('email alarms');
    res.status(200).json({
      mails,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      message: 'Alarm fetch failed',
    });
  }
};
