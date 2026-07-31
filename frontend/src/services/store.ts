import { 
  User, 
  Complaint, 
  CampusBuilding, 
  Department, 
  SLAConfig, 
  ChatMessage, 
  Notification, 
  AuditLog, 
  PredictiveInsight,
  ComplaintCategory,
  PriorityLevel,
  ComplaintStatus
} from '../types';

// Helper for unique IDs
export const generateId = (prefix: string = 'ID') => 
  `${prefix}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

export const generateTrackingNumber = () =>
  `CC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

// Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@univ.edu.in',
    role: 'student',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-student-2',
    name: 'Ananya Verma',
    email: 'ananya.v@univ.edu.in',
    role: 'student',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-tech-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.tech@univ.edu.in',
    role: 'technician',
    phone: '+91 94111 22233',
    departmentId: 'dept-elec',
    departmentName: 'Electrical Engineering & Maintenance',
    specialization: ['Electrical', 'Academic'],
    rating: 4.9,
    completedJobs: 142,
    location: { lat: 28.545, lng: 77.192, buildingId: 'bldg-engg' },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-tech-2',
    name: 'Suresh Patel',
    email: 'suresh.plumbing@univ.edu.in',
    role: 'technician',
    phone: '+91 98989 12345',
    departmentId: 'dept-civil',
    departmentName: 'Sanitation & Water Works',
    specialization: ['Water Leakage', 'Cleaning'],
    rating: 4.7,
    completedJobs: 98,
    location: { lat: 28.548, lng: 77.195, buildingId: 'bldg-hostel-a' },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-tech-3',
    name: 'Vikram Singh',
    email: 'vikram.net@univ.edu.in',
    role: 'technician',
    phone: '+91 97777 88899',
    departmentId: 'dept-it',
    departmentName: 'IT & Campus Network',
    specialization: ['Internet', 'Others'],
    rating: 4.8,
    completedJobs: 185,
    location: { lat: 28.542, lng: 77.190, buildingId: 'bldg-lib' },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-head-1',
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@univ.edu.in',
    role: 'dept_head',
    departmentId: 'dept-elec',
    departmentName: 'Electrical Engineering & Maintenance',
    phone: '+91 98000 11122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-admin-1',
    name: 'Prof. Ramesh Director',
    email: 'admin.director@univ.edu.in',
    role: 'admin',
    phone: '+91 99999 00000',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  }
];

// Campus Buildings with Coordinates (Percentage relative to campus map background)
export const INITIAL_BUILDINGS: CampusBuilding[] = [
  {
    id: 'bldg-hostel-a',
    name: 'Aryabhata Hostel (Block A)',
    code: 'HST-A',
    x: 22,
    y: 35,
    totalRooms: 120,
    activeIssuesCount: 4,
    healthScore: 78,
    categoriesCount: { 'Water Leakage': 2, 'Electrical': 1, 'Cleaning': 1 },
  },
  {
    id: 'bldg-hostel-b',
    name: 'Gargi Girls Hostel (Block B)',
    code: 'HST-B',
    x: 25,
    y: 65,
    totalRooms: 140,
    activeIssuesCount: 2,
    healthScore: 92,
    categoriesCount: { 'Internet': 1, 'Furniture': 1 },
  },
  {
    id: 'bldg-engg',
    name: 'Visvesvaraya Engineering Block',
    code: 'ENG-MAIN',
    x: 55,
    y: 30,
    totalRooms: 85,
    activeIssuesCount: 6,
    healthScore: 68,
    categoriesCount: { 'Electrical': 3, 'Internet': 2, 'Academic': 1 },
  },
  {
    id: 'bldg-lib',
    name: 'Central Knowledge Library',
    code: 'LIB-CENTRAL',
    x: 50,
    y: 60,
    totalRooms: 30,
    activeIssuesCount: 1,
    healthScore: 96,
    categoriesCount: { 'Internet': 1 },
  },
  {
    id: 'bldg-admin',
    name: 'Administrative Senate Complex',
    code: 'ADM-SENATE',
    x: 75,
    y: 45,
    totalRooms: 45,
    activeIssuesCount: 1,
    healthScore: 98,
    categoriesCount: { 'Cleaning': 1 },
  },
  {
    id: 'bldg-sports',
    name: 'Olympia Indoor Sports Complex',
    code: 'SPT-GYM',
    x: 80,
    y: 75,
    totalRooms: 20,
    activeIssuesCount: 0,
    healthScore: 100,
    categoriesCount: {},
  },
  {
    id: 'bldg-med',
    name: 'Sanjeevani Campus Medical Center',
    code: 'MED-CTR',
    x: 40,
    y: 80,
    totalRooms: 15,
    activeIssuesCount: 1,
    healthScore: 94,
    categoriesCount: { 'Medical': 1 },
  }
];

