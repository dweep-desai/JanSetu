import { 
  Home, Grid3X3, FileText, MapPin, BookOpen, LayoutDashboard,
  Search, Bell, Moon, Menu, Heart, AlertTriangle, Train, Fuel,
  Bookmark, ChevronLeft, ChevronRight, Phone, Calculator,
  Star, Cloud, Wind, Droplets, Thermometer
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CitizenDashboard.css';

// ============================================
// JanSetu Dashboard - Complete Single File
// ============================================

// Sidebar Component
const Sidebar = () => {
  const navItems = [
    { icon: <Home className="nav-icon" />, label: "myJanSetu", active: true },
    { icon: <Grid3X3 className="nav-icon" />, label: "Services" },
    { icon: <FileText className="nav-icon" />, label: "DigiLocker" },
    { icon: <MapPin className="nav-icon" />, label: "State" },
    { icon: <BookOpen className="nav-icon" />, label: "Schemes" },
    { icon: <LayoutDashboard className="nav-icon" />, label: "Dashboard" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item, index) => (
            <li key={index}>
              <a href="#" className={`nav-item ${item.active ? 'active' : ''}`}>
                {item.icon}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.aadhar) {
      // Use first two characters of Aadhar or name if available
      return user.aadhar.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserName = () => {
    if (user?.aadhar) {
      return `${user.aadhar.substring(0, 4)}...`;
    }
    return 'User';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn">
          <Menu className="w-5 h-5" />
        </button>
        <div className="logo">
          <div className="logo-icon">
            <span>J</span>
          </div>
          <span className="logo-text">JanSetu</span>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" />
          <input type="text" placeholder='Search For "EPFO"' className="search-input" />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn">
          <Bell className="w-5 h-5" />
        </button>
        <button className="icon-btn">
          <Moon className="w-5 h-5" />
        </button>
        <div className="user-info">
          <div className="avatar">{getUserInitials()}</div>
          <span className="user-name">{getUserName()}</span>
        </div>
        <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </header>
  );
};

// Quick Services Component
const QuickServices = () => {
  const services = [
    { title: "Health", icon: <Heart className="service-icon" />, gradient: "health" },
    { title: "Emergency", icon: <AlertTriangle className="service-icon" />, gradient: "emergency" },
    { title: "Travel", icon: <Train className="service-icon" />, gradient: "travel" },
    { title: "Utility", icon: <Fuel className="service-icon" />, gradient: "utility" },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <Star className="section-icon pink" />
        <h2 className="section-title">Quick Services</h2>
      </div>
      
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className={`service-card ${service.gradient}`}>
            <span className="service-title">{service.title}</span>
            <div className="service-icon-container">{service.icon}</div>
          </div>
        ))}
      </div>
      
      <div className="dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
};

// Recent Services Component
const RecentServices = () => {
  const recentServices = [
    { icon: "🏛️", name: "CBSE", category: "Education, Skills & Employn", color: "blue" },
    { icon: "🌾", name: "Agriculture Department", category: "General", color: "green" },
    { icon: "🏥", name: "ABHA", category: "Health & Wellness", color: "teal" },
    { icon: "👶", name: "CHILDLINE 1098", category: "Women, Child &", color: "pink" },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Recently Used Services</h2>
        <div className="nav-arrows">
          <button className="arrow-btn"><ChevronLeft className="w-4 h-4" /></button>
          <button className="arrow-btn"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="recent-grid">
        {recentServices.map((service, index) => (
          <div key={index} className="recent-card">
            <div className={`recent-icon ${service.color}`}>{service.icon}</div>
            <div className="recent-info">
              <h3 className="recent-name">{service.name}</h3>
              <p className="recent-category">{service.category}</p>
            </div>
            <button className="bookmark-btn">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// Helpline Categories Component
const HelplineCategories = () => {
  const categories = [
    { icon: "👨‍🌾", label: "Farmers" },
    { icon: "👴", label: "Senior Citizen" },
    { icon: "🎓", label: "Student" },
    { icon: "👩‍👧", label: "Women & Child" },
    { icon: "🏥", label: "Health" },
    { icon: "👮", label: "Police" },
    { icon: "🚂", label: "Indian R..." },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <Phone className="section-icon orange" />
        <h2 className="section-title">Essential Helpline Numbers</h2>
      </div>
      
      <div className="helpline-grid">
        {categories.map((category, index) => (
          <div key={index} className="helpline-item">
            <div className="helpline-icon">{category.icon}</div>
            <span className="helpline-label">{category.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Weather & AQI Card Component
const WeatherAQICard = () => {
  return (
    <div className="weather-card">
      <div className="weather-header">
        <Cloud className="weather-cloud-icon" />
        <span className="weather-location">New Delhi, India</span>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <Thermometer className="temp-icon" />
          <span className="temp-value">28°C</span>
        </div>
        <span className="weather-condition">Partly Cloudy</span>
      </div>
      
      <div className="weather-details">
        <div className="weather-detail">
          <Droplets className="detail-icon" />
          <span>Humidity: 65%</span>
        </div>
        <div className="weather-detail">
          <Wind className="detail-icon" />
          <span>Wind: 12 km/h</span>
        </div>
      </div>
      
      <div className="aqi-section">
        <div className="aqi-header">
          <span className="aqi-label">Air Quality Index</span>
          <span className="aqi-value moderate">156</span>
        </div>
        <div className="aqi-bar">
          <div className="aqi-fill" style={{ width: '52%' }}></div>
        </div>
        <span className="aqi-status">Moderate - Unhealthy for sensitive groups</span>
      </div>
    </div>
  );
};

// Financial Calculator Card Component
const FinancialCalculatorCard = () => {
  return (
    <div className="financial-card">
      <div className="financial-overlay"></div>
      <div className="financial-content">
        <Calculator className="calculator-icon" />
        <h3 className="financial-title">Financial Calculator</h3>
        <p className="financial-desc">
          Get instant insights to make smarter money calculations.
        </p>
        <button className="calculate-btn">Calculate Now</button>
      </div>
    </div>
  );
};

// Promo Cards Component
const PromoCards = () => {
  return (
    <div className="promo-grid">
      <WeatherAQICard />
      <FinancialCalculatorCard />
    </div>
  );
};

// ============================================
// Main Dashboard Component - Export This
// ============================================
const CitizenDashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="main-content">
          <QuickServices />
          <RecentServices />
          <HelplineCategories />
          <PromoCards />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;