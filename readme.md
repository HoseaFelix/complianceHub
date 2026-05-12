# ComplianceHub

ComplianceHub is an enterprise compliance platform on GenLayer for policy risk analysis, comparison, benchmarking, auditability, and reporting.

## Features

- Policy risk analysis with clause-level findings
- Policy-to-policy comparison
- Benchmarking against GDPR, CCPA, ISO 27001, and HIPAA
- Immutable audit trail
- Portfolio-level compliance reporting

## Core Contract

- File: `genlayer_contracts/complianceHub.py`
- Class: `ComplianceHub`

## Main Workflows

1. Analyze a policy and store the result on-chain
2. Compare two prior analyses
3. Benchmark a policy against a compliance standard
4. Generate a workspace compliance report

## Frontend

The Next.js frontend provides tabs for:

- Dashboard
- Analyze
- Compare
- Benchmark
- Audit Trail
- Reports

## Installation

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_GENLAYER_CHAIN_ID=62255
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy The Contract

Upload `genlayer_contracts/complianceHub.py` to GenLayer Studio, deploy it, and set the resulting address in `.env.local`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Wagmi 3
- viem 2
- GenLayer

## License

MIT
