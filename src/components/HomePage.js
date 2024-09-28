'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import Footer from '@/components/Footer';
import useSessionStore from '@/stores/useSessionStore.js';
import Loading from "@/components/Loading.js";
import Header from "@/components/Header.js";

export default function HomePage() {
  let auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
  let contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  let [provider, setProvider] = useState(null);
  let [signer, setSigner] = useState(null);
  let [auctionContract, setAuctionContract] = useState(null);
  
  let logout = useSessionStore(state => state.logout);
  let [loading, setLoading] = useState(true)
  let router = useRouter();

  useEffect(() => {
    setTimeout(() => { setLoading(false)}, 200);
    // setLoading(false);
  }, [router]);

  const handleSubmit = () => {
      logout();
      router.push('/login');
    };

    if (loading) {
      return <Loading />;
    }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)] transition-all ease-in-out duration-1000">
      <Header provider={provider} setProvider={setProvider} setSigner={setSigner} setAuctionContract={setAuctionContract}/>
      
      <main className="flex flex-col gap-8 row-start-2 items-center bg-opacity-35 bg-gray-600 px-40 py-20 rounded-lg shadow">
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
          </div>
        </ol>
      </main>
    <Footer />
    </div>
  );
}
