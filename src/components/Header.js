"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import Tooltip from "@/components/Tooltip.js";

export default function Header() {
  let { theme, setTheme } = useTheme();
  let [icon, setIcon] = useState(faSun);
  let [username, setUsername] = useState('anonymous');
  let [mount, setMount] = useState(false);

  useEffect(() => {
    let storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    setIcon(storedTheme === 'light' ? faSun : faMoon);

    let isUserAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isUserAuthenticated) {
      let user = localStorage.getItem('username') || 'anonymous';
      setUsername(user);
    }
    setMount(true);
  }, [setTheme]);

  const copyToClipboard = useCallback(() => {
    if (username !== 'anonymous') {
      navigator.clipboard.writeText(username)
        .then(() => {
          console.log(`${username} copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  }, [username]);

  const handleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIcon(newTheme === 'light' ? faSun : faMoon);
  }, [theme, setTheme]);

  return mount ? (
    <header className="row-start-1 flex gap-6 flex-wrap items-center justify-between min-w-72 marginBottom">
      <Tooltip text="Click to copy username">
        <button
          aria-label="Copy username"
          className="flex items-center gap-2 cursor-pointer hover:scale-125 hover:text-blue-700"
          onClick={copyToClipboard}
        >
          <FontAwesomeIcon icon={faUser} size="lg" />
          {username}
        </button>
      </Tooltip>

      <Tooltip text="Click to toggle theme">
        <button
          aria-label="Toggle theme"
          className="flex items-center gap-2 cursor-pointer hover:scale-125 hover:text-blue-700"
          onClick={handleTheme}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
        </button>
      </Tooltip>
    </header>
  ) : null;
};
