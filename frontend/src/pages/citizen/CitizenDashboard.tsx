import { useState } from 'react';

import {
  Heart, AlertTriangle, Train, Fuel,
  Bookmark, ChevronLeft, ChevronRight, Phone, Calculator,
  Star, Cloud, Wind, Droplets, Thermometer
} from "lucide-react";
import HealthQuickMenu from '../../components/citizen/HealthQuickMenu';
import EmergencyQuickMenu from '../../components/citizen/EmergencyQuickMenu';
import './CitizenDashboard.css';


// Quick Services Component
const QuickServices = () => {
  const [isHealthMenuOpen, setIsHealthMenuOpen] = useState(false);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);


  const services = [
    { title: "Health", icon: <Heart className="service-icon" />, gradient: "health", action: () => setIsHealthMenuOpen(true) },
    { title: "Emergency", icon: <AlertTriangle className="service-icon" />, gradient: "emergency", action: () => setIsEmergencyMenuOpen(true) },
    { title: "Travel", icon: <Train className="service-icon" />, gradient: "travel" },
    { title: "Utility", icon: <Fuel className="service-icon" />, gradient: "utility" },
  ];

  return (
    <>
      <section className="section">
        <div className="section-header">
          <Star className="section-icon pink" />
          <h2 className="section-title">Quick Services</h2>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card ${service.gradient}`}
              onClick={service.action}
            >
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

      <HealthQuickMenu
        isOpen={isHealthMenuOpen}
        onClose={() => setIsHealthMenuOpen(false)}
      />
      <EmergencyQuickMenu
        isOpen={isEmergencyMenuOpen}
        onClose={() => setIsEmergencyMenuOpen(false)}
      />
    </>
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
// Main Dashboard Component
// ============================================
const CitizenDashboard = () => {
  return (
    <>
      <QuickServices />
      <RecentServices />
      <HelplineCategories />
      <PromoCards />
    </>
  );
};

export default CitizenDashboard;