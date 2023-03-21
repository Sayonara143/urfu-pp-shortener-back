import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../exceptions/ErrorHandler';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (_err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(_err, res);
};
