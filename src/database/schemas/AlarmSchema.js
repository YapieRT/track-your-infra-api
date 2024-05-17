import mongoose from 'mongoose';
const { Schema } = mongoose;

const AlarmSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default AlarmSchema;
