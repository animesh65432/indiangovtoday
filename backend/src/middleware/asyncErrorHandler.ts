import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandlerpayload } from '../types';

export const asyncErrorHandler = (func: asyncErrorHandlerpayload) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(err => next(err));
    }
}
