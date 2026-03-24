import { RequestHandler } from 'express';

const asyncHandler = <P = {}, ResBody = any, ReqBody = any, ReqQuery = any>(
    fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export { asyncHandler };
