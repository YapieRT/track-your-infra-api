import UserModel from '../database/models/UserModel.js';
import AlarmModel from '../database/models/AlarmModel.js';

import { validationResult } from 'express-validator';

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

const createUserData = async (data) => {
  try {
    await UserModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

const createAlarm = async (data) => {
  try {
    await AlarmModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

const doesUserExistsByEmail = async (email) => {
  const inUse = await UserModel.findOne({ email });

  if (Object.is(inUse, null)) return false;
  else return true;
};

const signInVerify = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!Object.is(user, null)) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) return true;
    else return false;
  }
  return false;
};

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

    const { name, email, password, admin } = req.body;

    if (await doesUserExistsByEmail(email)) {
      return res.status(400).json({ message: 'Such email already used.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUserData({
      name: name,
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
