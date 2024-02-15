import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import * as userController from './controllers/userController.js';
import * as validator from './validation/validator.js';

import { connectDB } from './db.js';

// Defining app, app cors, port

connectDB();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// JWT verify

app.get('/api/UserAuth', userController.userAuth);

// Log In

app.post('/api/login', validator.loginValidator(), userController.login);

// Registration new user

app.post('/api/registration', validator.registrationValidator(), userController.registration);

// Listening

app.listen(PORT, (err) => {
  console.log(`Server listening on port ${PORT}...`);
  if (err) {
    return console.log(err);
  }
});
