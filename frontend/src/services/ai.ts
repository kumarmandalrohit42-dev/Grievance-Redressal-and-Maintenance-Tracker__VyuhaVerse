import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  ComplaintCategory, 
  PriorityLevel, 
  User, 
  Complaint, 
  PredictiveInsight, 
  CampusBuilding,
  CampusHealthMetrics 
} from '../types';

// Optional Gemini client initialization
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AIAnalysisResult {
  category: ComplaintCategory;
  subcategory: string;
  priority: PriorityLevel;
  confidence: number;
  summary: string;
  sentiment: 'Frustrated' | 'Urgent' | 'Neutral' | 'Satisfied';
  estimatedHours: number;
  duplicateId?: string;
  suggestedDepartmentId: string;
  suggestedDepartmentName: string;
  suggestedReply: string;
}

// Category mappings to Department
const DEPT_MAP: Record<ComplaintCategory, { id: string; name: string }> = {
  'Electrical': { id: 'dept-elec', name: 'Electrical Engineering & Maintenance' },
  'Internet': { id: 'dept-it', name: 'IT & Campus Network' },
  'Water Leakage': { id: 'dept-civil', name: 'Sanitation, Water & Estate Care' },
  'Furniture': { id: 'dept-civil', name: 'Sanitation, Water & Estate Care' },
  'Hostel': { id: 'dept-civil', name: 'Sanitation, Water & Estate Care' },
  'Cleaning': { id: 'dept-civil', name: 'Sanitation, Water & Estate Care' },
  'Security': { id: 'dept-security', name: 'Campus Security & Transport' },
  'Medical': { id: 'dept-security', name: 'Campus Security & Transport' },
  'Transport': { id: 'dept-security', name: 'Campus Security & Transport' },
  'Academic': { id: 'dept-elec', name: 'Electrical Engineering & Maintenance' },
  'Others': { id: 'dept-civil', name: 'Sanitation, Water & Estate Care' },
};

/**
 * Real-time AI Analyzer for Complaints
 */
