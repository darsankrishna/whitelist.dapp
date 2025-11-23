"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { generateMerkleTree, getProof } from "../utils/merkle_tree";
import { whitelistData } from "../constants/whitelistData";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [contractAddress, setContractAddress] = useState(WHITELIST_CONTRACT_ADDRESS);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
            setAddress(userAddress);
            setWalletConnected(true);
        } catch (err) {
            console.error(err);
        }
    };

    const checkWhitelist = async () => {
        try {
            setLoading(true);
            setStatus(null);

            if (!walletConnected) {
                await connectWallet();
            }

            // Re-check connection
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();

            // Generate Tree and Proof
            const tree = generateMerkleTree(whitelistData);
            // Find spots for the user. In a real app, this might come from an API or user input.
            // Here we search the whitelistData for the user's address.
            const userEntry = whitelistData.find(
                (entry) => entry.address.toLowerCase() === userAddress.toLowerCase()
            );

            if (!userEntry) {
                setStatus({ type: "error", message: "You are NOT in the whitelist." });
                setLoading(false);
                return;
            }

            const proof = getProof(tree, userEntry.address, userEntry.spots);

            // Interact with Contract
            if (!contractAddress || contractAddress === "YOUR_CONTRACT_ADDRESS_HERE") {
                // Fallback for demo if contract not deployed
                setStatus({ type: "success", message: "You are in the whitelist! (Local verification only, contract not connected)" });
                setLoading(false);
                return;
            }

            const contract = new ethers.Contract(contractAddress, abi, signer);
            const isWhitelisted = await contract.checkInWhitelist(proof, userEntry.spots);

            if (isWhitelisted) {
                setStatus({ type: "success", message: "Success! You are whitelisted." });
            } else {
                setStatus({ type: "error", message: "Transaction failed or verification returned false." });
            }

        } catch (err) {
            console.error(err);
            setStatus({ type: "error", message: "Error verifying whitelist status." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check local storage for deployed contract
        const storedAddress = localStorage.getItem("whitelistContractAddress");
        if (storedAddress) {
            setContractAddress(storedAddress);
        }

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    setWalletConnected(true);
                } else {
                    setWalletConnected(false);
                    setAddress("");
                }
            });
            window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    setWalletConnected(true);
                }
            });
        }
    }, []);

    return (
        <main>
            <div className="container">
                <div className="card">
                    <h1>Whitelist Proof</h1>
                    <p>Verify your eligibility for an event using Merkle Tree proofs.</p>

                    {walletConnected ? (
                        <div className="wallet-info">
                            Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
                        </div>
                    ) : (
                        <button className="button" onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    )}

                    <div className="input-group">
                        <label>Contract Address:</label>
                        <input
                            type="text"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>

                    {walletConnected && (
                        <button className="button" onClick={checkWhitelist} disabled={loading}>
                            {loading ? "Verifying..." : "Check Eligibility"}
                        </button>
                    )}

                    {status && (
                        <div className={`status ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <p>Need to deploy a new contract?</p>
                        <a href="/deploy" className="button secondary">Go to Deploy Page</a>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .input-group { margin: 20px 0; text-align: left; }
                .input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
                input[type="text"] { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; font-family: monospace; }
                .button.secondary { background-color: #6c757d; display: inline-block; text-decoration: none; color: white; font-size: 0.9rem; }
                .button.secondary:hover { background-color: #5a6268; }
            `}</style>
        </main>
    );
}
