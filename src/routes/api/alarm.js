import express from 'express';

const alarmRouter = express.Router();

import * as alarmController from '../../controllers/alarmController.js';

alarmRouter.get('/getAlarms', alarmController.getAlarms);

export default alarmRouter;
