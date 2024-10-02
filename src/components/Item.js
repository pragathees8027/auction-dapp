'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCirclePlay, faCircleStop, faEye } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import Tooltip from './Tooltip';
import Bids from './Bids';
import { ethers } from 'ethers';

const Item = ({auctionContract, name, id, price, owner, getItems, available, userAddr, user, isAuction, winner, winBid}) =>{
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    let ws = new WebSocket('ws://localhost:8080');

    useEffect(() => {
        getItemIndex(name);
        if (ws) {
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'NEW_BID' && message.itemName == name) {
              getItems();
          }

          if (message.type === 'END' && message.itemName == name) {
            getItems();
          }

          if (message.type === 'START' && message.itemName == id.toString()) {
            getItems();
          }

          if (message.type === 'ITEM_ADDED') {
            getItems();
          }
      };

      return () => {
          ws.close();
        };
      }
      },[]);

      const handleClick = () => {
        setIsVisible(true);
      }

      const handleClose = (event) => {
        event.stopPropagation();
        setIsVisible(false);
      }

      const getItemIndex = async (itemName) => {
        if (!auctionContract) {
            return;
        }

        try {
            const newIndex = await auctionContract.getItemIndex(itemName);
            setIndex(newIndex);
            setIsOwner(owner.toLowerCase() === userAddr.toLowerCase());
        } catch (error) {
            console.log('Error fetching item index: ' + error.message);
        }
    };

    const createAuction = async () => {
      if (!auctionContract) {
          throw new Error('Auction contract is not initialized. Please connect your wallet.');
      }

      try {
      let startprice = ethers.utils.parseEther(price.toString(), 18);
      const tx = await auctionContract.createAuction(id.toString(), startprice);
      await tx.wait();
      alert('Auction started successfully!');
      ws.send(JSON.stringify({ type: 'START', itemName: id.toString()}));
      } catch (error) {
        alert('Error starting auction: ' + error.message);
    }
  };

    const endAuction = async () => {
      if (!auctionContract) {
          return alert('Auction contract is not initialized. Please connect your wallet.');
      }

      try {
          let itemId = await auctionContract.getItemIndex(name); 
          const tx = await auctionContract.endAuction(itemId, { gasLimit: 10000000 });
          await tx.wait();
          const winningBid = await auctionContract.getHighestBid(itemId);
          const winner = await auctionContract.getHighestBidder(itemId);
          const _winner = winner.toString();
          const _winningBid = ethers.utils.formatUnits(winningBid, 18).toString()  + ' ETC';
          const response = await fetch(`/api/auction/end?id=${encodeURIComponent(name)}&bid=${encodeURIComponent(_winningBid)}&winner=${encodeURIComponent(_winner)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            alert('Item updated');
          } else {
            alert('error');
            const errorText = await response.text();
            alert(errorText);
          }
          alert('Auction ended successfully!');
          ws.send(JSON.stringify({ type: 'END', itemName: name }));
          // getItems();
      } catch (error) {
          alert('Error ending auction: ' + error.message);
      }
    };

    const bid = async (bidAmount) => {
      if (!auctionContract) {
          return alert('Auction contract is not initialized. Please connect your wallet.');
      }

      try {
          const highestBid = await auctionContract.getHighestBid(index);
          const bidAmountValue = highestBid.add(ethers.utils.parseUnits(bidAmount, 18));
          const tx = await auctionContract.bid(index, { value: bidAmountValue });
          await tx.wait();
          ws.send(JSON.stringify({ type: 'NEW_BID', itemName: name }));
          // getItems();
      } catch (error) {
          alert('Error placing bid: ' + error.message);
      }
    };

      const handleDelete = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`/api/auction/delete?id=${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const result = await response.json();
            alert(`Item deleted succcessfully`);
            getItems();
            console.log(result);
          } else {
            const errorText = await response.text();
            alert(errorText);
          }
        } catch (error) {
          alert('An error occurred while deleted item.');
          console.error('Error:', error);
        }
        }

    return (
        <div className="grid items-center justify-items-center sm:p-10 font-[family-name:var(--font-geist-sans)]">
        {isVisible && <div className='fixed w-screen h-screen top-0 left-0 flex flex-col justify-center items-center z-50'>
          <Bids auctionContract={auctionContract} name={name} index={index} userAddr={userAddr} handleClose={handleClose}/>
        </div>}
        <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 hover:bg-opacity-50 bg-gray-600 px-8 py-8 rounded-lg shadow min-w-80 overflow-ellipsis">
        <h2 className="text-center text-2xl text-blue-500 font-bold max-w-48 overflow-scroll scroll">
              {name}
        </h2>
       
        <div className='flex flex-col items-center text-current'>
        <p>Price</p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{available ? price : winBid}</span>
        </div>
        <div className='flex flex-col items-center text-current'>
          <p>{available ? 'Seller' : 'Buyer'}</p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{available ? owner : winner}</span>
        </div>

          {available && <div className="flex gap-6 justify-evenly w-72">
            {isOwner || user ? ( isAuction != 'true' && <Tooltip tooltip={`Start auction`} >
            <button
              className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-5 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={() => {createAuction()}}
            >
              <FontAwesomeIcon icon={faCirclePlay} size='xl' />
            </button>
            </Tooltip>) :
            <Tooltip tooltip={`Bid +0.1 ETH`} position={'left'}>
            <button
              className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-6 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={() => { bid("0.1") }}
            >
              <FontAwesomeIcon icon={faEthereum} size='xl' />
              {` +0.1`}
            </button>
            </Tooltip>}
            {isOwner || user ? ( isAuction == 'true' &&
            <Tooltip tooltip={`End auction`} >
              <button
              className={`bg-red-500 text-white flex gap-4 font-semibold py-4 px-5 rounded hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out`}
              onClick={endAuction}
            >
              <FontAwesomeIcon icon={faCircleStop} size='xl'/>
              End
            </button>
            </Tooltip>) :
             <Tooltip tooltip={`Bid +0.5 ETH`} position={'right'}>
             <button
               className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-6 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
               onClick={() => { bid("0.5") }}
             >
               <FontAwesomeIcon icon={faEthereum} size='xl' />
               {` +0.5`}
             </button>
             </Tooltip>}
            {user &&
            <Tooltip tooltip={`Remove item`} >
              <button
              className="bg-red-500 text-white font-semibold py-4 px-6 rounded hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleDelete}
            > 
              <FontAwesomeIcon icon={faTrashCan} size='lg'/>
            </button>
            </Tooltip> }
            {(isAuction && isOwner) && 
            <Tooltip tooltip={`Show Bids`}>
            <button
            className="flex gap-2 bg-blue-500 text-white font-semibold py-4 px-6 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            onClick={handleClick}
          >  <FontAwesomeIcon icon={faEye} size='lg'/> {` View Bids`}
          </button>
          </Tooltip> }
          </div>}
          {(isAuction && !isOwner) && 
            <Tooltip tooltip={`Show Bids`} >
            <button
            className="flex gap-2 bg-blue-500 text-white font-semibold py-4 px-6 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            onClick={handleClick}
          >  <FontAwesomeIcon icon={faEye} size='lg'/> {` View Bids`}
          </button>
          </Tooltip> }
        </main>
        </div>
    );
} 

export default Item;