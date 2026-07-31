import { Request, Response } from 'express';

const DEMO_USERS = [
  { id: 'usr_1', name: 'Aarav Sharma', email: 'aarav.sharma@campus.edu', role: 'student', departmentName: 'Computer Science' },
  { id: 'usr_2', name: 'Vikram Singh', email: 'vikram.tech@campus.edu', role: 'technician', specialization: ['Electrical', 'Internet'] },
  { id: 'usr_3', name: 'Dr. Meera Nambiar', email: 'meera.head@campus.edu', role: 'dept_head', departmentName: 'Electrical Maintenance' },
  { id: 'usr_4', name: 'Dean Rajesh Kumar', email: 'admin@campus.edu', role: 'admin' }
];

export const login = (req: Request, res: Response) => {
  const { email, role } = req.body;
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.role === role) ||
               DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];

  res.json({
    success: true,
    token: `jwt_token_${user.id}_${Date.now()}`,
    user
  });
};

export const getCurrentUser = (_req: Request, res: Response) => {
  res.json({ success: true, user: DEMO_USERS[0] });
};

export const switchRole = (req: Request, res: Response) => {
  const { role } = req.body;
  const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
  res.json({ success: true, message: `Switched role to ${role}`, user });
};
