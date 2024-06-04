import winston from 'winston';

import MailService from '../service/mail-service.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const invite = async (req, res) => {
  try {
    const { email } = req.body;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const password = Math.random().toString(36).slice(-8);

    // const mailService = new MailService();

    // await mailService.sendInvite(email);

    res.status(200).json({
      message: 'Link Successfully sent',
      password: password,
    });

    logger.info('Sending registration data');
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong failed',
    });
    console.log(err);
    logger.error(err);
  }
};

export const alarm = async (req, res) => {
  console.log('Sending alarm message');
};
