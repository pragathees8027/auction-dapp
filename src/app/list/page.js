'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import Footer from '@/components/Footer';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";
import Item from "../../components/Item";

export default function User() {
  let auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
  let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [ongoingAuction, setOngoingAuction] = useState([]);
  let [availableItems, setAvailableItems] = useState([]);
  let [unAvailableItems, setUnAvailableItems] = useState([]);
  let [auctionContract, setAuctionContract] = useState(null);
  let [authenticated, setAuthenticated] = useState(false);
  let [userAddr, setUserAddr] = useState(null);
  
  let logout = useSessionStore(state => state.logout);
  const ws = new WebSocket('ws://localhost:8080');
  let [loading, setLoading] = useState(true)
  let router = useRouter();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    let user = localStorage.getItem('username');
    if (!isUserAuthenticated) {
      router.push('/login');
    } else {
      setAuthenticated(true);
      getAddress();
      getItems(user);
    }
    setTimeout(() => { setLoading(false)}, 200);
    // setLoading(false);
  }, []); // Only run on mount

  useEffect(() => {
    let user = localStorage.getItem('username');
    if (auctionContract) {
        connectWallet()
        getOnGoingAuctionsData();
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
  
     if (message.type === 'NEW_BID' || message.type === 'END' || message.type === 'START') {
      connectWallet();
      getOnGoingAuctionsData();
     }
    };
  
    return () => {
      ws.close();
    };
  }, [auctionContract, ws]);

  const connectWallet = async () => {
    try {
        await provider.send("eth_requestAccounts", []);
        const newSigner = provider.getSigner();
        setSigner(newSigner);
        const newContract = new ethers.Contract(contractAddress, auctionAbi, newSigner);
        setAuctionContract(newContract);
        const address = await getAddress();
        setUserAddr(address);
    } catch (error) {
        alert('Error connecting wallet: ' + error.message);
    }
  };

  const getOnGoingAuctionsData = async () => {
    if (!auctionContract) {
        return;
    }

    try {
        const ongoingAuctionData = await auctionContract.getOngoingAuctions();
        const userAuctions = ongoingAuctionData.filter(auction => auction.seller.toString().toLowerCase() == userAddr.toString());
        setOngoingAuction(userAuctions);
    } catch (error) {
        alert('Error fetching ongoing auctions: ' + error.message);
    }
  };

  const getAddress = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0]; // Get the user's address
        setUserAddr(address); // Set userAddr in state
        return address;
      } catch (error) {
        console.error("User denied account access or an error occurred:", error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
    return null;
  };

  const getItems = async (user) => {
    try {
      const response = await fetch(`/api/auth/list?itemowner=${encodeURIComponent(user)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const available = result.filter(item => item.available === true);
        const unavailable = result.filter(item => item.available === false);
        setAvailableItems(available);
        setUnAvailableItems(unavailable);
      } else {
        // const errorText = await response.text();
        setAvailableItems([]);
        setUnAvailableItems([]);
        // alert(errorText);
      }
    } catch (error) {
      // alert('An error occurred while retrieving user items.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const refreshItems = () => {
    let user = localStorage.getItem('username');
    getItems(user);
  };

  if (loading || !authenticated) {
    return <Loading />;
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
       <Header provider={provider} setProvider={setProvider} setSigner={setSigner} setAuctionContract={setAuctionContract}/>
       
      <div className='flex flex-col items-center justify-start gap-4 min-w-full'>
        <h2 className="text-center text-2xl font-bold bg-green-500 shadow p-4 min-w-full rounded-full">Available</h2>
        <div className={`flex flex-wrap outline-dashed rounded-2xl min-w-full min-h-40 ${availableItems.length > 0 ? 'justify-evenly' : 'justify-center pt-32'}`}>
          {availableItems.length > 0 ? availableItems.map((item, index) => (
              <Item key={index} auctionContract={auctionContract} name={item.itemname} price={item.itemprice} id={item._id} owner={item.itemowner} getItems={refreshItems} available={item.available} userAddr={null} user={true}/>
          )) : <p className="text-red-500 font-bold min-h-40">No items</p>}
        </div>

        <h2 className="text-center text-2xl font-bold bg-green-500 shadow p-4 min-w-full rounded-full mt-24">Ongoing</h2>
        <div className={`flex flex-wrap outline-dashed rounded-2xl min-w-full min-h-40 ${ongoingAuction.length > 0 ? 'justify-evenly' : 'justify-center pt-32'}`}>
          {ongoingAuction.length > 0 ? ongoingAuction.map((item, index) => (
              <Item key={index} auctionContract={auctionContract} name={item.name} 
              price={`${ item.highestBid ? ethers.utils.formatUnits(item.highestBid, 18).toString() : 'No bids yet'} ETH`} 
              id={item._id} 
              owner={`${ item.seller ? item.seller.toString() : 'unknown'}`} 
              getItems={refreshItems} available={!item.ended} userAddr={userAddr} isAuction={`true`}/>
          )) : <p className="text-red-500 font-bold min-h-40">No items</p>}
        </div>

        <h2 className="text-center text-2xl font-bold mt-24 bg-red-500 shadow p-4 min-w-full rounded-full">Sold</h2>
        <div className={`flex flex-wrap outline-dashed rounded-2xl min-w-full min-h-40 ${unAvailableItems.length > 0 ? 'justify-evenly' : 'justify-center pt-32 pb-32'}`}>
          {unAvailableItems.length > 0 ? unAvailableItems.map((item, index) => (
              <Item key={index} auctionContract={auctionContract} name={item.itemname} price={item.itemprice} id={item._id} owner={item.itemowner} getItems={refreshItems} available={item.available} userAddr={null} user={true} winner={item.winner} winBid={item.bid}/>
          )) : <p className="text-red-500 font-bold">No items</p>}
        </div> 
      </div>
      
      <Footer />
    </div>
  );
}
