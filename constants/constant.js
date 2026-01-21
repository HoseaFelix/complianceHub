import { z } from 'zod';
import { useErrorStore, useFeedbackStore } from '@/store/store';

export const feedbackSchema = z.object({
  overview: z.string(),
  keyPoints: z.array(z.object({ comment: z.string() })),
  bestPractices: z.array(z.object({ comment: z.string() })),
  warnings: z.array(z.string()),
  summary: z.string(),
});




