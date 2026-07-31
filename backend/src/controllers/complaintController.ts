import { Request, Response } from 'express';

// In-memory initial store for demo backend
let MOCK_COMPLAINTS = [
  {
    id: 'TICK-9082',
    trackingNumber: 'TRK-2026-9082',
    title: 'WiFi AP Signal Dropout in CS Department Lab 3',
    description: 'Frequent network disconnects observed every 15 minutes during lab hours. High latency to gateway.',
    category: 'Internet',
    priority: 'P2_HIGH',
    status: 'in_progress',
    studentId: 'usr_student_1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    buildingId: 'b1',
    buildingName: 'Tech Hub CS Block',
    floor: '2nd Floor',
    roomNumber: 'Lab 302',
    departmentId: 'dept_it',
    departmentName: 'IT & Infrastructure',
    submittedAt: new Date(Date.now() - 36000000).toISOString(),
    responseDeadline: new Date(Date.now() + 7200000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 86400000).toISOString(),
    aiSummary: 'Critical network instability impacting 40+ active workstations.',
    sentiment: 'Urgent',
    isEscalated: false,
    upvotesCount: 14,
    timeline: [
      {
        id: 'tl-1',
        status: 'submitted',
        title: 'Grievance Submitted',
        description: 'Ticket created via student portal',
        timestamp: new Date(Date.now() - 36000000).toISOString(),
        actorName: 'Aarav Sharma',
        actorRole: 'student'
      }
    ]
  },
  {
    id: 'TICK-9083',
    trackingNumber: 'TRK-2026-9083',
    title: 'Water Leakage near Main Auditorium Restroom',
    description: 'Overflown pipe leak causing water accumulation near emergency exit.',
    category: 'Water Leakage',
    priority: 'P1_CRITICAL',
    status: 'dept_assigned',
    studentId: 'usr_student_2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@campus.edu',
    buildingId: 'b2',
    buildingName: 'Central Auditorium',
    floor: 'Ground Floor',
    roomNumber: 'Restroom B',
    departmentId: 'dept_plumb',
    departmentName: 'Plumbing & Facilities',
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    responseDeadline: new Date(Date.now() - 3600000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 14400000).toISOString(),
    aiSummary: 'High slip risk; requires urgent shutoff valve action.',
    sentiment: 'Frustrated',
    isEscalated: true,
    upvotesCount: 22,
    timeline: []
  }
];

export const getAllComplaints = (_req: Request, res: Response) => {
  res.json({ success: true, count: MOCK_COMPLAINTS.length, data: MOCK_COMPLAINTS });
};

export const getComplaintById = (req: Request, res: Response) => {
  const complaint = MOCK_COMPLAINTS.find(c => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: true, message: 'Complaint not found' });
  }
  res.json({ success: true, data: complaint });
};

export const createComplaint = (req: Request, res: Response) => {
  const { title, description, category, priority, buildingName, floor, roomNumber, studentName } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: true, message: 'Title and description are required' });
  }

  const newTicket = {
    id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    trackingNumber: `TRK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    description,
    category: category || 'Electrical',
    priority: priority || 'P3_MEDIUM',
    status: 'submitted',
    studentId: 'usr_student_demo',
    studentName: studentName || 'Demo Student',
    studentEmail: 'student@campus.edu',
    buildingId: 'b1',
    buildingName: buildingName || 'Tech Hub CS Block',
    floor: floor || '1st Floor',
    roomNumber: roomNumber || 'Room 101',
    departmentId: 'dept_gen',
    departmentName: 'General Maintenance',
    submittedAt: new Date().toISOString(),
    responseDeadline: new Date(Date.now() + 14400000).toISOString(),
    resolutionDeadline: new Date(Date.now() + 86400000).toISOString(),
    aiSummary: 'Grievance registered and auto-routed.',
    sentiment: 'Neutral',
    isEscalated: false,
    upvotesCount: 1,
    timeline: [
      {
        id: `tl-${Date.now()}`,
        status: 'submitted',
        title: 'Ticket Submitted',
        description: 'Log created via REST API',
        timestamp: new Date().toISOString(),
        actorName: studentName || 'Demo Student',
        actorRole: 'student'
      }
    ]
  };

  MOCK_COMPLAINTS.unshift(newTicket as any);
  res.status(201).json({ success: true, message: 'Complaint created successfully', data: newTicket });
};

export const updateComplaintStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, actorName, actorRole, notes } = req.body;

  const complaint = MOCK_COMPLAINTS.find(c => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: true, message: 'Complaint not found' });
  }

  complaint.status = status;
  complaint.timeline.push({
    id: `tl-${Date.now()}`,
    status,
    title: `Status updated to ${status}`,
    description: notes || `Updated by ${actorName || 'User'}`,
    timestamp: new Date().toISOString(),
    actorName: actorName || 'System Admin',
    actorRole: actorRole || 'admin'
  });

  res.json({ success: true, message: 'Complaint status updated', data: complaint });
};
