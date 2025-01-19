import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import './logout.css';

interface NavigationMenuProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
  user: any; // Aceptamos el usuario como prop
}

const LogoutIcon = () => (
  <svg viewBox="0 0 512 512" className="logout-icon">
    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
  </svg>
);

function NavigationMenu({ onNavigate }: NavigationMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="w-full md:w-[200px] bg-neutral-900 text-white min-h-screen flex flex-col sm:w-[100px]">
      {/* Contenedor para el título y el menú de hamburguesa */}
      <div className="flex flex-col items-center p-4 md:hidden">
        <h1 className="text-3xl">Lyts</h1>
        {/* Menú de hamburguesa debajo del título */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menú lateral para pantallas grandes */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:block flex-grow md:flex md:flex-col md:items-start`}
      >
        <h1 className="p-4 text-3xl hidden md:block">Lyts</h1>
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
        <button className="Btn ml-2 mb-2" onClick={handleLogout}>
          <div className="sign">
            <LogoutIcon />
          </div>
          <div className="text">Logout</div>
        </button>
      </div>
    </nav>
  );
}

export default NavigationMenu;
