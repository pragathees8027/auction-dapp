'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useTheme } from "next-themes";
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import { ethers } from 'ethers';
import Header from "@/components/Header.js";

export default function Home() {
  let logout = useSessionStore(state => state.logout);
  let [loading, setLoading] = useState(true)
  let [ authenticated, setAuthenticted] = useState(false);
  let { theme, setTheme } = useTheme();
  let router = useRouter();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    setAuthenticted(isUserAuthenticated);
    setTimeout(() => { setLoading(false)}, 200);
    console.log(theme);
    // setLoading(false);
  }, [router]);

  const handleSubmit = () => {
      logout();
      router.push('/login');
    };

    const connectToMetaMask = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;
      } else {
        alert('MetaMask is not installed!');
        return null;
      }
    };

    const handleConnect = async () => {
      setLoading(true);
      let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isUserAuthenticated) {
        router.push('/login');
      }
      
      let storedAddress = localStorage.getItem('address');
      let connectedAddress = await connectToMetaMask();

      if (storedAddress && connectedAddress) {
        if (storedAddress.toLowerCase() === connectedAddress.toLowerCase()) {
          console.log('User is connected:', connectedAddress);
          alert(`${connectedAddress}`);
        } else {
          alert('Address does not match stored address.');
        }
      }
    };

    if (loading) {
      return <Loading />;
    }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <Header />
      
      <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 bg-gray-600 px-32 py-16 rounded-lg">
        <h2 className="text-center text-2xl text-blue-500 font-bold">
              AuctionD
        </h2>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <ul className="mb-4">
            <p>Conduct auctions in blockchain.</p>
          </ul>
          <div className="flex gap-6 justify-center mt-8">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={handleSubmit}
            >
              Enter
            </button>
            { authenticated && 
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                onClick={handleConnect}
              >
                Connect
            </button>
            }
          </div>
        </ol>
      </main>
    <Footer />
    </div>
  );
}
