import winston from 'winston';

import MailService from '../service/mail-service.js';

import { createUserData, createAlarm, doesUserExistsByEmail, signInVerify } from '../scripts/user.js';

import bcrypt from 'bcrypt';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const invite = async (req, res) => {
  try {
    const { email } = req.body;

    const password = Math.random().toString(36).slice(-8);

    const mailService = new MailService();

    if (await doesUserExistsByEmail(email)) {
      return res.status(400).json({ message: 'Such email already used.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUserData({
      email,
      passwordHash: hashedPassword,
      admin: false,
    });

    const alarm = { email, alarms: { CPU: { threshold: 75 }, RAM: { threshold: 75 } } };
    await createAlarm(alarm);

    await mailService.sendInvite(email, password);

    res.status(200).json({
      message: 'Link Successfully sent',
      newUserAlarm: alarm,
    });

    logger.info('Sending registration data');
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
    logger.error(err);
  }
};

export const alarm = async (req, res) => {
  console.log('Sending alarm message');
};
