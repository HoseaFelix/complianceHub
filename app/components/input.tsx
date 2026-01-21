"use client";
import { useErrorStore, useFeedbackStore } from "@/store/store";
import { GENLAYER_CONFIG, DICTIONARY_METHODS, DICTIONARY_CONFIG } from "@/constants/genlayer_config";
import { useWallet } from "@/app/context/WalletContext";
import React, { useState } from "react";
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { privateKeyToAccount } from 'viem/accounts';

const Input = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { account, walletType } = useWallet();

  const getClient = async () => {
    if (!account) throw new Error("Wallet not connected");

    let client;
    
    if (walletType === 'auto') {
      if (!account.privateKey) throw new Error("Private key not available");
      const viemAccount = privateKeyToAccount(
        (account.privateKey.startsWith('0x') ? account.privateKey : `0x${account.privateKey}`) as `0x${string}`
      );
      client = createClient({
        chain: studionet,
        account: viemAccount,
      });
    } else if (walletType === 'metamask') {
      client = createClient({
        chain: studionet,
        account: account.address as `0x${string}`,
      });
    }
    
    return client;
  };

  const analyzeWord = async (wordOrPhrase: string) => {
    try {
      const client = await getClient();
      if (!client) throw new Error("Client initialization failed");

      setStatus("Submitting to GenLayer...");
      
      const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || GENLAYER_CONFIG.CONTRACT_ADDRESS;
      if (!address) {
        throw new Error("Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
      }
      
      const txHash = await client.writeContract({
        address: address as `0x${string}`,
        functionName: DICTIONARY_METHODS.ANALYZE_WORD,
        args: [wordOrPhrase],
        value: 0n,
      });

      console.log("Transaction submitted:", txHash);
      setStatus("Processing analysis (this may take 30-60 seconds)...");
      
      let receipt;
      try {
        receipt = await client.waitForTransactionReceipt({
          hash: txHash,
          retries: 300,
          interval: 3000,
        });
      } catch (waitError) {
        console.error("Wait error:", waitError);
        throw new Error(`Transaction did not finalize within expected time. Hash: ${txHash}`);
      }

      console.log("Transaction finalized!");
      
      if (receipt.result !== 0 && receipt.result !== 6) {
        console.error("Transaction failed:", receipt.result, receipt.resultName);
        throw new Error(`Transaction failed: ${receipt.resultName || 'Unknown error'}`);
      }

      setStatus("Fetching analysis results...");

      // Get the latest analysis ID
      const latestAnalysisId = await client.readContract({
        address: address as `0x${string}`,
        functionName: DICTIONARY_METHODS.GET_LATEST_ANALYSIS_ID,
        args: [],
      }) as string;
      
      if (!latestAnalysisId || latestAnalysisId === '') {
        throw new Error('No analysis ID returned');
      }

      console.log("Latest analysis ID:", latestAnalysisId);

      // Fetch the analysis result
      const analysisResult = await client.readContract({
        address: address as `0x${string}`,
        functionName: DICTIONARY_METHODS.GET_ANALYSIS,
        args: [latestAnalysisId],
      }) as Record<string, unknown>;

      console.log("Analysis result (raw):", analysisResult);
      console.log("Analysis result type:", typeof analysisResult);
      console.log("Is Map?:", analysisResult instanceof Map);

      // Convert Map to object if needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = analysisResult;
      if (analysisResult instanceof Map) {
        result = Object.fromEntries(analysisResult);
      }

      console.log("Analysis result (converted):", result);

      // Extract values with fallbacks
      const overview = String(result.overview || "");
      const keyPoints = Array.isArray(result.key_points) 
        ? result.key_points.map((p: string) => ({ comment: String(p) }))
        : [];
      const bestPractices = Array.isArray(result.best_practices)
        ? result.best_practices.map((p: string) => ({ comment: String(p) }))
        : [];
      const warnings = Array.isArray(result.warnings)
        ? result.warnings.map((w: string) => String(w))
        : [];
      const summary = String(result.summary || "");

      console.log("Parsed data:", { overview, keyPoints, bestPractices, warnings, summary });

      // Update store
      useFeedbackStore.setState({
        overview,
        keyPoints,
        bestPractices,
        warnings,
        summary,
      });

      useErrorStore.getState().clearError();
      setStatus("Done ✅");

    } catch (err: unknown) {
      console.error("Analysis Error:", err);
      useErrorStore.getState().setError(
        (err instanceof Error ? err.message : String(err)) || "Word analysis failed"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!account) {
      useErrorStore.getState().setError("Please connect your wallet first");
      return;
    }

    const trimmedWord = word.trim();
    if (!trimmedWord) {
      useErrorStore.getState().setError("Please enter a word or phrase");
      return;
    }

    if (trimmedWord.length > DICTIONARY_CONFIG.MAX_CHARS) {
      useErrorStore.getState().setError(`Input must be under ${DICTIONARY_CONFIG.MAX_CHARS} characters`);
      return;
    }

    try {
      setLoading(true);
      await analyzeWord(trimmedWord);
    } catch (error) {
      console.error(error);
      useErrorStore.getState().setError("Analysis failed. See console.");
    } finally {
      setLoading(false);
      setWord("");
      setStatus("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-card-border/50">
        <h3 className="font-semibold text-text-main flex items-center gap-2">
          <span className="text-transparent bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.248 6.253 2 10.5 2 15.5S6.248 24.747 12 24.747s10-4.747 10-10.247S17.752 6.253 12 6.253z" />
            </svg>
          </span>
          Input Analysis
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Enter any word or phrase to get detailed lexicographic analysis powered by decentralized AI.
        </p>
      </div>

      {/* Form Body */}
      <div className="flex-1 p-6 flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col gap-4"
        >
          <div className="flex-1 relative group">
            <label className="text-xs font-semibold text-text-muted mb-2 block uppercase tracking-wider">Word or Phrase</label>
            <textarea
              disabled={loading}
              onChange={(e) => setWord(e.target.value)}
              value={word}
              placeholder={loading ? status : "Enter a word or phrase to analyze..."}
              className="w-full h-full min-h-[200px] p-4 premium-input bg-card-dark resize-none focus:ring-1 focus:ring-accent-primary/50"
            />
            <div className="absolute bottom-4 right-4 text-xs text-text-muted/60">
              {word.length} / {DICTIONARY_CONFIG.MAX_CHARS}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-card-border/50 flex justify-between items-center gap-4">
            <div className="text-xs text-text-muted">
              Cost: <span className="text-accent-secondary font-mono font-semibold">~0.005 GEN</span>
            </div>
            <button
              type="submit"
              disabled={loading || !word.trim() || !account}
              className="premium-btn px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;
