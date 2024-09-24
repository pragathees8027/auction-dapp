'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer.js';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";

export default function Home() {
  let [itemname, setItemname] = useState('');
  let [itemprice, setItemprice] = useState(10);
  let [startdate, setStartdate] = useState('');
  let [starttime, setStarttime] = useState('');
  let [loading, setLoading] = useState(true)
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
    if (event.target.value < 10) {
      alert('Staring price cannot be below 10.');
      return;
    }
    setItemprice(event.target.value);
  }; 

  const handleSubmit = async (event) => {
    let username = localStorage.getItem('username');
    let itemowner = username;

    event.preventDefault();

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
        alert(`Item added successfully: ${item.itemname}, Available: ${item.available}`);
        console.log(result);
      } else {
        const errorText = await response.text();
        alert(errorText);
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
      <Header />

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
