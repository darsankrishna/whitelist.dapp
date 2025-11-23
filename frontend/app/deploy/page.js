"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { generateMerkleTree, getMerkleRoot } from "../../utils/merkle_tree";
import { abi, bytecode } from "../../constants"; // We need bytecode for deployment

export default function Deploy() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [whitelistInput, setWhitelistInput] = useState("");
    const [merkleRoot, setMerkleRoot] = useState("");
    const [deployedAddress, setDeployedAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

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

    const handleGenerateRoot = () => {
        try {
            setStatus(null);
            if (!whitelistInput) {
                setStatus({ type: "error", message: "Please enter whitelist addresses." });
                return;
            }

            // Parse input: assume JSON array of objects {address, spots} or simple CSV
            let whitelist;
            try {
                whitelist = JSON.parse(whitelistInput);
            } catch (e) {
                // Fallback to simple CSV parsing if JSON fails
                // Format: address,spots (one per line)
                whitelist = whitelistInput.split("\n").map(line => {
                    const [addr, spots] = line.split(",");
                    if (!addr || !spots) return null;
                    return { address: addr.trim(), spots: parseInt(spots.trim()) };
                }).filter(item => item !== null);
            }

            if (!Array.isArray(whitelist) || whitelist.length === 0) {
                setStatus({ type: "error", message: "Invalid whitelist format." });
                return;
            }

            const tree = generateMerkleTree(whitelist);
            const root = getMerkleRoot(tree);
            setMerkleRoot(root);
            setStatus({ type: "success", message: `Merkle Root Generated: ${root}` });
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", message: `Error generating Merkle Root: ${err.message}` });
        }
    };

    const handleDeploy = async () => {
        try {
            setLoading(true);
            setStatus(null);

            if (!walletConnected) {
                await connectWallet();
            }

            if (!merkleRoot) {
                setStatus({ type: "error", message: "Please generate Merkle Root first." });
                setLoading(false);
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Deploy contract
            const factory = new ethers.ContractFactory(abi, bytecode, signer);
            const contract = await factory.deploy(merkleRoot);

            setStatus({ type: "info", message: "Deploying... Please wait for confirmation." });

            await contract.waitForDeployment();
            const contractAddress = await contract.getAddress();

            setDeployedAddress(contractAddress);
            setStatus({ type: "success", message: `Contract Deployed at: ${contractAddress}` });

            // Optionally save to local storage or context so the main page can pick it up
            localStorage.setItem("whitelistContractAddress", contractAddress);
            // Save the whitelist data used for this contract so verification works
            localStorage.setItem("whitelistData", JSON.stringify(whitelist));

        } catch (err) {
            console.error(err);
            setStatus({ type: "error", message: "Deployment failed." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            // Check if already connected
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
                    <h1>Deploy Whitelist Contract</h1>
                    <p>Create your own whitelist contract.</p>

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
                        <label>Whitelist Data (JSON format):</label>
                        <textarea
                            rows="10"
                            placeholder='[{"address": "0x...", "spots": 2}, ...]'
                            value={whitelistInput}
                            onChange={(e) => setWhitelistInput(e.target.value)}
                        />
                    </div>

                    <div className="actions">
                        <button className="button secondary" onClick={handleGenerateRoot}>
                            Generate Root
                        </button>
                        {merkleRoot && (
                            <button className="button" onClick={handleDeploy} disabled={loading}>
                                {loading ? "Deploying..." : "Deploy Contract"}
                            </button>
                        )}
                    </div>

                    {merkleRoot && (
                        <div className="result-box">
                            <strong>Merkle Root:</strong>
                            <p className="code-snippet">{merkleRoot}</p>
                        </div>
                    )}

                    {deployedAddress && (
                        <div className="result-box success">
                            <strong>Contract Deployed!</strong>
                            <p>Address: <span className="code-snippet">{deployedAddress}</span></p>
                            <p><small>Saved to local storage.</small></p>
                        </div>
                    )}

                    {status && (
                        <div className={`status ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        <a href="/">Go to Verification Page &rarr;</a>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .input-group { margin: 20px 0; text-align: left; }
                .input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
                textarea { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; font-family: monospace; }
                .actions { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
                .result-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; word-break: break-all; }
                .result-box.success { background: #e6fffa; border: 1px solid #38b2ac; }
                .code-snippet { font-family: monospace; background: #eee; padding: 2px 5px; border-radius: 3px; }
                .button.secondary { background-color: #6c757d; }
                .button.secondary:hover { background-color: #5a6268; }
            `}</style>
        </main>
    );
}
