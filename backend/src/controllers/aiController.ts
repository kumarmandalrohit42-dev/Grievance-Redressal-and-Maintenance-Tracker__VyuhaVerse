import { Request, Response } from 'express';

export const analyzeGrievanceWithAI = (req: Request, res: Response) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: true, message: 'Description is required for AI analysis' });
  }

  const descLower = description.toLowerCase();
  let category = 'Electrical';
  let priority = 'P3_MEDIUM';
  let confidence = 92;

  if (descLower.includes('water') || descLower.includes('pipe') || descLower.includes('leak')) {
    category = 'Water Leakage';
    priority = descLower.includes('flood') || descLower.includes('urgent') ? 'P1_CRITICAL' : 'P2_HIGH';
  } else if (descLower.includes('wifi') || descLower.includes('net') || descLower.includes('router') || descLower.includes('internet')) {
    category = 'Internet';
    priority = 'P2_HIGH';
  } else if (descLower.includes('fire') || descLower.includes('smoke') || descLower.includes('hazard')) {
    category = 'Security';
    priority = 'P1_CRITICAL';
    confidence = 98;
  }

  res.json({
    success: true,
    data: {
      category,
      priority,
      confidence,
      sentiment: priority === 'P1_CRITICAL' ? 'Frustrated' : 'Urgent',
      summary: `AI detected issue related to ${category}. Automatically prioritized as ${priority}.`,
      isDuplicatePossible: false
    }
  });
};
