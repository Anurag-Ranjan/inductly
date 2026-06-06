import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: any[] = [];
    console.log('Yahaan tak aa raha');

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
        statusCode = 400;
        message = JSON.parse(err.message)[0].message;
        errors = formattedErrors;
    } else {
        message = err.message || message;
    }

    console.error({
        message: message || 'error aa rha hai',
        path: req.originalUrl,
        method: req.method,
        stack: err.stack
    });

    console.log('Yahaan tak bhi aa raha');

    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export { errorMiddleware };
