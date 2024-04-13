import UserModel from '../database/models/UserModel.js';

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

const insertRegistrationData = async (data) => {
  try {
    await UserModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

const doesUserExists = async (email) => {
  const inUse = await UserModel.findOne({ email });

  if (Object.is(inUse, null)) return false;
  else return true;
};

const loginVerify = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!Object.is(user, null)) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) return true;
    else return false;
  }
  return false;
};

export const userAuth = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ auth: true, email: decoded.email, message: `Hello ${decoded.email}!` });
  } catch (err) {
    res.status(401).json({ auth: false, message: 'Invalid token' });
  }
};

export const login = async (req, res) => {
  try {
    logger.info(`Attempt to login:`);
    logger.info(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    if (await loginVerify(email, password)) {
      const email = email;
      const token = jwt.sign({ email }, secretKey, { expiresIn: 3600 });

      return res.status(200).json({ auth: true, token: token });
    } else return res.status(400).json({ message: 'Login Failed(wrong password or email).' });
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      message: 'Login failed',
    });
  }
};

export const registration = async (req, res) => {
  try {
    logger.info(`Attempt to register:`);
    logger.info(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    if (await doesUserExists(email)) {
      return res.status(400).json({ message: 'Such email already used.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await insertRegistrationData({
      email: email,
      passwordHash: hashedPassword,
    });

    const token = jwt.sign({ email }, secretKey, { expiresIn: 300 });

    return res.status(201).json({ auth: true, token: token });
  } catch (err) {
    logger.info(err);
    res.status(500).json({
      message: 'Registration failed',
    });
  }
};
