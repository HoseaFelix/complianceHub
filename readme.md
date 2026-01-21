this is a sample code used for a content validator app, pick what you need from this code, everything here are fully functional 

import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { CONTRACT_ADDRESS, CONTRACT_METHODS } from '@/config/genlayer';
import { useWallet } from '@/contexts/WalletContext';

export const useContentValidator = () => {
  const { account, walletType } = useWallet();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      if (!account) {
        setInitialized(false);
        setClient(null);
        return;
      }

      try {
        console.log('Initializing client with account:', account.address);
        console.log('Wallet type:', walletType);
        
        let newClient;
        
        if (walletType === 'auto') {
          // For auto accounts, pass the FULL account object (includes private key)
          newClient = createClient({
            chain: studionet,
            account: account, // ✅ Pass the entire account object, not just address
          });
        } else if (walletType === 'metamask') {
          // For MetaMask, we need to handle it differently
          // MetaMask uses window.ethereum provider for signing
          // NOTE: This might require additional setup - check GenLayer docs
          console.warn('MetaMask support is experimental');
          newClient = createClient({
            chain: studionet,
            account: account.address, // For MetaMask, address string might work
          });
        }
        
        console.log('Client created successfully');
        
        setClient(newClient);
        setInitialized(true);
        setError(null);
      } catch (err) {
        setError(`Failed to initialize client: ${err.message}`);
        setInitialized(false);
        console.error('Client initialization error:', err);
      }
    };

    initClient();
  }, [account, walletType]);

  const validateContent = useCallback(async (content, minWords) => {
    if (!client || !initialized) {
      const error = 'Client not initialized. Please wait...';
      setError(error);
      return null;
    }

    if (!CONTRACT_ADDRESS) {
      const error = 'Contract address not configured. Please set VITE_CONTRACT_ADDRESS in .env';
      setError(error);
      return null;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Submitting validation transaction...');
      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.VALIDATE_CONTENT,
        args: [content, minWords],
        value: 0n,
      });

      console.log('Transaction submitted:', txHash);
      console.log('Waiting for transaction to be finalized (this may take 30-60 seconds)...');
      
      let receipt;
      try {
        receipt = await client.waitForTransactionReceipt({
          hash: txHash,
          status: 'FINALIZED',
          retries: 300,
          interval: 3000,
        });
      } catch (waitError) {
        console.error('Wait error:', waitError);
        
        try {
          const tx = await client.getTransaction({ hash: txHash });
          console.log('Transaction details:', tx);
        } catch (getTxError) {
          console.error('Could not fetch transaction:', getTxError);
        }
        
        throw new Error(`Transaction did not finalize within expected time. Hash: ${txHash}`);
      }

      console.log('Transaction finalized!');
      console.log('Receipt:', receipt);
      
      if (receipt.result !== 0 && receipt.result !== 6) {
        console.error('Transaction failed:', receipt.result, receipt.result_name);
        throw new Error(`Transaction failed: ${receipt.result_name || 'Unknown error'}`);
      }

      // Get the latest validation ID
      const latestValidationId = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_LATEST_VALIDATION_ID,
        args: [],
      });
      
      if (!latestValidationId || latestValidationId === '') {
        throw new Error('No validation ID returned');
      }

      console.log('Latest validation ID:', latestValidationId);

      // Fetch the validation result
      const validationResult = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION,
        args: [latestValidationId],
      });

      console.log('Validation result:', validationResult);

      setResult(validationResult);
      return validationResult;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during validation';
      setError(errorMsg);
      console.error('Validation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client, initialized]);

  const getValidationHistory = useCallback(async (userAddress) => {
    if (!client || !initialized) {
      setError('Client not initialized');
      return [];
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured');
      return [];
    }

    if (!userAddress) {
      setError('User address is required');
      return [];
    }

    try {
      console.log('Fetching validation history for:', userAddress);
      
      const history = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_USER_VALIDATIONS,
        args: [userAddress],
      });

      console.log('Validation history SUCCESS:', history);
      return history || [];
    } catch (err) {
      const errorMsg = `Failed to fetch history: ${err.message}`;
      setError(errorMsg);
      console.error('History fetch error:', err);
      return [];
    }
  }, [client, initialized]);

  const getValidationCount = useCallback(async () => {
    if (!client || !initialized) {
      return 0;
    }

    if (!CONTRACT_ADDRESS) {
      return 0;
    }

    try {
      const count = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION_COUNT,
        args: [],
      });

      console.log('Validation count:', count);
      return Number(count) || 0;
    } catch (err) {
      console.error('Failed to fetch validation count:', err);
      return 0;
    }
  }, [client, initialized]);

  const getValidation = useCallback(async (validationId) => {
    if (!client || !initialized) {
      setError('Client not initialized');
      return null;
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured');
      return null;
    }

    if (!validationId) {
      setError('Validation ID is required');
      return null;
    }

    try {
      const validation = await client.readContract({
        address: CONTRACT_ADDRESS,
        functionName: CONTRACT_METHODS.GET_VALIDATION,
        args: [validationId],
      });

      return validation;
    } catch (err) {
      const errorMsg = `Failed to fetch validation: ${err.message}`;
      setError(errorMsg);
      console.error('Validation fetch error:', err);
      return null;
    }
  }, [client, initialized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    validateContent,
    getValidationHistory,
    getValidationCount,
    getValidation,
    clearError,
    loading,
    error,
    result,
    initialized,
    client,
  };
};


