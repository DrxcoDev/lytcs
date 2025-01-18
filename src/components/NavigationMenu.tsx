import { supabase } from '@/lib/supabase';
import './logout.css';
import { useEffect, useState } from 'react';

interface NavigationMenuProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
  user: any; // Aceptamos el usuario como prop
}

const LogoutIcon = () => (
  <svg viewBox="0 0 512 512" className="logout-icon">
    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
  </svg>
);

function NavigationMenu({ onNavigate, user }: NavigationMenuProps) {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirigir a la página de inicio de sesión
      onNavigate('login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('There was an issue logging you out. Please try again.');
    }
  };

  return (
    <nav className="w-64 bg-neutral-900 text-white min-h-screen flex flex-col">
      <h1 className='p-4 text-3xl'>Lyts</h1>
      <ul className="flex-grow">
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          Home
        </li>
        <li
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => onNavigate('settings')}
        >
          Settings
        </li>
      </ul>
      {/* <div className="p-4 text-white bg-gray-700 flex items-center justify-between">
        {user ? (
          <span className="font-bold">
            Hello, {user?.user_metadata?.full_name || 'User'}!
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </div> */}
      <button className="Btn" onClick={handleLogout}>
        <div className="sign">
          <LogoutIcon />
        </div>
        <div className="text">Logout</div>
      </button>
    </nav>
  );
}

export default NavigationMenu;
