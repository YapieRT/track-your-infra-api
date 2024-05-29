import mongoose from 'mongoose';
const { Schema } = mongoose;

const AlarmSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  alarms: {
    type: Object,
    required: true,
  },
});

export default AlarmSchema;
