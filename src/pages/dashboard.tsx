import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const [user, setUser] = useState<any>(null);

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
    <div className="flex">
      <NavigationMenu onNavigate={onNavigate} user={user} />
      <div className="p-6 flex-grow">
        <h1 className="text-2xl font-bold">
          Welcome {user?.user_metadata?.full_name || 'User'}
        </h1>
      </div>
    </div>
  );
}

export default Dashboard;