// Departments
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-elec',
    name: 'Electrical Engineering & Maintenance',
    code: 'ELEC',
    headName: 'Dr. Meera Iyer',
    headEmail: 'meera.iyer@univ.edu.in',
    activeTechs: 12,
    openTickets: 8,
    avgResolutionTimeHours: 3.4,
    slaComplianceRate: 94.5,
  },
  {
    id: 'dept-it',
    name: 'IT & Campus Network',
    code: 'ITNET',
    headName: 'Prof. Alok Gupta',
    headEmail: 'alok.gupta@univ.edu.in',
    activeTechs: 10,
    openTickets: 5,
    avgResolutionTimeHours: 2.1,
    slaComplianceRate: 98.0,
  },
  {
    id: 'dept-civil',
    name: 'Sanitation, Water & Estate Care',
    code: 'ESTATE',
    headName: 'Eng. Sunil Sharma',
    headEmail: 'sunil.estate@univ.edu.in',
    activeTechs: 18,
    openTickets: 11,
    avgResolutionTimeHours: 5.2,
    slaComplianceRate: 88.2,
  },
  {
    id: 'dept-security',
    name: 'Campus Security & Transport',
    code: 'SEC',
    headName: 'Col. R.S. Rathore',
    headEmail: 'security.head@univ.edu.in',
    activeTechs: 8,
    openTickets: 2,
    avgResolutionTimeHours: 1.5,
    slaComplianceRate: 99.1,
  }
];

// Default SLA Settings (hours)
export const DEFAULT_SLA: SLAConfig[] = [
  { category: 'Electrical', p1ResponseHours: 0.5, p1ResolutionHours: 2, p2ResponseHours: 1, p2ResolutionHours: 6, p3ResponseHours: 2, p3ResolutionHours: 24, p4ResponseHours: 4, p4ResolutionHours: 48 },
  { category: 'Internet', p1ResponseHours: 0.5, p1ResolutionHours: 2, p2ResponseHours: 1, p2ResolutionHours: 4, p3ResponseHours: 2, p3ResolutionHours: 12, p4ResponseHours: 4, p4ResolutionHours: 24 },
  { category: 'Water Leakage', p1ResponseHours: 0.25, p1ResolutionHours: 1.5, p2ResponseHours: 0.5, p2ResolutionHours: 4, p3ResponseHours: 2, p3ResolutionHours: 12, p4ResponseHours: 4, p4ResolutionHours: 24 },
  { category: 'Furniture', p1ResponseHours: 2, p1ResolutionHours: 12, p2ResponseHours: 4, p2ResolutionHours: 24, p3ResponseHours: 6, p3ResolutionHours: 48, p4ResponseHours: 12, p4ResolutionHours: 72 },
  { category: 'Hostel', p1ResponseHours: 0.5, p1ResolutionHours: 3, p2ResponseHours: 1, p2ResolutionHours: 8, p3ResponseHours: 3, p3ResolutionHours: 24, p4ResponseHours: 6, p4ResolutionHours: 48 },
  { category: 'Cleaning', p1ResponseHours: 0.5, p1ResolutionHours: 2, p2ResponseHours: 1, p2ResolutionHours: 4, p3ResponseHours: 2, p3ResolutionHours: 8, p4ResponseHours: 4, p4ResolutionHours: 24 },
  { category: 'Security', p1ResponseHours: 0.1, p1ResolutionHours: 0.5, p2ResponseHours: 0.25, p2ResolutionHours: 1, p3ResponseHours: 1, p3ResolutionHours: 4, p4ResponseHours: 2, p4ResolutionHours: 12 },
  { category: 'Medical', p1ResponseHours: 0.1, p1ResolutionHours: 0.5, p2ResponseHours: 0.2, p2ResolutionHours: 1, p3ResponseHours: 0.5, p3ResolutionHours: 2, p4ResponseHours: 1, p4ResolutionHours: 4 },
  { category: 'Transport', p1ResponseHours: 0.5, p1ResolutionHours: 2, p2ResponseHours: 1, p2ResolutionHours: 4, p3ResponseHours: 2, p3ResolutionHours: 12, p4ResponseHours: 4, p4ResolutionHours: 24 },
  { category: 'Academic', p1ResponseHours: 1, p1ResolutionHours: 4, p2ResponseHours: 2, p2ResolutionHours: 8, p3ResponseHours: 4, p3ResolutionHours: 24, p4ResponseHours: 8, p4ResolutionHours: 48 },
  { category: 'Others', p1ResponseHours: 1, p1ResolutionHours: 6, p2ResponseHours: 2, p2ResolutionHours: 12, p3ResponseHours: 4, p3ResolutionHours: 24, p4ResponseHours: 8, p4ResolutionHours: 48 },
];

