import mongoose from 'mongoose';

import UserModel from '../database/models/UserModel.js';

const findCollection = async (collectionName) => {
  const collections = mongoose.connection.collections;
  let collectionFound = false;

  for (let collection in collections) {
    if (collection === collectionName) {
      collectionFound = true;
    }
  }

  return collectionFound;
};

export const isConfigured = async (req, res) => {
  try {
    const usersCollectionExists = await findCollection('users');
    if (!usersCollectionExists) {
      return res.status(200).json({ isConfigured: false });
    }

    const userCount = await UserModel.countDocuments({});
    const isConfigured = userCount !== 0;

    return res.status(200).json({ isConfigured });
  } catch (err) {
    res.status(500).json({
      message: 'Login failed',
    });
  }
};