//this is the content submission
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { VALIDATION_CONFIG } from '@/config/genlayer';

export function ContentSubmission({ onValidate, loading, error }) {
  const [content, setContent] = useState('');
  const [minWords, setMinWords] = useState(VALIDATION_CONFIG.MIN_WORDS_DEFAULT);
  const [validationError, setValidationError] = useState('');

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!content.trim()) {
      setValidationError('Please enter some content to validate');
      return;
    }

    if (wordCount < minWords) {
      setValidationError(`Content must have at least ${minWords} words. Current: ${wordCount}`);
      return;
    }

    if (charCount > VALIDATION_CONFIG.MAX_CHARS) {
      setValidationError(`Content exceeds maximum length of ${VALIDATION_CONFIG.MAX_CHARS} characters`);
      return;
    }

    if (minWords <= 0) {
      setValidationError('Minimum words must be greater than 0');
      return;
    }

    try {
      await onValidate(content, minWords);
    } catch (err) {
      setValidationError(err.message);
    }
  };

  const handleClear = () => {
    setContent('');
    setValidationError('');
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Submit Content for Validation
        </CardTitle>
        <CardDescription>
          Enter your content below and let AI analyze its quality, grammar, and readability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Your Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your content here... This could be an article, blog post, product description, or any text you want validated."
              className="min-h-[300px] font-mono text-sm resize-none"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={wordCount < minWords ? 'text-destructive' : 'text-accent'}>
                Words: {wordCount} / {minWords} minimum
              </span>
              <span className={charCount > VALIDATION_CONFIG.MAX_CHARS ? 'text-destructive' : ''}>
                Characters: {charCount} / {VALIDATION_CONFIG.MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="minWords" className="text-sm font-medium">
              Minimum Word Count
            </label>
            <Input
              id="minWords"
              type="number"
              value={minWords}
              onChange={(e) => setMinWords(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-32"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Set the minimum required words for validation
            </p>
          </div>

          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {validationError || error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                'Validate Content'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
              disabled={loading || !content}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

this is genlayerconfig.js, you can change the config to match the instructions i'll give in the prompt 
// GenLayer Configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x64A523C5E5678cE2713B868353F76Bfbb3A1ea6F';

// Contract method names
export const CONTRACT_METHODS = {
  VALIDATE_CONTENT: 'validate_content',
  GET_VALIDATION: 'get_validation',
  GET_USER_VALIDATIONS: 'get_user_validations',
  GET_VALIDATION_COUNT: 'get_validation_count',
  GET_LATEST_VALIDATION_ID: 'get_latest_validation_id',
};

// Validation configuration
export const VALIDATION_CONFIG = {
  MIN_WORDS_DEFAULT: 50,
  MAX_CHARS: 2000,
  PASSING_SCORE: 70,
};