import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (fn: RequestHandler): RequestHandler => async (req: Request, res: Response, next:NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error: any) {
    next(error);
  }
};

export {asyncHandler};