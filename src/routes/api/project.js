import express from 'express';

const projectRouter = express.Router();

import * as projectController from '../../controllers/projectController.js';

projectRouter.get('/isConfigured', projectController.isConfigured);

export default projectRouter;
