'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";

export default function Home() {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [loading, setLoading] = useState(true)
  let isAuthenticated = useSessionStore(state => state.isAuthenticated);
  let login = useSessionStore(state => state.login);
  let router = useRouter();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isUserAuthenticated) {
      router.push('/create/item');
    } else {
      setTimeout(() => { setLoading(false)}, 200);
      // setLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.username) {
          login(result.username);
          alert(`${result.username}`);
        }
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

if (loading) {
  return <Loading />;
}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 bg-gray-600 px-24 py-16 rounded-lg shadow">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              Login
        </h2>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-20"  htmlFor="username">Username: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="text"
              id="username"
              value={username}
              placeholder="type username here"
              // autocomplete="off"
              onChange={handleUsernameChange}
              required
            />
          </ul>
          <ul className="mb-4 flex gap-2 items-center justify-end">
            <label className="w-20"  htmlFor="password">Password: </label>
            <input
              className="text-center rounded p-1 w-64 bg-white bg-opacity-30"
              type="password"
              id="password"
              value={password}
              placeholder="type password here"
              // autocomplete="off"
              onChange={handlePasswordChange}
              required
            />
          </ul>
          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
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
