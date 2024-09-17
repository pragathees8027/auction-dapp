'use client';

import { useState } from "react";
import Footer from '../../../components/Footer.js';

export default function Home() {
  let [itemname, setItemname] = useState('');
  let [itemprice, setItemprice] = useState(10);
  let [startdate, setStartdate] = useState('');
  let [starttime, setStarttime] = useState('');

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

  const handleSubmit = () => {

    if (!itemname.trim()) {
      alert('Item name is required.');
      return;
    }

    if (!itemprice) {
      alert('Item price is required.');
      return;
    }

    if (!startdate.trim()) {
      alert('Date is required.');
      return;
    }

    if (!starttime.trim()) {
      alert('Time is required.');
      return;
    }


    // axios.post('http://localhost:3001/create', { username, password })
    // .then(response => {
    //   const { message, user, error } = response.data;
    //   console.log('Data sent successfully');
    //   if (message == 'success') {
    //       console.log('Account created: ', user);
    //       setColor('green');
    //       setMessage('Account created: ', user.username);
    //       setStatus(true);
    //   } else {
    //       console.log('Account creation failed: ', message);
    //       setColor('red');
    //       setMessage(message);
    //   }
    //   setLoading(false);
    //   setShowAlert(true)
    // })
    // .catch(error => {
    //   console.error('Error sending data:', error);
    //   setMessage('Error creating account.');
    //   setLoading(false);
    //   setShowAlert(true);
    // });
    alert(`${itemname} : ${itemprice} : ${startdate} : ${starttime}`);
};

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              Add Item
        </h2>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <ul className="mb-4">
            <label htmlFor="username">Item name: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
              type="text"
              id="username"
              value={itemname}
              placeholder="type item name here"
              onChange={handleItemnameChange}
              required
            />
          </ul>
          <ul className="mb-4">
            <label htmlFor="price">Staring price: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
              type="number"
              id="price"
              value={itemprice}
              onChange={handleItempriceChange}
              required
            />
          </ul>
          <ul className="mb-4">
            <label htmlFor="start_time">Starting Time: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
              type="time"
              id="start_time"
              value={starttime}
              placeholder={starttime}
              onChange={handleTimeChange}
              required
            />
          </ul>
          <ul className="mb-4">
            <label htmlFor="start_date">Auction date: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
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
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
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
