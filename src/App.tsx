import { useState } from 'react';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { ForgotPasswordPage } from './pages/forgot-password';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';

type Page = 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'signup' && <SignupPage onNavigate={setCurrentPage} />}
      {currentPage === 'forgot-password' && (
        <ForgotPasswordPage onNavigate={setCurrentPage} />
      )}
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'settings' && <Settings onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;
