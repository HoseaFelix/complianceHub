
import { createWalletClient, http, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as fs from 'fs';
import * as path from 'path';

// GenLayer Studio Config
const GENLAYER_CHAIN = defineChain({
    id: 62255,
    name: 'GenLayer Studio',
    network: 'genlayer-studio',
    nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
    rpcUrls: { default: { http: ['https://studio.genlayer.com/api'] } }
});

async function main() {
    // 1. Get Wallet
    // NOTE: This private key must have GEN tokens!
    // I will look for a private key in env or ask user. 
    // For now I'll use a placeholder or read from env
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error("Please set PRIVATE_KEY in .env");
        process.exit(1);
    }

    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
        account,
        chain: GENLAYER_CHAIN,
        transport: http()
    });

    // 2. Read Contract Source
    const contractPath = path.resolve(__dirname, '../genlayer_contracts/complianceHub.py');
    const contractSource = fs.readFileSync(contractPath, 'utf8');

    console.log(`Deploying contract from ${contractPath}...`);

    // 3. Deploy
    // For GenLayer, we send a transaction with data = hex encoded source
    const hash = await client.deployContract({
        abi: [], // ABI not needed for deployment of raw source
        // For GenLayer, bytecode IS the hex-encoded source string.
        bytecode: `0x${Buffer.from(contractSource, 'utf8').toString('hex')}`,
        args: [],
        account, // Account must be explicitly passed
        chain: GENLAYER_CHAIN // Chain must also be explicitly passed
    });

    console.log("Deployment Tx Hash:", hash);
    // We need a public client to wait for receipt
    // ...
}

main().catch(console.error);
