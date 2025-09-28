import { Request, Response, NextFunction } from 'express';
import { asyncerrorhandlerpayload } from '../types';

export const asyncerrorhandler = (func: asyncerrorhandlerpayload) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(err => next(err));
    }
}
