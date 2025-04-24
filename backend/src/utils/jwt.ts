import jwt from 'jsonwebtoken';

export const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined!');
  }
  return process.env.JWT_SECRET;
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    console.log('Error verifying token:', err);
    throw new Error('Invalid token.');
  }
};
