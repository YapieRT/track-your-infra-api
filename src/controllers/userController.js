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

const jwtTokenExpireTime = 360;

const createUserData = async (data) => {
  try {
    await UserModel.create(data);
  } catch (err) {
    logger.info(err);
  }
};

const doesUserExistsByEmail = async (email) => {
  const inUse = await UserModel.findOne({ email });

  if (Object.is(inUse, null)) return false;
  else return true;
};

const signInVerify = async (name, password) => {
  const user = await UserModel.findOne({ name });

  if (!Object.is(user, null)) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) return true;
    else return false;
  }
  return false;
};

export const signIn = async (req, res) => {
  try {
    logger.info(`Attempt to Sign In:`);
    logger.info(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, password } = req.body;

    if (await signInVerify(name, password)) {
      const token = jwt.sign({ name }, secretKey, { expiresIn: jwtTokenExpireTime });
      return res.status(200).json({ auth: true, token: token });
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

    const { name, email, password } = req.body;

    if (await doesUserExistsByEmail(email)) {
      return res.status(400).json({ message: 'Such email already used.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUserData({
      name: name,
      email: email,
      passwordHash: hashedPassword,
    });

    const token = jwt.sign({ name }, secretKey, { expiresIn: jwtTokenExpireTime });

    return res.status(201).json({ auth: true, token: token });
  } catch (err) {
    logger.info(err);
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
