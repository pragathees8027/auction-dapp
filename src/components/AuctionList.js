'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Item from './Item';

const AuctionApp = () => {
    const auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [auctionContract, setAuctionContract] = useState(null);
    
    const [name, setName] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [itemId, setItemId] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [itemName, setItemName] = useState('');
    const [ongoingAuction, setOngoingAuction] = useState([]);

    useEffect(() => {
        const initProvider = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(newProvider);
            } else {
                alert('MetaMask not found');
            }
        };
        initProvider();
    }, []);

    const connectWallet = async () => {
        try {
            await provider.send("eth_requestAccounts", []);
            const newSigner = provider.getSigner();
            setSigner(newSigner);
            const newContract = new ethers.Contract(contractAddress, auctionAbi, newSigner);
            setAuctionContract(newContract);
        } catch (error) {
            alert('Error connecting wallet: ' + error.message);
        }
    };

    const createAuction = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const price = ethers.utils.parseUnits(startingPrice, 18);
            const tx = await auctionContract.createAuction(name, price);
            await tx.wait();
            alert('Auction created successfully!');
        } catch (error) {
            alert('Error creating auction: ' + error.message);
        }
    };

    const bid = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const highestBid = await auctionContract.getHighestBid(itemId);
            const bidAmountValue = highestBid.add(ethers.utils.parseUnits(bidAmount, 18));
            const tx = await auctionContract.bid(itemId, { value: bidAmountValue });
            await tx.wait();
            alert('Bid placed successfully!');
        } catch (error) {
            alert('Error placing bid: ' + error.message);
        }
    };

    const endAuction = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const tx = await auctionContract.endAuction(itemId, { gasLimit: 10000000 });
            await tx.wait();
            alert('Auction ended successfully!');
        } catch (error) {
            alert('Error ending auction: ' + error.message);
        }
    };

    const getAuctionWinner = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const winnerData = await auctionContract.getAuctionWinner(itemId);
            alert(`Winner: ${winnerData[0]}, Winning Bid: ${ethers.utils.formatUnits(winnerData[1], 18).toString()}`);
        } catch (error) {
            alert('Error fetching auction winner: ' + error.message);
        }
    };

    const getOnGoingAuctionsData = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const ongoingAuctionData = await auctionContract.getOngoingAuctions();
            setOngoingAuction(ongoingAuctionData);
            alert(`Ongoing Auctions: ${JSON.stringify(ongoingAuctionData)}`);
            console.log(`Ongoing Auctions: ${JSON.stringify(ongoingAuctionData)}`);
        } catch (error) {
            alert('Error fetching ongoing auctions: ' + error.message);
        }
    };

    const getItemIndex = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const index = await auctionContract.getItemIndex(itemName);
            alert(`Item Index: ${index}`);
        } catch (error) {
            alert('Error fetching item index: ' + error.message);
        }
    };

    const getAuctionBids = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const auctionBids = await auctionContract.getBids(itemId);
            alert(`Auction Bids: ${JSON.stringify(auctionBids)}`);
        } catch (error) {
            alert('Error fetching auction bids: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <h2 style={{ marginBottom: '20px' }}>Auction DApp</h2>
            <button onClick={connectWallet} style={{ marginBottom: '10px', background: 'blue' }}>Connect Wallet</button>
            <div>
                <h3>Create Auction</h3>
                <input
                    type="text"
                    placeholder="Auction Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="Starting Price"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={createAuction} style={{ marginBottom: '20px', background: 'blue' }}>Create Auction</button>
            </div>

            <div>
                <h3>Place Bid</h3>
                <input
                    type="text"
                    placeholder="Item ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <input
                    type="text"
                    placeholder="Bid Amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={bid} style={{ marginBottom: '20px', background: 'blue' }}>Place Bid</button>
            </div>

            <div>
                <h3>End Auction</h3>
                <input
                    type="text"
                    placeholder="Item ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={endAuction} style={{ marginBottom: '20px', background: 'blue' }}>End Auction</button>
            </div>

            <div>
                <h3>Get Auction Winner</h3>
                <input
                    type="text"
                    placeholder="Item ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={getAuctionWinner} style={{ marginBottom: '20px', background: 'blue' }}>Get Winner</button>
            </div>

            <div>
                <button onClick={getOnGoingAuctionsData} style={{ marginBottom: '20px', background: 'blue' }}>Get Ongoing Auctions</button>
            </div>
            <h2>Ongoing Auctions</h2>
                     <div>
                         {ongoingAuction.map((auction, index) => (
                             <div key={index}>
                                 <p>Name: {auction.name}</p>
                                 <p>
                                     Current Highest Bid: { 
                                         auction.highestBid 
                                             ? ethers.utils.formatUnits(auction.highestBid, 18).toString() 
                                             : 'No bids yet'
                                     } ETH
                                 </p>
                                 <input
                                     type="text"
                                     placeholder="Bid Amount (ETH)"
                                     value={bidAmount}
                                     onChange={(e) => setBidAmount(e.target.value)}
                                 />
                             </div>
                         ))}
                     </div>

            <div>
                <h3>Get Item Index</h3>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={getItemIndex} style={{ marginBottom: '20px', background: 'blue' }}>Get Item Index</button>
            </div>

            <div>
                <h3>Get Auction Bids</h3>
                <input
                    type="text"
                    placeholder="Item ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <button onClick={getAuctionBids} style={{ marginBottom: '20px', background: 'blue' }}>Get Bids</button>
            </div>
        </div>
    );
};

export default AuctionApp;
