# Whitelist Merkle DApp

A decentralized application (DApp) that allows users to verify if they are whitelisted for an NFT drop using Merkle Tree proofs.

## Features

- **Smart Contract**: Solidity contract with Merkle Proof verification.
- **Frontend**: Next.js application with a premium dark theme.
- **Merkle Tree**: Utility to generate Merkle Trees and Proofs off-chain.
- **Wallet Connection**: Integration with MetaMask.

## Prerequisites

- Node.js (v18+)
- MetaMask Wallet

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    cd frontend && npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory with the following:
    ```env
    PRIVATEKEY=your_private_key
    HOODIRPCURL=https://0xrpc.io/hoodi
    ETHERSCANAPIKEY=your_etherscan_api_key (optional)
    ```

## Deployment

### Smart Contract

To deploy the contract to the Hoodi Testnet:

```bash
npx hardhat run scripts/deploy.js --network hoodi
```

Copy the deployed contract address and update `frontend/constants/index.js`.

### Frontend (Vercel/Netlify)

1.  **Push to GitHub**: Push this repository to your GitHub account.
2.  **Import to Vercel**:
    - Go to [Vercel](https://vercel.com/).
    - Click "Add New" > "Project".
    - Import your repository.
    - Set the **Root Directory** to `frontend`.
    - Click "Deploy".
3.  **Done!** Your DApp is now live.

## Testing

Run Smart Contract tests:

```bash
npx hardhat test
```

## Local Development

1.  Start local node:
    ```bash
    npx hardhat node
    ```
2.  Deploy to localhost:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
3.  Run frontend:
    ```bash
    cd frontend
    npm run dev
    ```