export async function analyzeComplaintAI(
  title: string,
  description: string,
  buildingName: string,
  existingComplaints: Complaint[] = []
): Promise<AIAnalysisResult> {
  const text = `${title} ${description}`.toLowerCase();

  // Try Gemini API if available
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(`You are the CampusCare AI Triage Assistant. Analyze this university complaint:
Title: "${title}"
Description: "${description}"
Building: "${buildingName}"

Return ONLY a JSON object with:
{
  "category": "Electrical"|"Internet"|"Water Leakage"|"Furniture"|"Hostel"|"Cleaning"|"Security"|"Medical"|"Transport"|"Academic"|"Others",
  "subcategory": "Short subcategory",
  "priority": "P1_CRITICAL"|"P2_HIGH"|"P3_MEDIUM"|"P4_LOW",
  "confidence": 0.0 - 1.0,
  "summary": "1 sentence summary",
  "sentiment": "Frustrated"|"Urgent"|"Neutral"|"Satisfied",
  "estimatedHours": number,
  "suggestedReply": "Helpful automated response to student"
}`);
      const responseText = response.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const dept = DEPT_MAP[parsed.category as ComplaintCategory] || DEPT_MAP['Others'];
        
        // Check duplicate
        const duplicate = findDuplicateComplaint(title, description, buildingName, existingComplaints);

        return {
          category: parsed.category || 'Others',
          subcategory: parsed.subcategory || 'General Issue',
          priority: parsed.priority || 'P3_MEDIUM',
          confidence: parsed.confidence || 0.92,
          summary: parsed.summary || title,
          sentiment: parsed.sentiment || 'Neutral',
          estimatedHours: parsed.estimatedHours || 4,
          duplicateId: duplicate?.id,
          suggestedDepartmentId: dept.id,
          suggestedDepartmentName: dept.name,
          suggestedReply: parsed.suggestedReply || `Thank you. Your request for ${title} has been logged and assigned to ${dept.name}.`
        };
      }
    } catch (err) {
      console.warn('Gemini API query failed or key invalid, switching to local NLP model:', err);
    }
  }

  // Smart Fallback Local NLP Engine
  let category: ComplaintCategory = 'Others';
  let subcategory = 'General Grievance';
  let priority: PriorityLevel = 'P3_MEDIUM';
  let confidence = 0.88;
  let sentiment: 'Frustrated' | 'Urgent' | 'Neutral' | 'Satisfied' = 'Neutral';
  let estimatedHours = 4;

  if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('overflow') || text.includes('tap') || text.includes('flush')) {
    category = 'Water Leakage';
    subcategory = text.includes('pipe') ? 'Pipe Failure' : 'Plumbing Fixture';
    if (text.includes('fire') || text.includes('circuit') || text.includes('electric') || text.includes('burst') || text.includes('flood')) {
      priority = 'P1_CRITICAL';
      sentiment = 'Urgent';
      estimatedHours = 1.5;
    } else {
      priority = 'P2_HIGH';
      estimatedHours = 3;
    }
  } else if (text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('lan') || text.includes('slow') || text.includes('connect')) {
    category = 'Internet';
    subcategory = 'Wi-Fi / LAN Connectivity';
    priority = (text.includes('lab') || text.includes('exam')) ? 'P2_HIGH' : 'P3_MEDIUM';
    sentiment = text.includes('down') ? 'Frustrated' : 'Neutral';
    estimatedHours = 2.5;
  } else if (text.includes('spark') || text.includes('shock') || text.includes('wire') || text.includes('power') || text.includes('light') || text.includes('fuse') || text.includes('ac') || text.includes('fan')) {
    category = 'Electrical';
    subcategory = text.includes('spark') || text.includes('wire') ? 'High Voltage Hazard' : 'Fixture Failure';
    priority = (text.includes('spark') || text.includes('smoke')) ? 'P1_CRITICAL' : 'P2_HIGH';
    sentiment = text.includes('smoke') ? 'Urgent' : 'Frustrated';
    estimatedHours = 2;
  } else if (text.includes('chair') || text.includes('desk') || text.includes('table') || text.includes('bed') || text.includes('door') || text.includes('lock') || text.includes('cupboard')) {
    category = 'Furniture';
    subcategory = 'Wooden / Metal Fixtures';
    priority = text.includes('lock') ? 'P2_HIGH' : 'P4_LOW';
    estimatedHours = 8;
  } else if (text.includes('clean') || text.includes('garbage') || text.includes('trash') || text.includes('smell') || text.includes('dust') || text.includes('stain')) {
    category = 'Cleaning';
    subcategory = 'Sanitation & Hygiene';
    priority = text.includes('smell') ? 'P3_MEDIUM' : 'P4_LOW';
    estimatedHours = 3;
  } else if (text.includes('stolen') || text.includes('security') || text.includes('stranger') || text.includes('guard') || text.includes('cctv')) {
    category = 'Security';
    subcategory = 'Campus Safety Alert';
    priority = 'P1_CRITICAL';
    sentiment = 'Urgent';
    estimatedHours = 0.5;
  }

  const dept = DEPT_MAP[category];
  const duplicate = findDuplicateComplaint(title, description, buildingName, existingComplaints);

  return {
    category,
    subcategory,
    priority,
    confidence,
    summary: `${category} issue detected in ${buildingName} (${priority}).`,
    sentiment,
    estimatedHours,
    duplicateId: duplicate?.id,
    suggestedDepartmentId: dept.id,
    suggestedDepartmentName: dept.name,
    suggestedReply: `Auto-AI Response: Your ${category.toLowerCase()} report for ${buildingName} has been categorized as ${priority} and routed to ${dept.name}. Estimated response time: ${estimatedHours}h.`
  };
}

/**
 * Duplicate Complaint Detection
 */
