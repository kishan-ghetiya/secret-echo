import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getJwtSecret } from '../utils/jwt';

interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    console.log('err', err)
    return res.status(400).json({ message: 'Invalid token.' });
  }
};
