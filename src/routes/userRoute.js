import express from 'express';
import { login, signup, updateUser } from '../controllers/userController.js';
import { jwtCheck } from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/auth', jwtCheck, (req, res) =>
  res.json({ message: 'authorized' })
);
router.post('/login', login);
router.post('/signup', signup);
router.put('/', jwtCheck, updateUser);

export default router;
