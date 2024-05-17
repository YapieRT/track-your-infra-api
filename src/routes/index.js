import express from 'express';

const router = express.Router();

import userRoutes from './api/user.js';
import projectRoutes from './api/project.js';
import cpuRoutes from './api/cpu.js';
import memoryRoutes from './api/memory.js';
import systemRoutes from './api/system.js';
import logsRoutes from './api/logs.js';

import alarmRoutes from './api/alarm.js';

router.use('/user', userRoutes);

router.use('/project', projectRoutes);

router.use('/cpu', cpuRoutes);

router.use('/memory', memoryRoutes);

router.use('/system', systemRoutes);

router.use('/logs', logsRoutes);

router.use('/alarm', alarmRoutes);

export default router;
