import mongoose from 'mongoose';
import userSchema from '../schemas/UserSchema.js';

const collectionName = 'users';
const UserModel = mongoose.model(collectionName, userSchema);

export default UserModel;
