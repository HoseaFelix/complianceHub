'use server'
import Input from "./components/input";
import AnimatedContent from "./components/animatedContent";
import { WalletButton } from "./components/WalletButton";


export default async function Home() {

  return (

    <main className="min-h-screen bg-bg-dark text-text-main flex flex-col font-mona-sans selection:bg-accent-primary/30">

      {/* Top Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-card-border/30 bg-card-dark/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary via-accent-tertiary to-accent-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary via-accent-tertiary to-accent-secondary opacity-0 hover:opacity-50 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight gradient-text">Dictionary AI</h1>
            <div className="text-[10px] text-text-muted uppercase tracking-widest hidden sm:block font-medium">
              Decentralized Lexicographic Intelligence
            </div>
          </div>
        </div>
        <WalletButton />
      </nav>

      {/* Main Content Dashboard - Modern Asymmetrical Layout */}
      <div className="flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        
        {/* Hero Section */}
        <div className="max-w-[1400px] mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* Input Panel - 1 column, stacked on right */}
            <div className="h-[500px] lg:h-[650px] premium-card overflow-hidden flex flex-col bg-gradient-to-br from-card-dark/80 via-card-dark to-bg-dark/40 border-purple-700/30">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-primary via-accent-tertiary to-transparent"></div>
              <Input />
            </div>
            
            {/* Main Results Panel - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 h-[500px] lg:h-[650px] premium-card overflow-hidden flex flex-col relative bg-gradient-to-br from-card-dark/80 via-card-dark to-bg-dark/40 border-cyan-700/20">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-tertiary via-accent-secondary to-transparent"></div>
              <AnimatedContent />
            </div>


          </div>
        </div>

      </div>

      {/* Footer Info (Relevant Metrics) */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 premium-card border-accent-primary/20 hover:border-accent-primary/40 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-tertiary/10 text-accent-primary group-hover:from-accent-primary/30 group-hover:to-accent-tertiary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.248 6.253 2 10.5 2 15.5S6.248 24.747 12 24.747s10-4.747 10-10.247S17.752 6.253 12 6.253z" />
              </svg>
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Lexicographic Analysis</div>
          </div>
          <div className="text-2xl font-bold text-text-main">Expert-Grade <span className="text-sm font-normal text-accent-secondary">insights</span></div>
        </div>

        <div className="p-6 premium-card border-accent-tertiary/20 hover:border-accent-tertiary/40 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent-tertiary/20 to-accent-secondary/10 text-accent-tertiary group-hover:from-accent-tertiary/30 group-hover:to-accent-secondary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">GenLayer Consensus</div>
          </div>
          <div className="text-2xl font-bold text-text-main">Equivalence <span className="text-sm font-normal text-accent-tertiary">verified</span></div>
        </div>

        <div className="p-6 premium-card border-accent-secondary/20 hover:border-accent-secondary/40 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-accent-secondary/20 to-accent-primary/10 text-accent-secondary group-hover:from-accent-secondary/30 group-hover:to-accent-primary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Validator Accuracy</div>
          </div>
          <div className="text-2xl font-bold text-text-main">99.8% <span className="text-sm font-normal text-accent-secondary">on mainnet</span></div>
        </div>
      </div>

      {/* Powered by GenLayer Footer */}
      <div className="w-full border-t border-card-border/30 bg-card-dark/20 backdrop-blur-sm py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
          <span className="text-sm text-text-muted">Powered by</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-primary/10 to-accent-tertiary/10 border border-accent-primary/30">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent-primary to-accent-tertiary"></div>
            <span className="text-sm font-semibold text-accent-primary">GenLayer</span>
          </div>
          <span className="text-xs text-text-muted/60 ml-2">• Decentralized Intelligence</span>
        </div>
      </div>

    </main>
  );
}