// Initial Seed Complaints
const now = new Date();
const subHours = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const addHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-101',
    trackingNumber: 'CC-2026-88192',
    title: 'Severe Water Leakage near Electrical Junction Panel',
    description: 'Pipe burst in Room 304 of Aryabhata Hostel. Water is dripping close to the main circuit breaker box on the 3rd floor corridor. Urgent safety risk!',
    category: 'Water Leakage',
    subcategory: 'Pipe Burst / Safety Hazard',
    priority: 'P1_CRITICAL',
    status: 'in_progress',
    studentId: 'usr-student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@univ.edu.in',
    buildingId: 'bldg-hostel-a',
    buildingName: 'Aryabhata Hostel (Block A)',
    floor: '3rd Floor',
    roomNumber: '304',
    attachments: [
      {
        id: 'att-1',
        name: 'water_leak_panel.jpg',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        size: '1.8 MB',
        uploadedAt: subHours(1),
      }
    ],
    departmentId: 'dept-civil',
    departmentName: 'Sanitation, Water & Estate Care',
    technicianId: 'usr-tech-2',
    technicianName: 'Suresh Patel',
    technicianPhone: '+91 98989 12345',
    submittedAt: subHours(1.2),
    responseDeadline: addHours(0.1),
    resolutionDeadline: addHours(0.5),
    timeline: [
      {
        id: 'tl-1',
        status: 'submitted',
        title: 'Complaint Logged by Student',
        description: 'Ticket registered via CampusCare Mobile Portal.',
        timestamp: subHours(1.2),
        actorName: 'Aarav Sharma',
        actorRole: 'student'
      },
      {
        id: 'tl-2',
        status: 'categorized',
        title: 'AI Automated Triage',
        description: 'Categorized as Water Leakage with P1_CRITICAL priority due to electrical hazard keywords.',
        timestamp: subHours(1.1),
        actorName: 'CampusCare AI Engine',
        actorRole: 'admin'
      },
      {
        id: 'tl-3',
        status: 'tech_assigned',
        title: 'Technician Dispatched',
        description: 'Assigned to Suresh Patel (Plumbing Specialist, 0.2km away).',
        timestamp: subHours(0.9),
        actorName: 'Eng. Sunil Sharma',
        actorRole: 'dept_head'
      },
      {
        id: 'tl-4',
        status: 'accepted',
        title: 'Technician Accepted Job',
        description: 'Suresh Patel accepted job. On site ETA: 10 mins.',
        timestamp: subHours(0.8),
        actorName: 'Suresh Patel',
        actorRole: 'technician'
      },
      {
        id: 'tl-5',
        status: 'in_progress',
        title: 'Work In Progress',
        description: 'Main valve isolated. Pipe patch in progress.',
        timestamp: subHours(0.3),
        actorName: 'Suresh Patel',
        actorRole: 'technician'
      }
    ],
    aiSuggestedCategory: 'Water Leakage',
    aiConfidence: 0.98,
    aiSummary: 'Critical pipe burst threatening electrical distribution box in Hostel A floor 3.',
    sentiment: 'Urgent'
  },
  {
    id: 'cmp-102',
    trackingNumber: 'CC-2026-44210',
    title: 'High-speed Wi-Fi Access Point Offline in Lab 202',
    description: 'Students unable to submit online lab assignments. Router AP-202 power light is flashing red.',
    category: 'Internet',
    subcategory: 'Wi-Fi AP Outage',
    priority: 'P2_HIGH',
    status: 'tech_assigned',
    studentId: 'usr-student-2',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.v@univ.edu.in',
    buildingId: 'bldg-engg',
    buildingName: 'Visvesvaraya Engineering Block',
    floor: '2nd Floor',
    roomNumber: 'Lab 202',
    attachments: [],
    departmentId: 'dept-it',
    departmentName: 'IT & Campus Network',
    technicianId: 'usr-tech-3',
    technicianName: 'Vikram Singh',
    technicianPhone: '+91 97777 88899',
    submittedAt: subHours(2),
    responseDeadline: subHours(1),
    resolutionDeadline: addHours(2),
    timeline: [
      {
        id: 'tl-21',
        status: 'submitted',
        title: 'Complaint Logged',
        description: 'Reported via student portal.',
        timestamp: subHours(2),
        actorName: 'Ananya Verma',
        actorRole: 'student'
      },
      {
        id: 'tl-22',
        status: 'tech_assigned',
        title: 'Dispatched to IT Specialist',
        description: 'Assigned to Vikram Singh for router reboot and fiber check.',
        timestamp: subHours(1.5),
        actorName: 'Prof. Alok Gupta',
        actorRole: 'dept_head'
      }
    ],
    aiSuggestedCategory: 'Internet',
    aiConfidence: 0.95,
    aiSummary: 'Wi-Fi Access point failure in Engineering Block Lab 202.',
    sentiment: 'Frustrated'
  },
  {
    id: 'cmp-103',
    trackingNumber: 'CC-2026-11928',
    title: 'Broken Projector Ceiling Mount in Lecture Hall 1',
    description: 'Projector image is flickering and HDMI cable connector is bent. Cannot display slides during lectures.',
    category: 'Electrical',
    subcategory: 'Audio-Visual Equipment',
    priority: 'P3_MEDIUM',
    status: 'proof_uploaded',
    studentId: 'usr-student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@univ.edu.in',
    buildingId: 'bldg-engg',
    buildingName: 'Visvesvaraya Engineering Block',
    floor: '1st Floor',
    roomNumber: 'LH-1',
    attachments: [
      {
        id: 'att-2',
        name: 'projector_cable.jpg',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        size: '1.2 MB',
        uploadedAt: subHours(5)
      }
    ],
    proofAttachments: [
      {
        id: 'att-proof-1',
        name: 'fixed_projector.jpg',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        size: '1.5 MB',
        uploadedAt: subHours(0.2)
      }
    ],
    departmentId: 'dept-elec',
    departmentName: 'Electrical Engineering & Maintenance',
    technicianId: 'usr-tech-1',
    technicianName: 'Rajesh Kumar',
    technicianPhone: '+91 94111 22233',
    submittedAt: subHours(6),
    responseDeadline: subHours(4),
    resolutionDeadline: subHours(1),
    resolvedAt: subHours(0.2),
    resolutionNotes: 'Replaced HDMI extender unit and re-anchored ceiling bracket securely. Verified output at 1080p@60Hz.',
    timeline: [
      {
        id: 'tl-31',
        status: 'submitted',
        title: 'Logged',
        description: 'Reported by Aarav Sharma.',
        timestamp: subHours(6),
        actorName: 'Aarav Sharma',
        actorRole: 'student'
      },
      {
        id: 'tl-32',
        status: 'in_progress',
        title: 'In Progress',
        description: 'Rajesh Kumar on site repairing ceiling bracket.',
        timestamp: subHours(2),
        actorName: 'Rajesh Kumar',
        actorRole: 'technician'
      },
      {
        id: 'tl-33',
        status: 'proof_uploaded',
        title: 'Work Completed & Proof Uploaded',
        description: 'Technician completed repairs and submitted verification photo.',
        timestamp: subHours(0.2),
        actorName: 'Rajesh Kumar',
        actorRole: 'technician'
      }
    ],
    aiSuggestedCategory: 'Electrical',
    aiConfidence: 0.91,
    aiSummary: 'Projector hardware repair in Lecture Hall 1.',
    sentiment: 'Neutral'
  },
  {
    id: 'cmp-104',
    trackingNumber: 'CC-2026-99001',
    title: 'Study Desk Drawer Broken & Lamp Flickering',
    description: 'Drawer sliders are jammed and desk reading lamp switch is faulty in Room 210.',
    category: 'Furniture',
    subcategory: 'Hostel Desk Repair',
    priority: 'P4_LOW',
    status: 'closed',
    studentId: 'usr-student-2',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.v@univ.edu.in',
    buildingId: 'bldg-hostel-b',
    buildingName: 'Gargi Girls Hostel (Block B)',
    floor: '2nd Floor',
    roomNumber: '210',
    attachments: [],
    departmentId: 'dept-civil',
    departmentName: 'Sanitation, Water & Estate Care',
    technicianId: 'usr-tech-2',
    technicianName: 'Suresh Patel',
    technicianPhone: '+91 98989 12345',
    submittedAt: subHours(48),
    responseDeadline: subHours(36),
    resolutionDeadline: subHours(12),
    resolvedAt: subHours(10),
    closedAt: subHours(8),
    resolutionNotes: 'Replaced wooden drawer sliders and fitted new LED desk lamp fixture.',
    rating: 5,
    feedback: 'Extremely quick resolution by Suresh ji! Desk is as good as new.',
    timeline: [
      { id: 'tl-41', status: 'submitted', title: 'Submitted', description: 'Complaint created.', timestamp: subHours(48), actorName: 'Ananya Verma', actorRole: 'student' },
      { id: 'tl-42', status: 'closed', title: 'Verified & Closed', description: 'Student rated 5 stars and closed issue.', timestamp: subHours(8), actorName: 'Ananya Verma', actorRole: 'student' }
    ],
    aiSuggestedCategory: 'Furniture',
    aiConfidence: 0.96,
    aiSummary: 'Study desk repair in Gargi Hostel.',
    sentiment: 'Satisfied'
  }
];

