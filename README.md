# Whitelist Merkle DApp

A decentralized application (DApp) that allows users to verify if they are whitelisted for an event using **Merkle Tree proofs**. This approach is gas-efficient because it doesn't store every single address on the blockchain—only a single "root" hash.

## 🌟 Features

-   **Gas Efficient**: Uses Merkle Trees to minimize storage costs on the blockchain.
-   **Privacy Preserving**: The full list of addresses is not stored on-chain.
-   **Frontend Deployment**: Deploy your own whitelist contract directly from the web interface.
-   **Instant Verification**: Users can check their eligibility instantly by connecting their wallet.
-   **Simple Input**: Supports simple list of addresses (JSON or CSV).

---

## 📸 UI Screenshots

![Whitelist Verification UI](/frontend/public/1.png)
![Whitelist Verification UI](/frontend/public/2.png)
![Whitelist Verification UI](/frontend/public/3.png)
![Whitelist Verification UI](/frontend/public/4.png)

---

## 🚀 Steps to Deploy the Smart Contract

You can deploy the contract using the **Frontend** (Recommended) or via **Scripts**.

### Method 1: Frontend Deployment (No Private Key needed)
1.  Run the frontend application (see "Steps to Run the Frontend" below).
2.  Navigate to the **Deploy Page** (`/deploy`).
3.  Connect your MetaMask wallet.
4.  Enter your list of addresses in the text area.
    *   **JSON Format**: `["0xAddress1...", "0xAddress2..."]`
    *   **CSV Format**:
        ```
        0xAddress1...
        0xAddress2...
        ```
5.  Click **Generate Root**.
6.  Click **Deploy Contract**. MetaMask will prompt you to confirm the transaction.
7.  Once deployed, the new contract address is automatically saved and used for verification.

### Method 2: Script Deployment
1.  Create a `.env` file in the root directory with `PRIVATEKEY` and `HOODIRPCURL`.
2.  Run the deploy script:
    ```bash
    npx hardhat run scripts/deploy.js --network hoodi
    ```

---

## 💻 Steps to Run the Frontend

1.  **Prerequisites**: Ensure Node.js (v18+) and MetaMask are installed.
2.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**: Visit [http://localhost:3000](http://localhost:3000).

---

## 🔗 Contract Details

-   **Network**: Ethereum Hoodi Testnet
-   **Chain ID**: 560048
-   **Default Contract Address**: `0x0AAD3e6A2E2acDA09E9B0374a95de0AB79713a1c`

---

## 📂 Directory Architecture

```
whitelist_merkle/
├── contracts/
│   └── Whitelist.sol          # The Smart Contract
├── scripts/
│   ├── deploy.js              # Script to deploy contract & calculate Root
│   └── merkle_tree.js         # Utility to generate Tree & Proofs (Backend)
├── test/
│   └── Whitelist.test.js      # Automated tests
├── frontend/                  # Next.js Web Application
│   ├── app/
│   │   ├── page.js            # Main UI logic (Verification)
│   │   └── deploy/
│   │       └── page.js        # Deployment UI logic
│   ├── constants/
│   │   ├── index.js           # Contract Address & ABI
│   │   └── whitelistData.js   # Default list of whitelisted addresses
│   └── utils/
│       └── merkle_tree.js     # Utility to generate Tree & Proofs (Frontend)
└── hardhat.config.js          # Hardhat configuration
```
