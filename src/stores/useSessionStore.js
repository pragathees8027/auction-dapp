import { create } from 'zustand';

const useSessionStore = create((set) => ({
  username: null,
  isAuthenticated: false,
  login: (username) => {
    set({ username: username, isAuthenticated: true });
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
  },
  logout: () => {
    set({ username: null, address: null, isAuthenticated: false });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  },
}));

const initializeAuthState = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('username');
  return { username, isAuthenticated };
};

export default useSessionStore;