// Predictive Maintenance Insights
export const INITIAL_PREDICTIVE_INSIGHTS: PredictiveInsight[] = [
  {
    id: 'pred-1',
    buildingId: 'bldg-hostel-a',
    buildingName: 'Aryabhata Hostel (Block A)',
    assetType: 'Main Water Riser Pipeline',
    riskScore: 88,
    recommendation: 'Schedule pipe pressure test & joint sealing during upcoming weekend break. 3 leakages reported in past 30 days.',
    predictedFailureWindow: 'Next 5 - 7 Days',
    category: 'Water Leakage'
  },
  {
    id: 'pred-2',
    buildingId: 'bldg-engg',
    buildingName: 'Visvesvaraya Engineering Block',
    assetType: 'Floor 2 Network Switch Switch-2A',
    riskScore: 74,
    recommendation: 'Elevated port errors detected on Cisco switch. Recommend firmware upgrade or power supply unit check.',
    predictedFailureWindow: 'Next 10 Days',
    category: 'Internet'
  },
  {
    id: 'pred-3',
    buildingId: 'bldg-lib',
    buildingName: 'Central Knowledge Library',
    assetType: 'Central HVAC Compressor Unit 2',
    riskScore: 62,
    recommendation: 'Refrigerant pressure dropping. Recommend preventive oil filter cleaning.',
    predictedFailureWindow: 'Next 14 Days',
    category: 'Electrical'
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: subHours(0.3).replace('T', ' ').substring(0, 19),
    actorName: 'Suresh Patel',
    actorRole: 'technician',
    action: 'STATUS_UPDATE',
    target: 'Ticket CC-2026-88192',
    details: 'Status changed from Accepted -> Work In Progress',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'aud-2',
    timestamp: subHours(0.9).replace('T', ' ').substring(0, 19),
    actorName: 'Eng. Sunil Sharma',
    actorRole: 'dept_head',
    action: 'TECHNICIAN_ASSIGNED',
    target: 'Ticket CC-2026-88192',
    details: 'Assigned Suresh Patel (Plumbing Specialist)',
    ipAddress: '192.168.1.52'
  },
  {
    id: 'aud-3',
    timestamp: subHours(1.1).replace('T', ' ').substring(0, 19),
    actorName: 'CampusCare AI Engine',
    actorRole: 'admin',
    action: 'AUTO_TRIAGE',
    target: 'Ticket CC-2026-88192',
    details: 'Auto-categorized as Water Leakage, set Priority P1_CRITICAL',
    ipAddress: '127.0.0.1'
  }
];

