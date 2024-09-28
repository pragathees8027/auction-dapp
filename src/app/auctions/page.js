'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import Footer from '@/components/Footer';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";
import Item from "../../components/Item";

export default function Ongoing() {
  let auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
  let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [ongoingAuction, setOngoingAuction] = useState([]);
  let [auctionContract, setAuctionContract] = useState(null);
  let [authenticated, setAuthenticated] = useState(false);
  let [userAddr, setUserAddr] = useState(null);
  
  let logout = useSessionStore(state => state.logout);
  let [loading, setLoading] = useState(true)
  let router = useRouter();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    let user = localStorage.getItem('username');
    if (!isUserAuthenticated) {
      router.push('/login');
    } else {
      setAuthenticated(true);
    }
    
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);
      } else {
          alert('MetaMask not found');
      }
    };
    initProvider();

    const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'ITEM_ADDED') {
            getItems(user);
        }
    };
    setTimeout(() => { setLoading(false)}, 200);
    // setLoading(false);
  }, []); // Only run on mount

  useEffect(() => {
    if (provider) {
        connectWallet();
        getOnGoingAuctionsData();
    }
}, [provider]); 

useEffect(() => {
  if (auctionContract) {
      getOnGoingAuctionsData();
  }
}, [auctionContract]);

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

  const getAddress = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } catch (error) {
        console.error("User denied account access or an error occurred:", error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
    return null;
  };

  const getOnGoingAuctionsData = async () => {
    if (!auctionContract) {
        return;
    }

    try {
        const ongoingAuctionData = await auctionContract.getOngoingAuctions();
        setOngoingAuction(ongoingAuctionData);
    } catch (error) {
        alert('Error fetching ongoing auctions: ' + error.message);
    }
  };

  const refreshItems = () => {
    getOnGoingAuctionsData();
  };

  if (loading || !authenticated) {
    return <Loading />;
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
       <Header provider={provider} setProvider={setProvider} setSigner={setSigner} setAuctionContract={setAuctionContract}/>
       
      <div className='flex flex-col items-center justify-start gap-4'>
        <h2 className="text-center text-2xl text-blue-500 font-bold">Ongoing auctions</h2>
        <div className='flex flex-wrap justify-evenly'>
          {ongoingAuction.length > 0 ? ongoingAuction.map((item, index) => (
              <Item key={index} auctionContract={auctionContract} name={item.name} 
              price={`${ item.highestBid ? ethers.utils.formatUnits(item.highestBid, 18).toString() : 'No bids yet'} ETH`} 
              id={item._id} 
              owner={`${ item.seller ? item.seller.toString() : 'unknown'}`} 
              getItems={refreshItems} available={!item.ended} userAddr={userAddr} isAuction={`true`}/>
          )) : <p className="text-red-500 font-bold">No items</p>}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
