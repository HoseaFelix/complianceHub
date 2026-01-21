export const GENLAYER_CONFIG = {
    // 1. Deploy your contract in GenLayer Studio
    // 2. Copy the Deployed Contract Address and paste it below
    CONTRACT_ADDRESS: "0x560160aa5d0855f5d1cC7045ed62Ca394Eb7C862",

    // 3. (Optional) If you have a specific ABI, you can add it here
    CHAIN_ID: 62255, // GenLayer Studio Chain ID (0xf22f)
    RPC_URL: "https://studio.genlayer.com/api"
};

// Contract method names for AI Dictionary
export const DICTIONARY_METHODS = {
    ANALYZE_WORD: 'analyze_word',
    GET_ANALYSIS: 'get_analysis',
    GET_USER_ANALYSES: 'get_user_analyses',
    GET_ANALYSIS_COUNT: 'get_analysis_count',
    GET_LATEST_ANALYSIS_ID: 'get_latest_analysis_id',
};

// Dictionary configuration
export const DICTIONARY_CONFIG = {
    MAX_CHARS: 500, // Max characters for a word/phrase
};

