import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">JanSetu</h1>
          <nav className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm opacity-90">
                  {user.role.name.replace('_', ' ')} - {user.aadhar}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
