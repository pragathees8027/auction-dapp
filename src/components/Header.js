"use client";

import { useTheme } from "next-themes";
import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useSessionStore from '@/stores/useSessionStore.js';
import Tooltip from "@/components/Tooltip";
import Cookie from "js-cookie";

export default function Header({provider, setProvider, setSigner, setAuctionContract}) {
  const auctionAbi = JSON.parse(process.env.NEXT_PUBLIC_AUCTION_ABI);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState(faSun);
  const [username, setUsername] = useState('anonymous');
  const [publicAddress, setPublicAddress] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false); 
  const [authenticated, setAuthenticated] = useState(false);
  const logout = useSessionStore(state => state.logout);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const storedTheme = Cookie.get('theme') || 'light';
    setTheme(storedTheme);
    setIcon(storedTheme === 'light' ? faMoon : faSun);

    const isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    setAuthenticated(isUserAuthenticated);
    if (isUserAuthenticated) {
      const user = localStorage.getItem('username') || 'anonymous';
      setUsername(user);
    }
    setMounted(true);
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);
      } else {
          alert('MetaMask not found');
      }
    };
    initProvider();
    if (isUserAuthenticated) {
      connectMetaMask();
    }
  }, [setTheme, router, isConnected]);

  const copyToClipboard = useCallback(() => {
    if (authenticated) {
      navigator.clipboard.writeText(publicAddress)
        .then(() => {
          console.log(`${publicAddress} copied to clipboard!`);
          alert('public address copied.')
        })
        .catch(err => console.error('Failed to copy: ', err));
    } else {
      if (path != '/login') {
        router.push('/login')
      }
    }
  }, [isConnected]);

  const handleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIcon(newTheme === 'light' ? faMoon : faSun);
    Cookie.set('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setPublicAddress(accounts[0]);
        setIsConnected(true);
        await provider.send("eth_requestAccounts", []);
        const newSigner = provider.getSigner();
        setSigner(newSigner);
        const newContract = new ethers.Contract(contractAddress, auctionAbi, newSigner);
        setAuctionContract(newContract);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return mounted ? (
    <header className="flex items-center justify-between gap-8 p-4 w-auto">
      {authenticated && <Tooltip tooltip="click to logout">
      <button
          aria-label="Logout"
          className={`flex gap-1 items-center px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white transition-colors duration-200`}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </Tooltip>}

      <Tooltip tooltip={authenticated? `Click to copy public address` : 'Login'}>
        <button
          aria-label="Copy public address"
          className="flex items-center gap-2 cursor-copy hover:scale-125 my-2 hover:text-blue-500"
          onClick={copyToClipboard}
        >
          <FontAwesomeIcon icon={faUser} />
          {username}
        </button>
      </Tooltip>

      {authenticated && <Tooltip tooltip={isConnected ? "Connected to MetaMask" : "Connect to MetaMask"}>
        <button
          aria-label="Connect to MetaMask"
          className={`flex items-center px-4 py-2 rounded ${isConnected ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white transition-colors duration-200`}
          onClick={connectMetaMask}
        >
          {isConnected ? "Connected" : "Connect to Metamask"}
        </button>
      </Tooltip>}

      <Tooltip tooltip={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
        <button
          aria-label="Toggle theme"
          className="flex items-center cursor-pointer hover:scale-125 my-3 hover:text-blue-500"
          onClick={handleTheme}
        >
          <FontAwesomeIcon icon={icon}/>
        </button>
      </Tooltip>
    </header>
  ) : null;
}
