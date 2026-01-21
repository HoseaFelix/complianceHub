import { feedbackSchema } from "@/constants/constant";

type Feedback = z.infer<typeof feedbackSchema>;

// types/feedback.d.ts or types/feedback.ts

export interface FeedbackComment {
  comment: string
}

export interface FeedbackData {
  overview: string
  keyPoints: FeedbackComment[]
  bestPractices: FeedbackComment[]
  warnings: string[]
  summary: string
}

export interface FeedbackErrorState {
  error: string | null
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
