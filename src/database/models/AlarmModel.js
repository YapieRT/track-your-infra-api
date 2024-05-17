import mongoose from 'mongoose';
import alarmSchema from '../schemas/AlarmSchema.js';

const collectionName = 'alarms';
const AlarmModel = mongoose.model(collectionName, alarmSchema);

export default AlarmModel;
