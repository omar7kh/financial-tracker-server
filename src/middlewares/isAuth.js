import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const jwtCheck = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  try {
    if (!token) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id: decoded.userId });

    if (!user) {
      return res.sendStatus(401);
    }

    req.userId = user._id.toString();
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};