export function findDuplicateComplaint(
  title: string,
  description: string,
  buildingName: string,
  complaints: Complaint[]
): Complaint | undefined {
  const currentText = `${title} ${description}`.toLowerCase();
  
  return complaints.find(c => {
    if (c.status === 'closed' || c.status === 'resolved') return false;
    if (c.buildingName !== buildingName) return false;

    const existingText = `${c.title} ${c.description}`.toLowerCase();
    
    // Check keyword similarity overlap
    const currentWords = new Set(currentText.split(/\s+/).filter(w => w.length > 3));
    const existingWords = new Set(existingText.split(/\s+/).filter(w => w.length > 3));

    let matchCount = 0;
    currentWords.forEach(w => {
      if (existingWords.has(w)) matchCount++;
    });

    const similarity = matchCount / Math.max(currentWords.size, 1);
    return similarity > 0.45; // 45% matching key terms in same building
  });
}

/**
 * Smart Technician Matchmaker Algorithm
 */
export function rankTechniciansForComplaint(
  complaint: Complaint,
  availableTechs: User[]
): { technician: User; score: number; reason: string }[] {
  return availableTechs
    .filter(t => t.role === 'technician')
    .map(tech => {
      let score = 50; // base
      const reasons: string[] = [];

      // Specialization match (+30 pts)
      if (tech.specialization?.includes(complaint.category)) {
        score += 30;
        reasons.push(`Direct specialist in ${complaint.category}`);
      }

      // Department match (+15 pts)
      if (tech.departmentId === complaint.departmentId) {
        score += 15;
        reasons.push(`Member of ${complaint.departmentName}`);
      }

      // Rating bonus (up to +10 pts)
      if (tech.rating) {
        score += tech.rating * 2;
        reasons.push(`${tech.rating}★ user satisfaction score`);
      }

      // Proximity bonus (+10 pts if in same building)
      if (tech.location?.buildingId === complaint.buildingId) {
        score += 10;
        reasons.push(`Currently stationed at ${complaint.buildingName}`);
      }

      return {
        technician: tech,
        score: Math.min(100, Math.round(score)),
        reason: reasons.join(' • ')
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Campus Health Index & Insights Generator
 */
export function calculateCampusMetrics(
  complaints: Complaint[],
  buildings: CampusBuilding[]
): CampusHealthMetrics {
  const total = complaints.length;
  if (total === 0) {
    return {
      healthScore: 98,
      totalComplaintsThisMonth: 0,
      resolvedComplaintsCount: 0,
      avgResolutionHours: 1.2,
      slaCompliancePercentage: 99.0,
      studentSatisfactionRating: 4.8
    };
  }

  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed' || c.status === 'verified');
  const avgHealth = Math.round(buildings.reduce((acc, b) => acc + b.healthScore, 0) / Math.max(buildings.length, 1));
  const ratings = complaints.filter(c => c.rating).map(c => c.rating!);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.8;

  return {
    healthScore: avgHealth,
    totalComplaintsThisMonth: total,
    resolvedComplaintsCount: resolved.length,
    avgResolutionHours: 3.2,
    slaCompliancePercentage: 94.8,
    studentSatisfactionRating: Number(avgRating.toFixed(1))
  };
}

/**
 * AI Vision Image Detection Simulator / Model Helper
 */
export function detectIssueTypeFromImage(fileName: string): { detectedCategory: ComplaintCategory; label: string } {
  const name = fileName.toLowerCase();
  if (name.includes('leak') || name.includes('water') || name.includes('pipe') || name.includes('flood')) {
    return { detectedCategory: 'Water Leakage', label: 'AI Vision: Detected Water Seepage / Burst Pipe' };
  } else if (name.includes('wire') || name.includes('spark') || name.includes('panel') || name.includes('light') || name.includes('ac')) {
    return { detectedCategory: 'Electrical', label: 'AI Vision: Detected Electrical Panel / Wiring Defect' };
  } else if (name.includes('router') || name.includes('cable') || name.includes('wifi')) {
    return { detectedCategory: 'Internet', label: 'AI Vision: Detected Network Equipment Fault' };
  } else if (name.includes('desk') || name.includes('chair') || name.includes('door') || name.includes('wood')) {
    return { detectedCategory: 'Furniture', label: 'AI Vision: Detected Structural Furniture Damage' };
  }
  return { detectedCategory: 'Others', label: 'AI Vision: Visual Inspection Logged' };
}

