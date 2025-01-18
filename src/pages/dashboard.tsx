import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import styled from 'styled-components';
import ButtonAdd from '@/components/ButtonAdd';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  function welcome() {
    setIsVisible(false);
  }

  useEffect(() => {
    // Obtener la sesión actual
    const getUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      // Si hay un usuario en la sesión, actualizar el estado
      if (session?.user) {
        setUser(session.user);
      }
    };

    getUser();

    // Suscripción a cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Actualizar el estado del usuario
        setUser(session?.user || null);
      }
    );

    // Desuscribir cuando el componente se desmonte
    return () => {
      // Verificar si el listener tiene el método unsubscribe
      if (listener && typeof listener.unsubscribe === 'function') {
        listener.unsubscribe(); // Aquí estamos asegurándonos de llamar correctamente a unsubscribe
      }
    };
  }, []);

  return (
    <div className="flex bg-neutral-700">
      <NavigationMenu onNavigate={onNavigate} user={user} />
      <div className="p-6 flex-grow text-gray-100 bg-neutral-800 m-2 rounded-lg">
        <h1 className="text-2xl font-bold">
          Welcome {user?.user_metadata?.full_name || 'User'}
        </h1>

        {isVisible && 
          <StyledWrapper className='mt-5' onClick={welcome}>
            
            <div className="notification">
              <div className="notiglow" />
              <div className="notiborderglow" />
              <div className="notititle">Welcome To Lytcs</div>
              <div className="notibody">Manage your brain</div>
            </div>

          </StyledWrapper>
        }

        <div className="pt-5">
          <ButtonAdd />
        </div>
        
        
        
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .notification {
    display: flex;
    flex-direction: column;
    isolation: isolate;
    position: relative;
    width: 18rem;
    height: 5rem;
    background: #29292c;
    border-radius: 1rem;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 16px;
    --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
    --color: #32a6ff
  }

  .notification:before {
    position: absolute;
    content: "";
    inset: 0.0625rem;
    border-radius: 0.9375rem;
    background: #18181b;
    z-index: 2
  }

  .notification:after {
    position: absolute;
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    border-radius: 0.125rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }

  .notification:hover:after {
    transform: translateX(0.15rem)
  }

  .notititle {
    color: var(--color);
    padding: 0.65rem 0.25rem 0.4rem 1.25rem;
    font-weight: 500;
    font-size: 1.1rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notification:hover .notititle {
    transform: translateX(0.15rem)
  }

  .notibody {
    color: #99999d;
    padding: 0 1.25rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notification:hover .notibody {
    transform: translateX(0.25rem)
  }

  .notiglow,
  .notiborderglow {
    position: absolute;
    width: 20rem;
    height: 20rem;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side at center, white, transparent);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .notiglow {
    z-index: 3;
  }

  .notiborderglow {
    z-index: 1;
  }

  .notification:hover .notiglow {
    opacity: 0.1
  }

  .notification:hover .notiborderglow {
    opacity: 0.1
  }

  .note {
    color: var(--color);
    position: fixed;
    top: 80%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 0.9rem;
    width: 75%;
  }`;

export default Dashboard;
