import express from 'express';

const router = express.Router();

import userRoutes from './api/user.js';
import projectRoutes from './api/project.js';
import cpuRoutes from './api/cpu.js';
import memoryRoutes from './api/memory.js';

router.use('/user', userRoutes);

router.use('/project', projectRoutes);

router.use('/cpu', cpuRoutes);

router.use('/memory', memoryRoutes);

export default router;
