import express from 'express';

const router = express.Router();

import userRoutes from './api/user.js';
import projectRoutes from './api/project.js';

router.use('/user', userRoutes);

router.use('/project', projectRoutes);

export default router;
