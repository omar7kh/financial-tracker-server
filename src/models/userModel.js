import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: new Date() },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
