import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { createCustomError } from '../errors/CustomError';
import { StatusCodes } from 'http-status-codes';
import { AUTH_COOKIE_KEY } from '../AppConst';
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_cookie_token = req.cookies[AUTH_COOKIE_KEY];
  // console.log('requireAuth');
  if (req_cookie_token) {
    // console.log('req_cookie_token:', req_cookie_token);
    try {
      const decoded = jwt.verify(
        req_cookie_token,
        process.env.JWT_SECRET as string
      );
      const user = decoded as { username: string };

      req.body.username = user.username;

      next();
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  const authHeader = req.headers.authorization || '';


  const authHeaderParts = authHeader.split(' ');

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ') ||
    authHeaderParts.length != 2
  ) {
    next(createCustomError('No token provided', StatusCodes.UNAUTHORIZED));
    return;
  }

  const token = authHeaderParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = decoded as { username: string };
    req.body.username = user.username;
    next();
  } catch (error) {
    next(error);
  }
};
