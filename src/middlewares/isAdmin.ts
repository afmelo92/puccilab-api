import { Request, Response, NextFunction } from 'express';

export default async function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { user } = request;

    if (!user) {
      return response.status(401).json({
        error: 'JWT token missing',
      });
    }

    const { admin } = user;

    if (!admin) {
      return response.status(403).json({
        error: 'Unauthorized.',
      });
    }

    return next();
  } catch (err) {
    return response.status(401).json({
      error: 'JWT token missing',
    });
  }
}
