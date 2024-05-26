import express from 'express';
import {
  login,
  logout,
  signup,
  updateUser,
} from '../controllers/userController.js';
import { jwtCheck } from '../middlewares/isAuth.js';
import {
  validateLogin,
  validateSignupRequest,
} from '../middlewares/validation.js';

const router = express.Router();

router.get('/auth', jwtCheck, (req, res) =>
  res.json({ message: 'authorized' })
);
router.post('/login', validateLogin, login);
router.post('/signup', validateSignupRequest, signup);
router.put('/', jwtCheck, updateUser);
router.post('/logout', jwtCheck, logout);

export default router;
