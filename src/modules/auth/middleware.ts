import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  userId: string;
  email: string;
  compnay: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = jwt.verify(
      req.cookies.jsonwebtoken,
      process.env.JWT_SECRET!
    ) as UserPayload;
    req.user = payload;
  } catch (error) {
    return res.status(400).send(error);
  }

  next();
};
