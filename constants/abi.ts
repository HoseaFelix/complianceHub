export const SummarizerABI = [
    {
        "type": "function",
        "name": "init_session",
        "inputs": [
            { "name": "video_id", "type": "string" },
            { "name": "total_chunks", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "summarize_chunk",
        "inputs": [
            { "name": "video_id", "type": "string" },
            { "name": "chunk_index", "type": "uint256" },
            { "name": "chunk_text", "type": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "merge_summaries",
        "inputs": [
            { "name": "video_id", "type": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
    "name": "get_summary",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "video_id", "type": "string" }],
    "outputs": [
        {
        "type": "tuple",
        "components": [
            { "name": "overview", "type": "string" },
            { "name": "key_points", "type": "string[]" },
            { "name": "conclusion", "type": "string" }
        ]
        }
    ]
    },

    {
        "type": "function",
        "name": "get_status",
        "inputs": [
            { "name": "video_id", "type": "string" }
        ],
        "outputs": [
            { "name": "", "type": "uint256" }
        ],
        "stateMutability": "view"
    },
    {
    "name": "summarize_video",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
        { "name": "video_id", "type": "string" },
        { "name": "chunks", "type": "string[]" }
    ],
    "outputs": []
    },


] as const;
