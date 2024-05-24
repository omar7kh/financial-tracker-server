import mongoose from 'mongoose';
import 'dotenv/config';

const MDB_URL = process.env.MDB_URL;

export const MDBConnect = async () => {
  try {
    await mongoose.connect(MDB_URL);
    console.log('MDB connected');
  } catch (error) {
    console.error('MDB connection error:', error);
  }
};
