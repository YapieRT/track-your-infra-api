import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

export default UserSchema;
