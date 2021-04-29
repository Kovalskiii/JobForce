import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export const checkPassword = (password) => /^[^\s]{5,}$/.test(password);

export const validateObjectId = (id) =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;
