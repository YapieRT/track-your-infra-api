import express from 'express';

const userRouter = express.Router();

import * as userController from '../../controllers/userController.js';
import * as validator from '../../helpers/validators.js';

userRouter.post('/signin', validator.signInValidator(), userController.signIn);

userRouter.post('/create', validator.createUserValidator(), userController.create);

userRouter.post('/auth', userController.auth);

userRouter.get('/status', userController.status);

userRouter.post('/delete', userController.deleteUser);

export default userRouter;
