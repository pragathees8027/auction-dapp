'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import Tooltip from './Tooltip';
import { ethers } from 'ethers';

const Item = ({auctionContract, name, id, price, owner, getItems, available, userAddr, user, isAuction}) =>{
    const [index, setIndex] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        getItemIndex(name);
      }, []);

      const handleSubmit = () => {
        alert('clicked');
        console.log(auctionContract);
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

    const endAuction = async () => {
      if (!auctionContract) {
          return alert('Auction contract is not initialized. Please connect your wallet.');
      }

      try {
          let itemId = await auctionContract.getItemIndex(name);; 
          const tx = await auctionContract.endAuction(itemId, { gasLimit: 10000000 });
          await tx.wait();
          alert('Auction ended successfully!');
          getItems();
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
          alert('Bid placed successfully!');
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
            if (result.deletedCount > 0) {
              alert(`Item deleted succcessfully`);
            }
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
        <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 hover:bg-opacity-50 bg-gray-600 px-8 py-8 rounded-lg shadow min-w-80 overflow-ellipsis">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              {name}
        </h2>
       
        <div className='flex flex-col items-center text-current'>
        <p>Price</p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{price}</span>
        </div>
        <div className='flex flex-col items-center text-current'>
          <p>Seller</p>
          <span className='font-bold max-w-48 overflow-scroll scroll'>{owner}</span>
        </div>

          {available && <div className="flex gap-6 justify-evenly w-72">
            {isOwner || user ? ( isAuction != 'true' && <Tooltip tooltip={`Start auction`} >
            <button
              className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-5 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faCirclePlay} size='xl' />
            </button>
            </Tooltip>) :
            <Tooltip tooltip={`Bid +0.1 ETH`} >
            <button
              className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-6 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faEthereum} size='xl' />
            </button>
            </Tooltip>}
            {isOwner || user ? ( isAuction == 'true' &&
            <Tooltip tooltip={`End auction`} >
              <button
              className={`bg-red-500 text-white flex gap-4 font-semibold py-4 px-5 rounded hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out`}
              onClick={endAuction}
            >
              <FontAwesomeIcon icon={faCircleStop} size='xl'/>
              End Auction
            </button>
            </Tooltip>) :
             <Tooltip tooltip={`Bid +0.5 ETH`} >
             <button
               className="bg-green-500 text-white flex gap-1 font-semibold py-4 px-6 rounded hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
               onClick={handleSubmit}
             >
               <FontAwesomeIcon icon={faEthereum} size='xl' />
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
          </div>}
        </main>
        </div>
    );
} 

export default Item;