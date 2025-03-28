import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

import { Types } from 'mongoose';

export const generateToken = (userId: string | Types.ObjectId) => {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, { expiresIn: '7d' });
};


export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
