# Whitelist Merkle DApp

A decentralized application (DApp) that allows users to verify if they are whitelisted for an event using **Merkle Tree proofs**. This approach is gas-efficient because it doesn't store every single address on the blockchain—only a single "root" hash.

---

## 🧠 How It Works (The Flow)

1.  **The List**: You have a list of lucky addresses in `frontend/constants/whitelistData.js`.
2.  **The Tree**: We create a "Merkle Tree" from this list. Think of it as a giant family tree of hashes.
3.  **The Root**: The top of this tree is a single string called the **Merkle Root**. We deploy a Smart Contract that stores *only* this Root.
4.  **The Proof**: When a user connects their wallet on the website:
    *   The website checks if they are in the list.
    *   If yes, it generates a **Merkle Proof** (a specific path up the tree).
    *   It sends this proof to the Smart Contract.
5.  **The Verification**: The Smart Contract checks if the proof matches the stored Root. If it matches, the user is verified!

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
│   │   ├── page.js            # Main UI logic
│   │   └── globals.css        # Styling
│   ├── constants/
│   │   ├── index.js           # Contract Address & ABI
│   │   └── whitelistData.js   # LIST OF WHITELISTED ADDRESSES (Edit this!)
│   └── utils/
│       └── merkle_tree.js     # Utility to generate Tree & Proofs (Frontend)
└── hardhat.config.js          # Hardhat configuration
```

---

## 🚀 Run Locally

Follow these steps to run the project on your machine.

### 1. Prerequisites
*   Node.js (v18 or higher)
*   MetaMask Wallet installed in your browser

### 2. Installation
Install dependencies for both the backend (Hardhat) and frontend (Next.js).

```bash
# Root folder (Backend)
npm install

# Frontend folder
cd frontend
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory (Optional if using Frontend Deployer):

```env
HOODIRPCURL=https://0xrpc.io/hoodi
# PRIVATEKEY is only needed if you deploy via command line scripts
PRIVATEKEY=your_wallet_private_key
```

### 4. Run the Frontend
Since the contract is already deployed to the Hoodi Testnet, you can just start the website!

```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📝 How to Update the Whitelist

You can now deploy your own whitelist contract directly from the website!

1.  **Go to the Deploy Page**: Click "Go to Deploy Page" at the bottom of the home page, or navigate to `/deploy`.
2.  **Enter Addresses**: Paste your list of addresses in the text area. You can use JSON format or a simple CSV list (address,spots).
    *   Example JSON: `[{"address": "0x123...", "spots": 2}, {"address": "0x456...", "spots": 1}]`
    *   Example CSV:
        ```
        0x123..., 2
        0x456..., 1
        ```
3.  **Generate Root**: Click "Generate Root" to calculate the Merkle Root.
4.  **Deploy**: Click "Deploy Contract". MetaMask will ask you to confirm the transaction.
5.  **Done!**: Once deployed, the new contract address will be automatically saved to your browser's local storage and used for verification on the home page.

### Legacy Method (Using Scripts)
If you prefer using the command line:

1.  **Edit the List**: Open `frontend/constants/whitelistData.js`.
2.  **Re-Deploy**:
    ```bash
    npx hardhat run scripts/deploy.js --network hoodi
    ```
    *(Note: This requires a `.env` file with `PRIVATEKEY`)*
3.  **Update Frontend**: Copy the new address into `frontend/constants/index.js`.

---

## 🔗 Contract Details (Hoodi Testnet)

*   **Contract Address**: `0x0AAD3e6A2E2acDA09E9B0374a95de0AB79713a1c`
*   **Network**: Ethereum Hoodi
*   **Chain ID**: 560048
