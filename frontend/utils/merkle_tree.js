import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { ethers } from 'ethers';

export function encodeLeaf(address, spots) {
    // Same as `abi.encodePacked` in Solidity
    return ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint64"],
        [address, spots]
    );
}

export function generateMerkleTree(whitelist) {
    // whitelist is an array of { address, spots }
    const leafNodes = whitelist.map(entry => {
        const encoded = encodeLeaf(entry.address, entry.spots);
        return keccak256(Buffer.from(encoded.slice(2), 'hex'));
    });

    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    return merkleTree;
}

export function getMerkleRoot(tree) {
    return tree.getHexRoot();
}

export function getProof(tree, address, spots) {
    const encoded = encodeLeaf(address, spots);
    const leaf = keccak256(Buffer.from(encoded.slice(2), 'hex'));
    return tree.getHexProof(leaf);
}
