'use client'

import { useFeedbackStore, useErrorStore } from '@/store/store'
import { FeedbackData } from '@/types'
import React from 'react'

const AnimatedContent = () => {
  const { error } = useErrorStore()
  const {
    overview,
    keyPoints,
    bestPractices,
    warnings,
    summary,
  } = useFeedbackStore() as FeedbackData

  const hasFeedback =
    overview.trim() !== '' ||
    keyPoints.length > 0 ||
    bestPractices.length > 0 ||
    warnings.length > 0 ||
    summary.trim() !== ''

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-card-border/50 flex justify-between items-center bg-card-dark/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-accent-tertiary/20 to-accent-secondary/10 border border-card-border/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.248 6.253 2 10.5 2 15.5S6.248 24.747 12 24.747s10-4.747 10-10.247S17.752 6.253 12 6.253z" />
            </svg>
          </div>
          <h3 className="font-semibold text-text-main">Results</h3>
        </div>
        {!hasFeedback && <span className="text-xs text-text-muted/70 px-3 py-1.5 rounded-full bg-card-dark border border-card-border/30 font-medium">Waiting for input</span>}
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!hasFeedback && !error && (
          <div className="h-full flex flex-col items-center justify-center text-text-muted/50 space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 rounded-2xl bg-card-dark border border-card-border flex items-center justify-center relative z-10 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C6.248 6.253 2 10.5 2 15.5S6.248 24.747 12 24.747s10-4.747 10-10.247S17.752 6.253 12 6.253z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4 text-center">
              <div className="inline-block">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/10 border border-card-border/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C6.248 6.253 2 10.5 2 15.5S6.248 24.747 12 24.747s10-4.747 10-10.247S17.752 6.253 12 6.253z" />
                  </svg>
                </div>
              </div>
              <div className="max-w-xs">
                <h4 className="text-lg font-semibold text-text-main mb-1">Ready for Analysis</h4>
                <p className="text-sm text-text-muted">Submit a word or phrase on the left to discover detailed insights.</p>
              </div>
            </div>
          </div>
        )}

        {hasFeedback && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Analysis Stats */}
            <div className="grid grid-cols-3 gap-3 pb-6 border-b border-card-border/30">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-accent-primary/15 to-accent-primary/5 border border-accent-primary/20">
                <div className="text-2xl font-black text-accent-primary">{keyPoints.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-text-muted mt-2 font-semibold">Key Points</div>
              </div>
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-accent-secondary/15 to-accent-secondary/5 border border-accent-secondary/20">
                <div className="text-2xl font-black text-accent-secondary">{bestPractices.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-text-muted mt-2 font-semibold">Best Practices</div>
              </div>
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-accent-tertiary/15 to-accent-tertiary/5 border border-accent-tertiary/20">
                <div className="text-2xl font-black text-accent-tertiary">{warnings.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-text-muted mt-2 font-semibold">Warnings</div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Overview</h2>
              <p className="text-sm text-text-main leading-relaxed bg-gradient-to-br from-card-dark/50 to-bg-dark/30 p-4 rounded-lg border border-card-border/30 hover:border-accent-primary/20 transition-colors">
                {overview}
              </p>
            </div>

            {/* Key Points */}
            {keyPoints.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Key Points</h2>
                <div className="grid gap-2">
                  {keyPoints.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3.5 rounded-lg bg-gradient-to-r from-accent-primary/5 to-transparent border border-accent-primary/20 hover:border-accent-primary/40 transition-colors group">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                      <span className="text-sm text-text-main group-hover:text-accent-primary/90 transition-colors">{item.comment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Practices */}
            {bestPractices.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Best Practices</h2>
                <div className="space-y-2">
                  {bestPractices.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm p-3.5 rounded-lg bg-gradient-to-r from-accent-secondary/5 to-transparent border border-accent-secondary/20 hover:border-accent-secondary/40 transition-colors group">
                      <svg className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-main group-hover:text-accent-secondary/90 transition-colors">{item.comment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Warnings</h2>
                <div className="space-y-2">
                  {warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-sm p-3.5 rounded-lg bg-gradient-to-r from-destructive/5 to-transparent border border-destructive/20 hover:border-destructive/40 transition-colors group">
                      <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-main group-hover:text-destructive/90 transition-colors">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2.5 pt-4 border-t border-card-border/30">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">Definition</h2>
              <p className="text-sm text-text-main italic leading-relaxed p-4 rounded-lg bg-gradient-to-br from-card-dark/30 to-bg-dark/20 border border-card-border/30 hover:border-accent-tertiary/20 transition-colors">
                &quot;{summary}&quot;
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default AnimatedContent