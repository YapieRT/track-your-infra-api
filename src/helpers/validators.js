import { body } from 'express-validator';

export const createUserValidator = () => {
  return [
    body('email', 'Make sure that the email is entered correctly.').isEmail(),
    body('password', 'Password must contain at least 6 characters.').isLength({ min: 6 }),
  ];
};

export const signInValidator = () => {
  return [
    body('email', 'Make sure that the email is entered correctly.').not().isEmpty(),
    body('password', 'Make sure the password is entered correctly.').not().isEmpty(),
  ];
};
