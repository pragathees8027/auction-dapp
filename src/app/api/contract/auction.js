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

    let price = ethers.utils.parseUnits(startingPrice, 18);

    const tx = await auctionContract.createAuction(name, ethers.utils.parseEther(price.toString()));
    await tx.wait();
    return tx;
};

export const bid = async (itemId, amount) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    let highestBid = await auctionContract.getHighestBid(itemId);
    let bidAmount = highestBid.add(ethers.utils.parseUnits(amount, 18));

    const tx = await auctionContract.bid(itemId, { value: bidAmount });
    await tx.wait();
    return tx;
};

export const endAuction = async (itemId) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const tx = await auctionContract.endAuction(itemId, { gasLimit: 10000000 });
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
        winningBid: ethers.utils.formatUnits(winnerData[1], 18),
    };
};

export const getOnGoingAuctionsNames = async () => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const ongoingAuctionData = await auctionContract.getOngoingAuctions();
    let ongoingAuctions = [];
    for (let i = 1; i < ongoingAuctionData.length; i++) {
        try {
            ongoingAuctions.push(await auctionContract.getItemIndex(ongoingAuctions[i].name));
        } catch (error) {
        }
    }

    return ongoingAuctions;
};

export const getOnGoingAuctionsData = async () => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const ongoingAuctionData = await auctionContract.getOngoingAuctions();
    return ongoingAuctionData;
};

export const getItemIndex = async (itemName) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }
    
    const index = await auctionContract.getItemIndex(itemName);
    return index;
};

export const getAuctionBids = async (itemId) => {
    if (!auctionContract) {
        throw new Error('Auction contract is not initialized. Please connect your wallet.');
    }

    const auctionBids = await auctionContract.getBids(itemId);
    return auctionBids;
}