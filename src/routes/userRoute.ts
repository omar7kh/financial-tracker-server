import express from 'express';
import {
  login,
  logout,
  signup,
  updateUser,
} from '../controllers/userController';
import { jwtCheck } from '../middlewares/isAuth';
import {
  validateLogin,
  validateSignupRequest,
} from '../middlewares/validation';
import limiter from '../middlewares/loginLimiter';

const router = express.Router();

router.get('/auth', jwtCheck, (req, res) =>
  res.json({ message: 'authorized' })
);
router.post('/login', validateLogin, limiter, login);
router.post('/signup', validateSignupRequest, signup);
router.put('/', jwtCheck, updateUser);
router.post('/logout', jwtCheck, logout);

export default router;
