import UserModel from '../database/models/UserModel.js';
import AlarmModel from '../database/models/AlarmModel.js';

import bcrypt from 'bcrypt';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const createUserData = async (data) => {
  try {
    await UserModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

export const createAlarm = async (data) => {
  try {
    await AlarmModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

export const doesUserExistsByEmail = async (email) => {
  const inUse = await UserModel.findOne({ email });

  if (Object.is(inUse, null)) return false;
  else return true;
};

export const signInVerify = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!Object.is(user, null)) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) return true;
    else return false;
  }
  return false;
};
