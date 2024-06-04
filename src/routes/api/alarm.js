import express from 'express';

const alarmRouter = express.Router();

import * as alarmController from '../../controllers/alarmController.js';

alarmRouter.get('/get', alarmController.getAlarms);

alarmRouter.get('/getAll', alarmController.getAllAlarms);

alarmRouter.post('/update', alarmController.updateAlarms);

export default alarmRouter;