// Notifications
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-1',
    title: 'Technician On Site',
    message: 'Suresh Patel is currently working on your water leakage ticket #CC-2026-88192.',
    type: 'status_change',
    linkId: 'cmp-101',
    timestamp: subHours(0.3),
    isRead: false
  },
  {
    id: 'notif-2',
    userId: 'usr-head-1',
    title: 'P1 SLA Breach Alert',
    message: 'Ticket #CC-2026-88192 has 30 mins remaining before P1 resolution SLA deadline!',
    type: 'sla_alert',
    linkId: 'cmp-101',
    timestamp: subHours(0.2),
    isRead: false
  }
];

// Initial Chat Messages
export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-1',
    complaintId: 'cmp-101',
    senderId: 'usr-student-1',
    senderName: 'Aarav Sharma',
    senderRole: 'student',
    text: 'Sir, water is coming close to the main power switchboard. Please turn off electricity for block A 3rd floor if needed!',
    timestamp: subHours(0.8),
    isRead: true
  },
  {
    id: 'chat-2',
    complaintId: 'cmp-101',
    senderId: 'usr-tech-2',
    senderName: 'Suresh Patel',
    senderRole: 'technician',
    text: 'Don\'t worry Aarav, I have notified the electrical maintenance team to isolate breaker #4 and I am shutting off the isolation valve right now.',
    timestamp: subHours(0.7),
    isRead: true
  }
];

