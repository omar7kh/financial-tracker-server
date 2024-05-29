import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/userModel';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET as string;

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Email or Password are not correct' });
    }

    bcrypt.compare(
      req.body.password,
      user.password as string,
      (err: Error | undefined, result: boolean) => {
        if (err || !result) {
          return res
            .status(401)
            .json({ message: 'Email or Password are not correct' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: '30d',
        });

        res.cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.send(user);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json('something went wrong');
  }
};

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new UserModel(req.body);
    newUser.password = hashedPassword;
    newUser.createdAt = new Date();

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json('something went wrong');
  }
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, currentPassword, newPassword } = req.body;
  try {
    const userToUpdate = await UserModel.findByIdAndUpdate(req.userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedFields: Partial<typeof userToUpdate> = {};

    if (email && email !== userToUpdate?.email) {
      updatedFields.email = email;
    }

    if (firstName && firstName !== userToUpdate?.firstName) {
      updatedFields.firstName = firstName;
    }

    if (lastName && lastName !== userToUpdate?.lastName) {
      updatedFields.lastName = lastName;
    }

    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        userToUpdate?.password as string
      );

      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ message: 'current password is not correct' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userToUpdate.password = hashedPassword;
    }

    await userToUpdate.save();
    res.send(userToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json('something went wrong');
  }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: 'logged out' });
};
