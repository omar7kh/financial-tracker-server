import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const jwtCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  token = req.cookies.jwt;

  console.log(token);

  try {
    if (!token) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const { userId } = decoded;
    const user = await User.findOne({ _id: userId });

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
