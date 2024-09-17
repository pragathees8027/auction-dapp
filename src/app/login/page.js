'use client';

import { useState } from "react";
import Footer from '../../components/Footer.js';

export default function Home() {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/auth?username=${username}&password=${password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //   username,
        //   password,
        // }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Logged in successfully: ${result.username}`);
        console.log(result);
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
    } catch (error) {
      alert('An error occurred while logging in.');
      console.error('Error:', error);
    }
};


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              Login
        </h2>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <ul className="mb-4">
            <label htmlFor="username">Username: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
              type="text"
              id="username"
              value={username}
              placeholder="type username here"
              onChange={handleUsernameChange}
              required
            />
          </ul>
          <ul className="mb-4">
            <label htmlFor="password">Password: </label>
            <input
              className="text-black placeholder:text-gray-500 text-center rounded p-1"
              type="password"
              id="password"
              value={password}
              placeholder="type password here"
              onChange={handlePasswordChange}
              required
            />
          </ul>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </ol>
      </main>

      <Footer />
    </div>
  );
}
