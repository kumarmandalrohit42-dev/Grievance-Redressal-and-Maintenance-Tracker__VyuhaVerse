/// <reference types="vite/client" />

export type UserRole = 'student' | 'technician' | 'dept_head' | 'admin';

export type ComplaintCategory = 
  | 'Electrical'
  | 'Internet'
  | 'Water Leakage'
  | 'Furniture'
  | 'Hostel'
  | 'Cleaning'
  | 'Security'
  | 'Medical'
  | 'Transport'
  | 'Academic'
  | 'Others';

export type PriorityLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export type ComplaintStatus = 
  | 'submitted'
  | 'categorized'
  | 'dept_assigned'
  | 'tech_assigned'
  | 'accepted'
  | 'in_progress'
  | 'proof_uploaded'
  | 'verified'
  | 'resolved'
  | 'closed'
  | 'reopened'
  | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  specialization?: ComplaintCategory[];
  rating?: number;
  completedJobs?: number;
  location?: { lat: number; lng: number; buildingId?: string };
  badges?: string[];
  points?: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf' | 'document';
  size: string;
  uploadedAt: string;
  aiVisionDetectedType?: string;
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  attachments?: Attachment[];
}

export interface Complaint {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory?: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  studentId: string;
  studentName: string;
  studentEmail: string;
  buildingId: string;
  buildingName: string;
  floor?: string;
  roomNumber?: string;
  attachments: Attachment[];
  proofAttachments?: Attachment[];
  beforeImage?: string;
  afterImage?: string;
  departmentId: string;
  departmentName: string;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  rejectionReason?: string;
  timeline: TimelineEvent[];
  submittedAt: string;
  responseDeadline: string; // ISO String
  resolutionDeadline: string; // ISO String
  resolvedAt?: string;
  closedAt?: string;
  resolutionNotes?: string;
  rating?: number;
  emojiRating?: 'happy' | 'neutral' | 'unhappy';
  feedback?: string;
  isEscalated?: boolean;
  escalationReason?: string;
  aiSuggestedCategory?: ComplaintCategory;
  aiConfidence?: number;
  aiSummary?: string;
  sentiment?: 'Frustrated' | 'Urgent' | 'Neutral' | 'Satisfied';
  duplicateOfId?: string;
  upvotesCount?: number;
  upvotedUserIds?: string[];
  qrCodeLocation?: string;
  audioRecordingUrl?: string;
}

export interface SLAConfig {
  category: ComplaintCategory;
  p1ResponseHours: number;
  p1ResolutionHours: number;
  p2ResponseHours: number;
  p2ResolutionHours: number;
  p3ResponseHours: number;
  p3ResolutionHours: number;
  p4ResponseHours: number;
  p4ResolutionHours: number;
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  x: number; // map canvas percentage X (0-100)
  y: number; // map canvas percentage Y (0-100)
  totalRooms: number;
  activeIssuesCount: number;
  healthScore: number; // 0 - 100
  categoriesCount: Record<string, number>;
  densityStatus?: 'low' | 'moderate' | 'high';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headEmail: string;
  activeTechs: number;
  openTickets: number;
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  points?: number;
}

export interface ChatMessage {
  id: string;
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachments?: Attachment[];
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status_change' | 'sla_alert' | 'escalation' | 'assignment' | 'completion' | 'chat';
  linkId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

export interface PredictiveInsight {
  id: string;
  buildingId: string;
  buildingName: string;
  assetType: string;
  riskScore: number;
  recommendation: string;
  predictedFailureWindow: string;
  category: ComplaintCategory;
}

export interface CampusHealthMetrics {
  healthScore: number;
  totalComplaintsThisMonth: number;
  resolvedComplaintsCount: number;
  avgResolutionHours: number;
  slaCompliancePercentage: number;
  studentSatisfactionRating: number;
}

export interface QRCodeLocation {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor: string;
  roomNumber: string;
  qrCodeUrl: string;
}
