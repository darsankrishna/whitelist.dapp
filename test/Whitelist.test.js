const { expect } = require("chai");
const { ethers } = require("hardhat");
const { generateMerkleTree, getMerkleRoot, getProof } = require("../scripts/merkle_tree");

describe("Whitelist", function () {
    let whitelistContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let merkleTree;
    let root;

    const spots = 2; // Example maxAllowanceToMint

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Create whitelist data
        const whitelist = [
            { address: owner.address, spots: spots },
            { address: addr1.address, spots: spots },
        ];

        // Generate Merkle Tree
        merkleTree = generateMerkleTree(whitelist);
        root = getMerkleRoot(merkleTree);

        // Deploy Contract
        const Whitelist = await ethers.getContractFactory("Whitelist");
        whitelistContract = await Whitelist.deploy(root);
        // await whitelistContract.deployed(); // Not needed in ethers v6? Wait, let's check. 
        // In ethers v6, waitForDeployment() is used.
        await whitelistContract.waitForDeployment();
    });

    it("Should verify a valid proof for a whitelisted user", async function () {
        const proof = getProof(merkleTree, addr1.address, spots);
        const verified = await whitelistContract.connect(addr1).checkInWhitelist(proof, spots);
        expect(verified).to.be.true;
    });

    it("Should reject an invalid proof for a non-whitelisted user", async function () {
        const proof = getProof(merkleTree, addr2.address, spots); // addr2 is not in the tree, so this proof will be empty or invalid for the root
        // Actually getProof might return empty array if not found, or we can try to fake a proof.
        // But simpler: just check if checkInWhitelist returns false.

        // If we generate a proof for addr2, it won't be valid because addr2 wasn't in the tree generation.
        // Let's try to use addr1's proof for addr2.
        const proofForAddr1 = getProof(merkleTree, addr1.address, spots);
        const verified = await whitelistContract.connect(addr2).checkInWhitelist(proofForAddr1, spots);
        expect(verified).to.be.false;
    });

    it("Should reject if maxAllowanceToMint doesn't match", async function () {
        const proof = getProof(merkleTree, addr1.address, spots);
        const wrongSpots = spots + 1;
        const verified = await whitelistContract.connect(addr1).checkInWhitelist(proof, wrongSpots);
        expect(verified).to.be.false;
    });
});
