import { Request, Response } from 'express';

export const getCampusMetrics = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      healthScore: 84.5,
      totalComplaintsThisMonth: 142,
      resolvedComplaintsCount: 118,
      avgResolutionHours: 4.2,
      slaCompliancePercentage: 94.2,
      studentSatisfactionRating: 4.8
    }
  });
};

export const getBuildingsHealth = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'b1', name: 'Tech Hub CS Block', code: 'CS-TH', healthScore: 88, activeIssuesCount: 4, densityStatus: 'moderate' },
      { id: 'b2', name: 'Central Auditorium', code: 'AUD-MAIN', healthScore: 65, activeIssuesCount: 7, densityStatus: 'high' },
      { id: 'b3', name: 'Academic Block A', code: 'ACA-A', healthScore: 94, activeIssuesCount: 2, densityStatus: 'low' },
      { id: 'b4', name: 'Hostel Complex H3', code: 'HST-H3', healthScore: 79, activeIssuesCount: 5, densityStatus: 'moderate' }
    ]
  });
};
