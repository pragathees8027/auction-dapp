import { ethers } from 'ethers';

const auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

let provider;
let signer;
let auctionContract;

export const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
        throw new Error('MetaMask not found');
    }
};

export const connectWallet = async () => {
    await getProvider();
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    auctionContract = new ethers.Contract(contractAddress, auctionAbi, signer);
};

export const createAuction = async (name, startingPrice) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const tx = await auctionContract.createAuction(name, ethers.utils.parseEther(startingPrice.toString()));
    await tx.wait();
    return tx;
};

export const bid = async (itemId, bidAmount) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const tx = await auctionContract.bid(itemId, {
        value: ethers.utils.parseEther(bidAmount.toString())
    });
    await tx.wait();
    return tx;
};

export const endAuction = async (itemId) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const tx = await auctionContract.endAuction(itemId);
    await tx.wait();
    return tx;
};

export const getAuctionWinner = async (itemId) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const winnerData = await auctionContract.getAuctionWinner(itemId);
    return {
        winner: winnerData[0],
        winningBid: ethers.utils.formatEther(winnerData[1]),
    };
};

export const getItemIndex = async (itemName) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }
    
    const index = await auctionContract.getItemIndex(itemName);
    return index;
};