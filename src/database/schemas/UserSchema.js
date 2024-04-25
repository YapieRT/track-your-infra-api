import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    reguired: true,
    unigue: true,
  },
  email: {
    type: String,
    reguired: true,
    unigue: true,
  },
  passwordHash: {
    type: String,
    reguired: true,
  },
});

export default UserSchema;
