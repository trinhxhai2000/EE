import { Request, Response, NextFunction } from 'express';
import { CustomAPIError, createCustomError } from '../errors/CustomError';
import { StatusCodes } from 'http-status-codes';
export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log("error", {
    statusCode: res.statusCode,
    msg: err.message
  })
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send('Something went wrong try again later');
};
