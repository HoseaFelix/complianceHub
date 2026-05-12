# ComplianceHub Deployment Guide

## Overview

ComplianceHub is a GenLayer-powered policy compliance platform with four core workflows:

- Analyze policies for risk
- Compare analyzed policies
- Benchmark policies against standards
- Generate portfolio-level compliance reports

## Project Files

- Smart contract: `genlayer_contracts/complianceHub.py`
- Frontend: `app/`
- Contract hooks and config: `hooks/`, `constants/`
- Deployment helpers: `scripts/`

## Prerequisites

- Node.js 20+
- npm
- A GenLayer wallet or funded private key for contract deployment

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create `.env.local` and set:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_CHAIN_ID=62255
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
```

For script-based deployment, also set:

```env
PRIVATE_KEY=0x...
```

## Deploy The Contract

The contract class is `ComplianceHub` in:

```text
genlayer_contracts/complianceHub.py
```

You can deploy it through GenLayer Studio or with a local script after verifying your wallet setup.

### GenLayer Studio

1. Open `https://studio.genlayer.com`
2. Create a project
3. Upload `genlayer_contracts/complianceHub.py`
4. Deploy the contract
5. Copy the deployed contract address
6. Add that address to `.env.local`

### Local Script

The repo includes helper scripts in `scripts/`, but confirm the private key and runtime environment before using them.

## Run The App

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Supported Standards

- GDPR
- CCPA
- ISO 27001
- HIPAA

## Troubleshooting

### Wallet not connected

- Connect MetaMask or use the generated local wallet flow
- Confirm the wallet is on GenLayer Studio

### Contract address not configured

- Make sure `NEXT_PUBLIC_CONTRACT_ADDRESS` is present in `.env.local`
- Restart the dev server after updating env vars

### Deployment script fails

- Verify `PRIVATE_KEY` is set
- Confirm the contract path points to `genlayer_contracts/complianceHub.py`
- Check that the wallet has enough GEN for deployment

### Transaction takes a long time

- GenLayer consensus can take tens of seconds
- Wait for finalization and review the transaction hash in logs
