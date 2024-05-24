import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/userModel.js';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'email or Password are not correct' });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (!result) {
        return res
          .status(401)
          .json({ message: 'email or Password are not correct' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '30d',
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.send(user);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('something went wrong');
  }
};

export const signup = async (req, res) => {
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

export const updateUser = async (req, res) => {
  const { email, firstName, lastName, currentPassword, newPassword } = req.body;
  try {
    const userToUpdate = await UserModel.findByIdAndUpdate(req.userId);
    let updatedFields = {};

    if (email && email !== userToUpdate.email) {
      updatedFields.email = email;
    }

    if (firstName && firstName !== userToUpdate.firstName) {
      updatedFields.firstName = firstName;
    }

    if (lastName && lastName !== userToUpdate.lastName) {
      updatedFields.lastName = lastName;
    }

    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        userToUpdate.password
      );

      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ message: 'current password is not correct' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.password = hashedPassword;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      updatedFields,
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json('something went wrong');
  }
};
