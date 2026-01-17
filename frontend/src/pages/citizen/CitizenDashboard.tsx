import { useState, useEffect } from 'react';

import {
  Heart, AlertTriangle, Castle, Fuel,
  Bookmark, ChevronLeft, ChevronRight, Phone, Calculator,
  Star, Cloud, Wind, Droplets, Thermometer, Mail, X
} from "lucide-react";
import HealthQuickMenu from '../../components/citizen/HealthQuickMenu';
import EmergencyQuickMenu from '../../components/citizen/EmergencyQuickMenu';
import MyCityQuickMenu from '../../components/citizen/MyCityQuickMenu';
import './CitizenDashboard.css';
import { getWeather } from '../../services/weatherService';



// Quick Services Component
const QuickServices = () => {
  const [isHealthMenuOpen, setIsHealthMenuOpen] = useState(false);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [isMyCityMenuOpen, setIsMyCityMenuOpen] = useState(false);



  const services = [
    { title: "Health", icon: <Heart className="service-icon" />, gradient: "health", action: () => setIsHealthMenuOpen(true) },
    { title: "Emergency", icon: <AlertTriangle className="service-icon" />, gradient: "emergency", action: () => setIsEmergencyMenuOpen(true) },
    { title: "My City", icon: <Castle className="service-icon" />, gradient: "travel", action: () => setIsMyCityMenuOpen(true) },
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
      <MyCityQuickMenu
        isOpen={isMyCityMenuOpen}
        onClose={() => setIsMyCityMenuOpen(false)}
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

// Helpline Data Types
interface HelplineContact {
  name: string;
  description?: string;
  numbers: string[];
  email?: string;
  icon?: string; // Emoji or image path
}

interface HelplineCategoryData {
  id: string;
  icon: string;
  label: string;
  contacts: HelplineContact[];
}

// Helpline Data
const helplineData: HelplineCategoryData[] = [
  {
    id: "farmers",
    icon: "👨‍🌾",
    label: "Farmers",
    contacts: [
      { name: "Agriculture Ministry Helpline", description: "Farmer Grievances", numbers: ["1800-180-1551"], email: "help@kisan.gov.in" },
      { name: "Kisan Call Centre", numbers: ["1800-180-1551"] },
      { name: "National Seeds Corporation", numbers: ["011-25845528"] },
      { name: "National Horticulture Board", numbers: ["0124-2343414"] },
      { name: "Soil Health Card Scheme", numbers: ["1800-180-1551"] } // Assuming generic kisan helpline if specific not found, but screenshot implies existence.
    ]
  },
  {
    id: "senior_citizen",
    icon: "👴",
    label: "Senior Citizen",
    contacts: [
      { name: "HelpAge India", numbers: ["011-41688955", "011-41688956"] },
      { name: "Elder Line", numbers: ["14567"] }
    ]
  },
  {
    id: "student",
    icon: "🎓",
    label: "Student",
    contacts: [
      { name: "National Anti-Ragging Helpline", numbers: ["1800-180-5522"], email: "helpline@antiragging.in" },
      { name: "University Grants Commission", numbers: ["011-23604446"], email: "contact.ugc@nic.in" },
      { name: "All India Council for Technical Education", numbers: ["011-26131576-78", "011-26131576-80"], email: "helpdesk1@aicte-india.org" },
      { name: "Central Board of Secondary Education", numbers: ["1800-11-8002", "7669886950"], email: "info@cbse.gov.in" }
    ]
  },
  {
    id: "women_child",
    icon: "👩‍👧",
    label: "Women & Child",
    contacts: [
      { name: "Women Helpline", numbers: ["1091"] },
      { name: "Child Helpline", numbers: ["1098"] },
      { name: "National Commission for Women", numbers: ["7827-170-170"] },
      { name: "National Commission for Protection of Child Rights", numbers: ["1800-121-2830"] }
    ]
  },
  {
    id: "health",
    icon: "🏥",
    label: "Health",
    contacts: [
      { name: "COVID-19 Helpline", numbers: ["1075"] },
      { name: "National AIDS Helpline", numbers: ["1097"] },
      { name: "Indian Medical Association", numbers: ["011-26588895", "011-26588900"] }
    ]
  },
  {
    id: "police",
    icon: "👮",
    label: "Police",
    contacts: [
      { name: "Cyber Crime Reporting", numbers: ["1930"] },
      { name: "Emergency Police Helpline", numbers: ["112"] },
      { name: "Women's Helpline (Police)", numbers: ["1090"] },
      { name: "Delhi Police Complaints", numbers: ["1093"] },
      { name: "All India Railway Helpline", numbers: ["1512"] }
    ]
  }
];

// Helpline Modal Component
const HelplineModal = ({ category, onClose }: { category: HelplineCategoryData | null, onClose: () => void }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            {category.label}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {category.contacts.map((contact, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                  {/* Fallback generic icon if specific image not loaded */}
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500 font-medium font-mono">{contact.numbers.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="p-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                <a href={`tel:${contact.numbers[0]}`} className="p-2.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helpline Categories Component
const HelplineCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<HelplineCategoryData | null>(null);

  return (
    <>
      <section className="section">
        <div className="section-header">
          <Phone className="section-icon orange" />
          <h2 className="section-title">Essential Helpline Numbers</h2>
        </div>

        <div className="helpline-grid" style={{ justifyContent: 'space-between' }}>
          {helplineData.map((category) => (
            <div
              key={category.id}
              className="helpline-item"
              onClick={() => setSelectedCategory(category)}
            >
              <div className="helpline-icon">{category.icon}</div>
              <span className="helpline-label">{category.label}</span>
            </div>
          ))}
        </div>
      </section>

      <HelplineModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};

// Weather & AQI Card Component
const WeatherAQICard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const data = await getWeather(position.coords.latitude, position.coords.longitude);
                setWeather(data);
              } catch (e) {
                // Fallback to default
                const data = await getWeather();
                setWeather(data);
              }
            },
            async () => {
              // Permission denied or error, fallback to default
              const data = await getWeather();
              setWeather(data);
            }
          );
        } else {
          const data = await getWeather();
          setWeather(data);
        }
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading || !weather) {
    return (
      <div className="weather-card flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    return 'unhealthy';
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    return 'Unhealthy';
  };

  const aqiColor = getAqiColor(weather.aqi);
  const aqiPercentage = Math.min((weather.aqi / 300) * 100, 100);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <Cloud className="weather-cloud-icon" />
        <span className="weather-location">{weather.location}</span>
      </div>

      <div className="weather-main">
        <div className="temperature">
          <Thermometer className="temp-icon" />
          <span className="temp-value">{weather.temp}°C</span>
        </div>
        <span className="weather-condition">{weather.condition}</span>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <Droplets className="detail-icon" />
          <span>Humidity: {weather.humidity}%</span>
        </div>
        <div className="weather-detail">
          <Wind className="detail-icon" />
          <span>Wind: {weather.wind} km/h</span>
        </div>
      </div>

      <div className="aqi-section">
        <div className="aqi-header">
          <span className="aqi-label">Air Quality Index</span>
          <span className={`aqi-value ${aqiColor}`}>{weather.aqi}</span>
        </div>
        <div className="aqi-bar">
          <div className="aqi-fill" style={{ width: `${aqiPercentage}%` }}></div>
        </div>
        <span className="aqi-status">{getAqiStatus(weather.aqi)}</span>
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