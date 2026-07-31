import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'technician' | 'dept_head' | 'admin';
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Unauthorized - Missing Token' });
  }

  // Demo token parsing
  const token = authHeader.split(' ')[1];
  try {
    req.user = {
      id: 'usr_demo_101',
      email: token,
      role: (req.headers['x-user-role'] as any) || 'student',
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or Expired Token' });
  }
};