// REACTIVE STORE STATE MANAGEMENT ENGINE
type Listener = () => void;

class Store {
  private users: User[] = [];
  private complaints: Complaint[] = [];
  private buildings: CampusBuilding[] = [];
  private departments: Department[] = [];
  private slaConfigs: SLAConfig[] = [];
  private predictiveInsights: PredictiveInsight[] = [];
  private auditLogs: AuditLog[] = [];
  private notifications: Notification[] = [];
  private chatMessages: ChatMessage[] = [];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const storedComplaints = localStorage.getItem('cc_complaints');
      this.complaints = storedComplaints ? JSON.parse(storedComplaints) : INITIAL_COMPLAINTS;

      const storedUsers = localStorage.getItem('cc_users');
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedBuildings = localStorage.getItem('cc_buildings');
      this.buildings = storedBuildings ? JSON.parse(storedBuildings) : INITIAL_BUILDINGS;

      const storedDepts = localStorage.getItem('cc_depts');
      this.departments = storedDepts ? JSON.parse(storedDepts) : INITIAL_DEPARTMENTS;

      const storedSLA = localStorage.getItem('cc_sla');
      this.slaConfigs = storedSLA ? JSON.parse(storedSLA) : DEFAULT_SLA;

      const storedInsights = localStorage.getItem('cc_insights');
      this.predictiveInsights = storedInsights ? JSON.parse(storedInsights) : INITIAL_PREDICTIVE_INSIGHTS;

      const storedLogs = localStorage.getItem('cc_audit_logs');
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : INITIAL_AUDIT_LOGS;

      const storedNotifs = localStorage.getItem('cc_notifs');
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : INITIAL_NOTIFICATIONS;

