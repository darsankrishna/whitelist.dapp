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
Create a `.env` file in the root directory:

```env
PRIVATEKEY=your_wallet_private_key
HOODIRPCURL=https://0xrpc.io/hoodi
```

### 4. Run the Frontend
Since the contract is already deployed to the Hoodi Testnet, you can just start the website!

```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📝 How to Update the Whitelist

Want to add your friends?

1.  **Edit the List**: Open `frontend/constants/whitelistData.js` and add their addresses.
    ```javascript
    export const whitelistData = [
      { address: "0xYourAddress...", spots: 2 },
      { address: "0xFriendAddress...", spots: 2 },
    ];
    ```
2.  **Re-Deploy Contract**: Since the list changed, the **Merkle Root** changed. You must update the blockchain.
    ```bash
    # From the root folder
    npx hardhat run scripts/deploy.js --network hoodi
    ```
3.  **Update Frontend**:
    *   Copy the **new contract address** from the terminal.
    *   Paste it into `frontend/constants/index.js`.
    *   Commit and push changes (if deployed to Vercel, it will auto-update).

---

## 🔗 Contract Details (Hoodi Testnet)

*   **Contract Address**: `0x0AAD3e6A2E2acDA09E9B0374a95de0AB79713a1c`
*   **Network**: Ethereum Hoodi
*   **Chain ID**: 560048
