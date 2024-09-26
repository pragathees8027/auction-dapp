'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faDiagramProject, faDoorOpen, faSquarePlus } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  let home = '/';
  let [create, setCreate] = useState('');
  let [createIcon, setCreateIcon] = useState();
  let login = '/login';
  let bids = '/bids';
  let router = useRouter();
  let path = usePathname();

  useEffect(() => {
    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isUserAuthenticated) {
      setCreate('/create/item');
      setCreateIcon(faSquarePlus);
    } else {
      setCreate('/create/account');
      setCreateIcon(faUserPlus);
    }
  }, [router]);

  const handleHome = () => {
    if (!(path == home)) {
      router.push(home);
      // router.refresh();
    }
  }

  const handleCreate = () => {
    if (!(path == create)) {
      router.push(create);
    }
  }

  const handleLogin = () => {
    if (!(path == login)) {
      router.push(login);
    }
  }

  const handleBids = () => {
    if (!(path == bids)) {
      router.push(bids);
    }
  }

  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 hover:rounded-lg hover:text-white px-2 py-1"
        onClick={handleHome}
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faDoorOpen} 
          width={16}
          height={16}
        />
        Home
      </a>
      <a
        className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 hover:rounded-lg hover:text-white px-2 py-1 "
        onClick={handleCreate}
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={createIcon} 
          width={16}
          height={16}
        />
        Create
      </a>
      <a
        className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 hover:rounded-lg hover:text-white px-2 py-1"
        onClick={handleLogin}
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faUser} 
          width={16}
          height={16}
        />
        Login
      </a>
      <a
        className="flex items-center gap-2 cursor-pointer hover:bg-blue-500 hover:rounded-lg hover:text-white px-2 py-1"
        onClick={handleBids}
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faDiagramProject} 
          width={16}
          height={16} 
        />
        View Bids
      </a>
    </footer>
  );
}