      const storedChat = localStorage.getItem('cc_chat');
      this.chatMessages = storedChat ? JSON.parse(storedChat) : INITIAL_CHAT;
    } catch (e) {
      console.warn('Failed to load from LocalStorage, falling back to defaults:', e);
      this.complaints = INITIAL_COMPLAINTS;
      this.users = INITIAL_USERS;
      this.buildings = INITIAL_BUILDINGS;
      this.departments = INITIAL_DEPARTMENTS;
      this.slaConfigs = DEFAULT_SLA;
      this.predictiveInsights = INITIAL_PREDICTIVE_INSIGHTS;
      this.auditLogs = INITIAL_AUDIT_LOGS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.chatMessages = INITIAL_CHAT;
    }
  }

  private saveAndNotify() {
    try {
      localStorage.setItem('cc_complaints', JSON.stringify(this.complaints));
      localStorage.setItem('cc_users', JSON.stringify(this.users));
      localStorage.setItem('cc_buildings', JSON.stringify(this.buildings));
      localStorage.setItem('cc_depts', JSON.stringify(this.departments));
      localStorage.setItem('cc_sla', JSON.stringify(this.slaConfigs));
      localStorage.setItem('cc_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('cc_notifs', JSON.stringify(this.notifications));
      localStorage.setItem('cc_chat', JSON.stringify(this.chatMessages));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
    this.listeners.forEach(fn => fn());
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // GETTERS
  public getUsers() { return [...this.users]; }
  public getComplaints() { return [...this.complaints]; }
  public getBuildings() { return [...this.buildings]; }
  public getDepartments() { return [...this.departments]; }
  public getSLAConfigs() { return [...this.slaConfigs]; }
  public getPredictiveInsights() { return [...this.predictiveInsights]; }
  public getAuditLogs() { return [...this.auditLogs]; }
  public getNotifications(userId?: string) {
    if (!userId) return [...this.notifications];
    return this.notifications.filter(n => n.userId === userId);
  }
  public getChatMessages(complaintId: string) {
    return this.chatMessages.filter(m => m.complaintId === complaintId);
  }

  // MUTATORS
  public addComplaint(complaint: Complaint) {
    this.complaints = [complaint, ...this.complaints];
    
    // Update building issue counter
    const bldg = this.buildings.find(b => b.id === complaint.buildingId);
    if (bldg) {
      bldg.activeIssuesCount += 1;
      bldg.healthScore = Math.max(20, bldg.healthScore - 5);
      bldg.categoriesCount[complaint.category] = (bldg.categoriesCount[complaint.category] || 0) + 1;
    }

    // Add Audit log
    this.logAudit(complaint.studentName, 'student', 'SUBMIT_COMPLAINT', `Ticket ${complaint.trackingNumber}`, `New complaint submitted: ${complaint.title}`);

    // Create notification for Dept Head
    this.addNotification({
      id: generateId('NOTIF'),
      userId: 'usr-head-1',
      title: `New Ticket: ${complaint.trackingNumber}`,
      message: `[${complaint.priority}] ${complaint.title} registered in ${complaint.buildingName}.`,
      type: 'assignment',
      linkId: complaint.id,
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.saveAndNotify();
  }

  public updateComplaintStatus(
    id: string, 
    newStatus: ComplaintStatus, 
    actorName: string, 
    actorRole: any, 
    notes?: string,
    proofAttachments?: any[]
  ) {
    const cmp = this.complaints.find(c => c.id === id);
    if (!cmp) return;

    cmp.status = newStatus;
    if (notes) cmp.resolutionNotes = notes;
    if (proofAttachments) cmp.proofAttachments = proofAttachments;
    if (newStatus === 'verified' || newStatus === 'closed') {
      cmp.resolvedAt = new Date().toISOString();
      if (newStatus === 'closed') cmp.closedAt = new Date().toISOString();

      // update building health
      const bldg = this.buildings.find(b => b.id === cmp.buildingId);
      if (bldg && bldg.activeIssuesCount > 0) {
        bldg.activeIssuesCount -= 1;
        bldg.healthScore = Math.min(100, bldg.healthScore + 4);
      }
    }

    const titleMap: Record<string, string> = {
      accepted: 'Technician Accepted Work',
      in_progress: 'Work Started on Site',
      proof_uploaded: 'Proof of Completion Uploaded',
      verified: 'Student Verified Resolution',
      closed: 'Ticket Closed',
      rejected: 'Technician Declined Work',
      reopened: 'Ticket Reopened by Student'
    };

    cmp.timeline.push({
      id: generateId('TL'),
      status: newStatus,
      title: titleMap[newStatus] || `Status updated to ${newStatus}`,
      description: notes || `Updated by ${actorName}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      attachments: proofAttachments
    });

    this.logAudit(actorName, actorRole, 'STATUS_UPDATE', `Ticket ${cmp.trackingNumber}`, `Status changed to ${newStatus}`);

    // Notify student
    this.addNotification({
      id: generateId('NOTIF'),
      userId: cmp.studentId,
      title: `Status Update: ${cmp.trackingNumber}`,
      message: `Your complaint is now "${newStatus.replace('_', ' ').toUpperCase()}".`,
      type: 'status_change',
      linkId: cmp.id,
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.saveAndNotify();
  }

  public assignTechnician(complaintId: string, techId: string, actorName: string) {
    const cmp = this.complaints.find(c => c.id === complaintId);
    const tech = this.users.find(u => u.id === techId);
    if (!cmp || !tech) return;

    cmp.technicianId = tech.id;
    cmp.technicianName = tech.name;
    cmp.technicianPhone = tech.phone;
    cmp.status = 'tech_assigned';

    cmp.timeline.push({
      id: generateId('TL'),
      status: 'tech_assigned',
      title: 'Technician Dispatched',
      description: `Assigned to ${tech.name} (${tech.phone}).`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'dept_head'
    });

    this.logAudit(actorName, 'dept_head', 'TECHNICIAN_ASSIGNED', `Ticket ${cmp.trackingNumber}`, `Assigned technician ${tech.name}`);

    // Notify Technician
    this.addNotification({
      id: generateId('NOTIF'),
      userId: tech.id,
      title: `New Task Assigned: ${cmp.trackingNumber}`,
      message: `You have been assigned ${cmp.title} in ${cmp.buildingName}.`,
      type: 'assignment',
      linkId: cmp.id,
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.saveAndNotify();
  }

  public rateComplaint(id: string, rating: number, feedback: string, emojiRating?: 'happy' | 'neutral' | 'unhappy') {
    const cmp = this.complaints.find(c => c.id === id);
    if (!cmp) return;

    cmp.rating = rating;
    cmp.emojiRating = emojiRating;
    cmp.feedback = feedback;
    cmp.status = 'closed';
    cmp.closedAt = new Date().toISOString();

    // Update assigned technician's score
    if (cmp.technicianId) {
      const tech = this.users.find(u => u.id === cmp.technicianId);
      if (tech) {
        tech.completedJobs = (tech.completedJobs || 0) + 1;
        tech.rating = Number((((tech.rating || 4.5) * 4 + rating) / 5).toFixed(1));
      }
    }

    cmp.timeline.push({
      id: generateId('TL'),
      status: 'closed',
      title: 'Student Verification & Rating',
      description: `Rated ${rating} Stars (${emojiRating || 'happy'}). Feedback: "${feedback}"`,
      timestamp: new Date().toISOString(),
      actorName: cmp.studentName,
      actorRole: 'student'
    });

    this.logAudit(cmp.studentName, 'student', 'RATE_COMPLAINT', `Ticket ${cmp.trackingNumber}`, `Rated ${rating} stars (${emojiRating || 'happy'})`);
    this.saveAndNotify();
  }

  public upvoteComplaint(complaintId: string, userId: string, userName: string) {
    const cmp = this.complaints.find(c => c.id === complaintId);
    if (!cmp) return;

    if (!cmp.upvotedUserIds) cmp.upvotedUserIds = [];
    if (cmp.upvotedUserIds.includes(userId)) return;

    cmp.upvotedUserIds.push(userId);
    cmp.upvotesCount = (cmp.upvotesCount || 1) + 1;

    // AI Auto Priority Boost if >= 3 affected students
    if (cmp.upvotesCount >= 3 && cmp.priority !== 'P1_CRITICAL') {
      cmp.priority = 'P1_CRITICAL';
      cmp.isEscalated = true;
      cmp.timeline.push({
        id: generateId('TL'),
        status: cmp.status,
        title: 'Priority Auto-Boosted to P1 Critical',
        description: `Community Support Alert: ${cmp.upvotesCount} affected students supported this ticket.`,
        timestamp: new Date().toISOString(),
        actorName: 'CampusCare AI Engine',
        actorRole: 'admin'
      });
    }

    this.logAudit(userName, 'student', 'COMMUNITY_UPVOTE', `Ticket ${cmp.trackingNumber}`, `Supported complaint (${cmp.upvotesCount} total affected students)`);
    this.saveAndNotify();
  }

  public rejectResolution(complaintId: string, reason: string, studentName: string) {
    const cmp = this.complaints.find(c => c.id === complaintId);
    if (!cmp) return;

    cmp.status = 'reopened';
    cmp.rejectionReason = reason;

    cmp.timeline.push({
      id: generateId('TL'),
      status: 'reopened',
      title: 'Resolution Rejected by Student',
      description: `Student rejected repair: "${reason}". Ticket reopened for re-inspection.`,
      timestamp: new Date().toISOString(),
      actorName: studentName,
      actorRole: 'student'
    });

    this.logAudit(studentName, 'student', 'REJECT_RESOLUTION', `Ticket ${cmp.trackingNumber}`, `Rejected resolution: ${reason}`);
    this.saveAndNotify();
  }

  public escalateComplaint(id: string, reason: string, actorName: string, actorRole: any) {
    const cmp = this.complaints.find(c => c.id === id);
    if (!cmp) return;

    cmp.isEscalated = true;
    cmp.escalationReason = reason;
    cmp.priority = 'P1_CRITICAL';

    cmp.timeline.push({
      id: generateId('TL'),
      status: cmp.status,
      title: 'Complaint Escalated to Critical Priority',
      description: `Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole
    });

    this.logAudit(actorName, actorRole, 'ESCALATE_TICKET', `Ticket ${cmp.trackingNumber}`, `Escalated: ${reason}`);

    // Notify Admin & Dept Head
    this.addNotification({
      id: generateId('NOTIF'),
      userId: 'usr-admin-1',
      title: `ESCALATION: ${cmp.trackingNumber}`,
      message: `Ticket escalated to P1 CRITICAL by ${actorName}: ${reason}`,
      type: 'escalation',
      linkId: cmp.id,
      timestamp: new Date().toISOString(),
      isRead: false
    });

    this.saveAndNotify();
  }

  public sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>) {
    const newMsg: ChatMessage = {
      ...message,
      id: generateId('MSG'),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.chatMessages.push(newMsg);
    this.saveAndNotify();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      this.saveAndNotify();
    }
  }

  public logAudit(actorName: string, actorRole: any, action: string, target: string, details: string) {
    const log: AuditLog = {
      id: generateId('AUD'),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName,
      actorRole,
      action,
      target,
      details,
      ipAddress: '192.168.1.1'
    };
    this.auditLogs = [log, ...this.auditLogs];
  }

  private addNotification(n: Notification) {
    this.notifications = [n, ...this.notifications];
  }

  public resetToSeedData() {
    localStorage.clear();
    this.loadInitialData();
    this.saveAndNotify();
  }
}

export const store = new Store();
