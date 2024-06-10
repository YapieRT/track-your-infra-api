import UserModel from '../database/models/UserModel.js';
import AlarmModel from '../database/models/AlarmModel.js';

import { validationResult } from 'express-validator';

import { createUserData, createAlarm, doesUserExistsByEmail, signInVerify } from '../scripts/user.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const secretKey = process.env.secretKey || 'SecretTrack';

const jwtTokenExpireTime = 6000;

export const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    if (await signInVerify(email, password)) {
      const user = await UserModel.findOne({ email });
      const token = jwt.sign({ email }, secretKey, { expiresIn: jwtTokenExpireTime });
      return res.status(200).json({ auth: true, token: token, email: user.email });
    } else return res.status(400).json({ message: 'Sign In Failed(wrong password or email).' });
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      message: 'Sign In failed',
    });
  }
};

export const create = async (req, res) => {
  try {
    logger.info(`Attempt to create user:`);
    logger.info(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, admin } = req.body;

    if (await doesUserExistsByEmail(email)) {
      return res.status(400).json({ message: 'Such email already used.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUserData({
      email: email,
      passwordHash: hashedPassword,
      admin: admin,
    });

    await createAlarm({ email: email, alarms: { CPU: { threshold: 75 }, RAM: { threshold: 75 } } });

    const token = jwt.sign({ email }, secretKey, { expiresIn: jwtTokenExpireTime });

    return res.status(201).json({ auth: true, token: token });
  } catch (err) {
    logger.info('err');
    res.status(500).json({
      message: 'Registration failed',
    });
  }
};

export const auth = async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, secretKey);
    res.json({ isValid: true });
  } catch (err) {
    res.status(401).json({ auth: false, message: 'Invalid token' });
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.body;
  await UserModel.findOneAndDelete({ email });
  await AlarmModel.findOneAndDelete({ email });
  res.json({ message: 'Successfully delete' });
  try {
  } catch (err) {
    res.status(401).json({ message: 'Failed to delete user' });
  }
};

export const status = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await UserModel.findOne({ email });
    res.json({ admin: user.admin });
  } catch (err) {
    res.status(401).json({ auth: false, message: 'Invalid token' });
  }
};
