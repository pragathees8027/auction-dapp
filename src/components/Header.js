"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/components/Tooltip";
import Cookie from "js-cookie";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState(faSun);
  const [username, setUsername] = useState('anonymous');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = Cookie.get('theme') || 'light';
    setTheme(storedTheme);
    setIcon(storedTheme === 'light' ? faSun : faMoon);

    const isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isUserAuthenticated) {
      const user = localStorage.getItem('username') || 'anonymous';
      setUsername(user);
    }
    setMounted(true);
  }, [setTheme]);

  const copyToClipboard = useCallback(() => {
    if (username !== 'anonymous') {
      navigator.clipboard.writeText(username)
        .then(() => console.log(`${username} copied to clipboard!`))
        .catch(err => console.error('Failed to copy: ', err));
    }
  }, [username]);

  const handleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIcon(newTheme === 'light' ? faSun : faMoon);
    Cookie.set('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return mounted ? (
    <header className="flex items-center justify-between p-4 w-72">
      <Tooltip text="Click to copy username">
        <button
          aria-label="Copy username"
          className="flex items-center gap-2 cursor-copy hover:scale-125 hover:text-blue-500"
          onClick={copyToClipboard}
        >
          <FontAwesomeIcon icon={faUser} />
          {username}
        </button>
      </Tooltip>

      <Tooltip text="Click to toggle theme">
        <button
          aria-label="Toggle theme"
          className="flex items-center cursor-pointer hover:scale-125 hover:text-blue-500"
          onClick={handleTheme}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      </Tooltip>
    </header>
  ) : null;
}
