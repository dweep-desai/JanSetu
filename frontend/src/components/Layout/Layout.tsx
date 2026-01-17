import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1>JanSetu</h1>
          <nav className="nav">
            {user && (
              <>
                <span className="user-info">
                  {user.role.name.replace('_', ' ')} - {user.aadhar}
                </span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
