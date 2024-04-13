import express from 'express';

const router = express.Router();

import userRoutes from './api/user.js';

router.use('/user', userRoutes);

export default router;
