import { body } from 'express-validator';

export const createUserValidator = () => {
  return [
    body('email', 'Make sure that the email is entered correctly.').isEmail(),
    body('name', 'Make sure that the name is entered correctly. Minimal length: 6 symbols').not().isEmpty(),
    body('password', 'Password must contain at least 6 characters.').isLength({ min: 6 }),
  ];
};

export const signInValidator = () => {
  return [
    body('name', 'Make sure that the name is entered correc tly.').not().isEmpty(),
    body('password', 'Make sure the password is entered correctly.').not().isEmpty(),
  ];
};
