'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tooltip from './Tooltip';

const Bids = ({auctionContract, name, index, userAddr, handleClose}) =>{
    let [bids, setBids] = useState([]);
    const ws = new WebSocket('ws://localhost:8080');

    useEffect(() => {
      getBids();
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_BID' && message.itemName == name) {
            getBids();
        }
      };

      return () => {
        ws.close();
      };
    }, [ws, name]);

      const getBids = async () => {
        if (!auctionContract) {
            return alert('Auction contract is not initialized. Please connect your wallet.');
        }

        try {
            const auctionBids = await auctionContract.getBids(index);
            setBids(auctionBids);
        } catch (error) {
            alert('Error fetching auction bids: ' + error.message);
        }
    };

    return (
        <div className="grid items-center justify-items-center sm:p-10 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 hover:bg-opacity-50 bg-gray-600 px-8 py-8 rounded-lg shadow min-w-80 overflow-ellipsis">
        <h2 className="text-center text-2xl font-bold">
              {name}
        </h2>

        <div className='flex flex-col-reverse gap-2 max-h-96 overflow-visible scroll'>
        {bids.length > 0 ? bids.map((bid, index) => (
        <Tooltip position={'hash'}
        tooltip={<div>
          <p><span className='font-bold'>Previous hash: </span>{bid.previousHash}</p>
          {index != bids.length - 1 && <p><span className='font-bold'>Current hash: </span>{bid.currentHash}</p>}
          <p><span className='font-bold'>Block Number: </span>{ethers.BigNumber.from(bid.blockNumber).toString()}</p>
        </div>}
        >
        <div className={`rounded-xl flex flex-row gap-4 items-center px-8 py-3 ${bid.bidder.toString().toLowerCase() == userAddr ? `bg-green-500` : `bg-red-500`}`}>
        <div className={`flex flex-col items-center text-current`} key={index}>
        <p>Bid: </p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{`${ethers.utils.formatUnits(bid.amount, 18).toString()} ETH`}</span>
        </div>
        <div className='flex flex-col items-center text-current'>
          <p>Bidder: </p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{`${bid.bidder.toString()}`}</span>
        </div>
        </div></Tooltip>)) : <div className='flex items-center text-current'>
          <p>No bids</p>
        </div>}
        </div>
          
          <Tooltip tooltip={'Close bids'}>
          <button
              className="bg-red-500 text-white w-fit font-semibold py-4 px-5 rounded hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleClose}
            >
              Close
          </button>
          </Tooltip>

        </main>
        </div>
    );
} 

export default Bids;