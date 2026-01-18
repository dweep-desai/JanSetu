import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Landing from './pages/Landing';
import LoginPage from './pages/Auth/LoginPage';
import RoleSelectPage from './pages/Auth/RoleSelectPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenLayout from './pages/citizen/CitizenLayout';
import Services from './pages/citizen/Services';
import Profile from './pages/citizen/Profile';
import HelpAndSupport from './pages/citizen/HelpAndSupport';
// Health pages
import MedicalStoresNearMe from './pages/citizen/health/MedicalStoresNearMe';
import HospitalsNearMe from './pages/citizen/health/HospitalsNearMe';
import CallAmbulanceEmergency from './pages/citizen/health/CallAmbulanceEmergency';
import SearchMedicines from './pages/citizen/health/SearchMedicines';
import PatientHealthReport from './pages/citizen/health/PatientHealthReport';
import ESanjeevani from './pages/citizen/health/ESanjeevani';
import BloodBank from './pages/citizen/health/BloodBank';

// Emergency pages
import PoliceStationsNearMe from './pages/citizen/emergency/PoliceStationsNearMe';

// My City pages
import TrafficUpdates from './pages/citizen/my-city/TrafficUpdates';
import WeatherInfo from './pages/citizen/my-city/WeatherInfo';
import Complaints from './pages/citizen/my-city/Complaints';
import BookPublicTransport from './pages/citizen/my-city/BookPublicTransport';

// Agriculture pages
import MarketAvailability from './pages/citizen/agriculture/MarketAvailability';
import CheckMSP from './pages/citizen/agriculture/CheckMSP';
import AgriSupplyExchange from './pages/citizen/agriculture/AgriSupplyExchange';
import Mkisaan from './pages/citizen/agriculture/Mkisaan';

// Education pages
import DownloadMarksheet from './pages/citizen/education/DownloadMarksheet';
import ABCId from './pages/citizen/education/ABCId';
import AICTE from './pages/citizen/education/AICTE';
import NTA from './pages/citizen/education/NTA';

// Transport pages
import PetrolStationsNearMe from './pages/citizen/transport/PetrolStationsNearMe';
import FuelPrices from './pages/citizen/transport/FuelPrices';

// DigiLocker
import DigiLockerPage from './pages/citizen/digilocker/DigiLockerPage';

// Other pages

import Schemes from './pages/citizen/Schemes';
import UserHistory from './pages/citizen/UserHistory';
import SystemStats from './pages/citizen/SystemStats';

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
      <Route path="/auth/selection" element={<RoleSelectPage />} />

      {/* Dashboard route - redirects based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role.name === 'CITIZEN' && <Navigate to="/citizen" replace />}

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
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CitizenDashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<Profile />} />
        <Route path="schemes" element={<Schemes />} />
        <Route path="history" element={<UserHistory />} />
        <Route path="digilocker" element={<DigiLockerPage />} />
        <Route path="help" element={<HelpAndSupport />} />
        {/* Health routes */}
        <Route path="health/medical-stores-near-me" element={<MedicalStoresNearMe />} />
        <Route path="health/hospitals-near-me" element={<HospitalsNearMe />} />
        <Route path="health/call-ambulance" element={<CallAmbulanceEmergency />} />
        <Route path="health/search-medicines" element={<SearchMedicines />} />
        <Route path="health/patient-report" element={<PatientHealthReport />} />
        <Route path="health/e-sanjeevani" element={<ESanjeevani />} />
        <Route path="health/blood-bank" element={<BloodBank />} />

        {/* Emergency routes */}
        <Route path="emergency/police-stations-near-me" element={<PoliceStationsNearMe />} />

        {/* My City routes */}
        <Route path="my-city/public-transport" element={<BookPublicTransport />} />
        <Route path="my-city/traffic" element={<TrafficUpdates />} />
        <Route path="my-city/weather" element={<WeatherInfo />} />
        <Route path="my-city/complaints" element={<Complaints />} />
        <Route path="my-city/book-transport" element={<BookPublicTransport />} />

        {/* Agriculture routes */}
        <Route path="agriculture/market-availability" element={<MarketAvailability />} />
        <Route path="agriculture/check-msp" element={<CheckMSP />} />
        <Route path="agriculture/agri-supply-exchange" element={<AgriSupplyExchange />} />
        <Route path="agriculture/mkisaan" element={<Mkisaan />} />

        {/* Education routes */}
        <Route path="education/download-marksheet" element={<DownloadMarksheet />} />
        <Route path="education/abc-id" element={<ABCId />} />
        <Route path="education/aicte" element={<AICTE />} />
        <Route path="education/nta" element={<NTA />} />

        {/* Transport routes */}
        <Route path="transport/petrol-stations-near-me" element={<PetrolStationsNearMe />} />
        <Route path="transport/fuel-prices" element={<FuelPrices />} />

        {/* DigiLocker */}
        <Route path="digilocker" element={<DigiLockerPage />} />

        {/* Other routes */}
        <Route path="schemes" element={<Schemes />} />
        <Route path="system-stats" element={<SystemStats />} />

      </Route>



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