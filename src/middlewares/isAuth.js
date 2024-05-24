import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const jwtCheck = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  try {
    if (!token) {
      return res.status(401).json({ message: 'Invalid authorization' });
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    const { userId } = decodedPayload;
    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(401).json({ message: 'Invalid authorization' });
    }

    req.userId = userId.toString();
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'something went wrong' });
  }
};
