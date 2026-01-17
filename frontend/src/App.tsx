import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Landing from './pages/Landing';
import LoginPage from './pages/Auth/LoginPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Layout from './components/Layout/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Landing page - public */}
      <Route path="/" element={<Landing />} />
      
      {/* Login page */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      
      {/* Dashboard route - redirects based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role.name === 'CITIZEN' && <CitizenDashboard />}
            {user?.role.name === 'SERVICE_PROVIDER' && (
              <Layout>
                <ProviderDashboard />
              </Layout>
            )}
            {user?.role.name === 'ADMIN' && (
              <Layout>
                <AdminDashboard />
              </Layout>
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/citizen/*"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/provider/*"
        element={
          <ProtectedRoute allowedRoles={['SERVICE_PROVIDER']}>
            <Layout>
              <ProviderDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;