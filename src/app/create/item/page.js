'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer.js';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";

export default function Home() {
  let auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
  let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [auctionContract, setAuctionContract] = useState(null);

  let [itemname, setItemname] = useState('');
  let [itemprice, setItemprice] = useState(null);
  let [startdate, setStartdate] = useState('');
  let [starttime, setStarttime] = useState('');
  let [loading, setLoading] = useState(true)
  const ws = new WebSocket('ws://localhost:8080');
  let router = useRouter();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isUserAuthenticated) {
      router.push('/login');
    } else {
      let user = localStorage.getItem('username');
      if (!user) {
        logout();
        alert('Session error. Please login again.');
        router.push('/login');
      }
      setTimeout(() => { setLoading(false)}, 200);
      // setLoading(false);
    }

    return(() => {
      ws.close();
    })
  }, [router]);

  const handleItemnameChange = (event) => {
    setItemname(event.target.value);
  };

  const handleDateChange = (event) => {
    setStartdate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setStarttime(event.target.value);
  };

  const handleItempriceChange = (event) => {
    setItemprice(event.target.value);
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();

    let username = localStorage.getItem('username');
    let itemowner = username;

    try {
        const response = await fetch('/api/auction/put', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              itemname,
              itemprice,
              startdate,
              starttime,
              itemowner,
          }),
        });

        if (response.ok) {
            const result = await response.json();
            ws.send(JSON.stringify({ type: 'ITEM_ADDED' }));
            alert(`Item added successfully: ${result.itemname}, Available: ${result.available}`);
            console.log(result);
        } else {
            const errorText = await response.text();
            alert(`${errorText}`);
        }
    } catch (error) {
        alert('An error occurred while adding item.');
        console.error('Error:', error);
    }
};

if (loading) {
  return <Loading />;
}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <Header provider={provider} setProvider={setProvider} setSigner={setSigner} setAuctionContract={setAuctionContract}/>

      <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 bg-gray-600 px-20 py-8 rounded-lg shadow">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              Add Item
        </h2>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-32" htmlFor="item_name">Item name: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="text"
              id="item_name"
              value={itemname}
              placeholder="type item name here"
              onChange={handleItemnameChange}
              required
            />
          </ul>
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-32" htmlFor="price">Staring price: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="number"
              id="price"
              placeholder="type item price in ETH "
              value={itemprice}
              onChange={handleItempriceChange}
              required
            />
          </ul>
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-32" htmlFor="start_time">Starting Time: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="time"
              id="start_time"
              value={starttime}
              placeholder={starttime}
              onChange={handleTimeChange}
              required
            />
          </ul>
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-32" htmlFor="start_date">Auction date: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="date"
              id="start_date"
              value={startdate}
              placeholder={startdate}
              onChange={handleDateChange}
              required
            />
          </ul>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              Add Item to Auction
            </button>
          </div>
        </ol>
      </main>

      <Footer />
    </div>
  );
}
