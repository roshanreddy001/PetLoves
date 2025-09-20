import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Generates a random pastel color based on a string (email)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
}

interface UserInfoProps {
  handleLogout?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ handleLogout }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const initial = user.email ? user.email[0].toUpperCase() : '?';
  const color = stringToColor(user.email || '');
  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full shadow border border-gray-200 text-lg font-bold select-none transition-colors"
        style={{ background: color }}
        onClick={() => setOpen((v) => !v)}
        title={user.email}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 animate-fade-in">
          <div className="font-semibold text-gray-800 mb-2">Account Details</div>
          <div className="mb-1">Name: <span className="font-mono">{user.name}</span></div>
          <div className="mb-1">Email: <span className="font-mono">{user.email}</span></div>
          <div className="mb-2">Phone: <span className="font-mono">{user.phone}</span></div>
          <button
            className="w-full bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors mt-2"
            onClick={handleLogout || logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
