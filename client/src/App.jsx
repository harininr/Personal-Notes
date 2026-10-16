import { useState } from 'react';
import Auth from './Auth';
import Notes from './Notes';
import './index.css';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const handleLogin = (u) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return user
    ? <Notes user={user} onLogout={handleLogout} />
    : <Auth onLogin={handleLogin} />;
}
