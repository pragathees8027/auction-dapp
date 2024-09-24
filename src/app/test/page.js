'use client';

import { ethers } from "ethers";
import { useEffect, useState } from "react";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractABI = [
    {
      "inputs": [],
      "name": "auctions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "itemName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "startPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "highestBidder",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "highestBid",
              "type": "uint256"
            }
          ],
          "internalType": "struct AuctionContract.Auction",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "getAuctionDetails",
      "inputs": [
        {
          "internalType": "uint256",
          "name": "auctionIndex",
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "internalType": "string",
          "name": "itemName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "highestBidder",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "highestBid",
          "type": "uint256"
        }
      ]
    }
    // Add additional ABI entries as needed
  ];

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const auctionCount = await contract.auctionCount(); // If you have a method that returns total auctions
      let fetchedAuctions = [];

      for (let i = 0; i < auctionCount; i++) {
        const auctionDetails = await contract.getAuctionDetails(i);
        fetchedAuctions.push(auctionDetails);
      }

      setAuctions(fetchedAuctions);
    };

    fetchAuctions();
  }, []);

  return (
    <div>
      {auctions.map((auction, index) => (
        <div key={index}>
          <h2>{auction.itemName}</h2>
          <p>Start Price: {ethers.utils.formatEther(auction.startPrice)} ETH</p>
          <p>Duration: {auction.duration} seconds</p>
        </div>
      ))}
    </div>
  );
}
