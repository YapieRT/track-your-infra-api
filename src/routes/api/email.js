import express from 'express';

const emailRouter = express.Router();

import * as emailController from '../../controllers/emailController.js';

emailRouter.post('/invite', emailController.invite);

emailRouter.post('/alarm', emailController.alarm);

export default emailRouter;
