import {create} from "zustand"
import { Feedback } from "../types"


type errorState = {
    error: string;
    setError: (msg: string) => void;
    clearError: () => void;
}

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
    



export const useFeedbackStore =create<Feedback>(()=>({
    overview: "",
    keyPoints: [],
    bestPractices: [],
    warnings: [],
    summary: ""


}))

export const useErrorStore = create<errorState>((set)=>({
    error: '',
    setError: (msg) => set({error: msg}),
    clearError: () => set({error: ''})

}))
