import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandlerpayload } from '../types';

export const asyncErrorHandler = (func: asyncErrorHandlerpayload) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("Request received:", req.method, req.url);
        func(req, res, next).catch(err => {
            console.error("Error occurred:", err);
            next(err);
        });
    }
}
