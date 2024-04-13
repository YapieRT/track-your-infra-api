import express from 'express';

const userRouter = express.Router();

import * as userController from '../../controllers/userController.js';
import * as validator from '../../helpers/validators.js';

userRouter.get('/auth', userController.userAuth);

userRouter.post('/login', validator.loginValidator(), userController.login);

userRouter.post('/register', validator.registrationValidator(), userController.registration);

export default userRouter;
