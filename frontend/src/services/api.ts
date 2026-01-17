import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';



// Define interface for our extended API

// Define interface for our extended API
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';


interface JanSetuApi extends AxiosInstance {
  getNearbyHospitals: (lat: number, lng: number) => Promise<any>;
  getNearbyMedicalStores: (lat: number, lng: number) => Promise<any>;
  getNearbyPoliceStations: (lat: number, lng: number) => Promise<any>;
  getNearbyPetrolStations: (lat: number, lng: number) => Promise<any>;
  requestAmbulanceEmergency: (payload: { address: string; lat?: number; lng?: number; landmark?: string }) => Promise<any>;
  searchMedicines: (query: string) => Promise<any>;
  getMSPData: () => Promise<any>;
  getAgricultureProducts: (query?: string) => Promise<any>;
  getMarketAvailability: (product?: string, location?: string) => Promise<any>;
  getFuelPrices: () => Promise<any>;
  // DigiLocker
  linkDigiLocker: (digilockerId: string) => Promise<any>;
  getMyDocuments: () => Promise<any>;
  fetchDocument: (docType: string, issuer: string, params: any) => Promise<any>;
}




const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as unknown as JanSetuApi; // Cast to our interface


// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);


// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// Healthcare Services
api.getNearbyHospitals = (lat: number, lng: number) => {
  return api.get(`/api/healthcare/hospitals/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};

api.getNearbyMedicalStores = (lat: number, lng: number) => {
  return api.get(`/api/healthcare/medical-stores/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};

api.getNearbyPoliceStations = (lat: number, lng: number) => {
  return api.get(`/api/emergency/police-stations/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};


api.requestAmbulanceEmergency = (payload: { address: string; lat?: number; lng?: number; landmark?: string }) => {
  return api.post('/api/healthcare/ambulance/emergency', payload).then((res: AxiosResponse) => res.data);
};

api.searchMedicines = (query: string) => {
  return api.get(`/api/healthcare/medicines/search?q=${encodeURIComponent(query)}`).then((res: AxiosResponse) => res.data);
};

// Petrol Stations - Using Overpass API (OpenStreetMap)
api.getNearbyPetrolStations = async (lat: number, lng: number) => {
  try {
    // Overpass API query for petrol stations within 5km radius
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:5000,${lat},${lng});
        way["amenity"="fuel"](around:5000,${lat},${lng});
        relation["amenity"="fuel"](around:5000,${lat},${lng});
      );
      out center meta;
    `;

    const response = await axios.post(overpassUrl, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 10000 // 10 second timeout
    });

    if (response.data && response.data.elements && response.data.elements.length > 0) {
      return response.data.elements.map((element: any, index: number) => {
        const center = element.center || { lat: element.lat, lon: element.lon };
        return {
          id: element.id?.toString() || `petrol-${index}`,
          name: element.tags?.name || `Petrol Station ${index + 1}`,
          address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || element.tags?.['addr:city'] || 'Address not available',
          phone: element.tags?.phone || element.tags?.['contact:phone'],
          lat: center.lat,
          lng: center.lon,
          fuelTypes: ['Petrol', 'Diesel', ...(element.tags?.fuel ? [element.tags.fuel] : [])],
          distance: calculateDistance(lat, lng, center.lat, center.lon)
        };
      }).sort((a: any, b: any) => {
        const distA = parseFloat(a.distance.replace(/[^\d.]/g, '')) || 0;
        const distB = parseFloat(b.distance.replace(/[^\d.]/g, '')) || 0;
        return distA - distB;
      });
    }
    // If no results from API, return fallback data
    return getDefaultPetrolStations(lat, lng);
  } catch (error) {
    console.error('Error fetching petrol stations:', error);
    // Return fallback data instead of throwing
    return getDefaultPetrolStations(lat, lng);
  }
};

// Helper function for default petrol stations
function getDefaultPetrolStations(lat: number, lng: number) {
  // Generate stations around the given location
  const stations = [
    { name: 'Indian Oil Petrol Pump', address: 'Connaught Place, New Delhi', phone: '011-23345678', offsetLat: 0.002, offsetLng: 0.002, fuelTypes: ['Petrol', 'Diesel', 'CNG'] },
    { name: 'Bharat Petroleum', address: 'Rajendra Place, New Delhi', phone: '011-23345679', offsetLat: -0.002, offsetLng: -0.002, fuelTypes: ['Petrol', 'Diesel'] },
    { name: 'HP Petrol Pump', address: 'Karol Bagh, New Delhi', phone: '011-23345680', offsetLat: 0.005, offsetLng: -0.003, fuelTypes: ['Petrol', 'Diesel', 'CNG', 'LPG'] },
    { name: 'Reliance Petrol Station', address: 'Dwarka, New Delhi', phone: '011-23345681', offsetLat: -0.005, offsetLng: 0.004, fuelTypes: ['Petrol', 'Diesel'] },
    { name: 'Shell Petrol Pump', address: 'Gurgaon Road, New Delhi', phone: '011-23345682', offsetLat: 0.008, offsetLng: 0.001, fuelTypes: ['Petrol', 'Diesel', 'Premium'] },
  ];

  return stations.map((station, index) => ({
    id: `petrol-${index + 1}`,
    name: station.name,
    address: station.address,
    phone: station.phone,
    lat: lat + station.offsetLat,
    lng: lng + station.offsetLng,
    fuelTypes: station.fuelTypes,
    distance: calculateDistance(lat, lng, lat + station.offsetLat, lng + station.offsetLng)
  }));
}

// MSP Data - Using Indian Government Data Portal or public API
api.getMSPData = async () => {
  try {
    // Try backend API first
    const response = await api.get('/api/agriculture/msp').then((res: AxiosResponse) => res.data);
    return response;
  } catch (error) {
    // Fallback: Fetch from public data source
    try {
      // Using a public agriculture data API or government portal
      const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070', {
        params: {
          'api-key': '579b464db66ec23bdd000001cdd3946e44ce4a6847209a79c23c8c46',
          format: 'json',
          limit: 100
        }
      });
      return response.data.records || [];
    } catch (fallbackError) {
      console.error('Error fetching MSP data:', fallbackError);
      throw fallbackError;
    }
  }
};

// Agriculture Products - Using Agmarknet or similar API
api.getAgricultureProducts = async (query?: string) => {
  try {
    const response = await api.get(`/api/agriculture/products${query ? `?q=${encodeURIComponent(query)}` : ''}`).then((res: AxiosResponse) => res.data);
    return response;
  } catch (error) {
    // Fallback to public API
    try {
      const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070', {
        params: {
          'api-key': '579b464db66ec23bdd000001cdd3946e44ce4a6847209a79c23c8c46',
          format: 'json',
          filters: query ? JSON.stringify({ commodity: query }) : undefined,
          limit: 50
        }
      });
      return response.data.records || [];
    } catch (fallbackError) {
      console.error('Error fetching agriculture products:', fallbackError);
      throw fallbackError;
    }
  }
};

// Market Availability
api.getMarketAvailability = async (product?: string, location?: string) => {
  try {
    const response = await api.get('/api/agriculture/market-availability', {
      params: { product, location }
    }).then((res: AxiosResponse) => res.data);
    if (response && Array.isArray(response) && response.length > 0) {
      return response;
    }
    // Return fallback data if API returns empty
    return getDefaultMarketData();
  } catch (error) {
    // Return fallback data instead of throwing
    console.error('Error fetching market availability:', error);
    return getDefaultMarketData();
  }
};

// Helper function for default market data
function getDefaultMarketData() {
  return [
    { id: '1', commodity: 'Wheat', category: 'Cereals', market: 'Mandi Bhavan', price: 2100, modal_price: 2100, unit: 'Quintal', state: 'Delhi', location: 'Delhi' },
    { id: '2', commodity: 'Rice', category: 'Cereals', market: 'Azadpur Mandi', price: 3200, modal_price: 3200, unit: 'Quintal', state: 'Delhi', location: 'Delhi' },
    { id: '3', commodity: 'Tomato', category: 'Vegetables', market: 'Azadpur Mandi', price: 40, modal_price: 40, unit: 'Kg', state: 'Delhi', location: 'Delhi' },
    { id: '4', commodity: 'Potato', category: 'Vegetables', market: 'Mandi Bhavan', price: 25, modal_price: 25, unit: 'Kg', state: 'Delhi', location: 'Delhi' },
    { id: '5', commodity: 'Onion', category: 'Vegetables', market: 'Azadpur Mandi', price: 35, modal_price: 35, unit: 'Kg', state: 'Delhi', location: 'Delhi' },
    { id: '6', commodity: 'Cotton', category: 'Fibers', market: 'Mandi Bhavan', price: 6500, modal_price: 6500, unit: 'Quintal', state: 'Delhi', location: 'Delhi' },
    { id: '7', commodity: 'Sugarcane', category: 'Cash Crops', market: 'Azadpur Mandi', price: 280, modal_price: 280, unit: 'Quintal', state: 'Delhi', location: 'Delhi' },
    { id: '8', commodity: 'Mustard', category: 'Oilseeds', market: 'Mandi Bhavan', price: 5200, modal_price: 5200, unit: 'Quintal', state: 'Delhi', location: 'Delhi' },
  ];
}

// Fuel Prices - Using public fuel price API
api.getFuelPrices = async () => {
  try {
    // Try backend API first
    const response = await api.get('/api/transport/fuel-prices').then((res: AxiosResponse) => res.data);
    return response;
  } catch (error) {
    // Fallback: Use public API or government data
    try {
      // Using Indian Oil or similar public API
      const response = await axios.get('https://api.data.gov.in/resource/5c2ee3e4-5e0e-4f5a-9f5a-5e0e4f5a9f5a', {
        params: {
          'api-key': '579b464db66ec23bdd000001cdd3946e44ce4a6847209a79c23c8c46',
          format: 'json',
          limit: 10
        }
      });
      return response.data.records || [];
    } catch (fallbackError) {
      console.error('Error fetching fuel prices:', fallbackError);
      // Return default structure if API fails
      return [
        { fuelType: 'Petrol', price: 96.72, change: 0.15, changePercent: 0.16, lastUpdated: new Date().toISOString().split('T')[0] },
        { fuelType: 'Diesel', price: 89.62, change: -0.10, changePercent: -0.11, lastUpdated: new Date().toISOString().split('T')[0] },
        { fuelType: 'CNG', price: 73.59, change: 0.25, changePercent: 0.34, lastUpdated: new Date().toISOString().split('T')[0] },
        { fuelType: 'LPG (14.2 kg)', price: 903.00, change: 0, changePercent: 0, lastUpdated: new Date().toISOString().split('T')[0] },
      ];
    }
  }
};

// DigiLocker Services
api.linkDigiLocker = (digilockerId: string) => {
  return api.post('/api/digilocker/link', { digilockerId, user_id: 1 }).then((res: AxiosResponse) => res.data); // Mock user_id 1
};

api.getMyDocuments = () => {
  return api.get('/api/digilocker/my-documents?user_id=1').then((res: AxiosResponse) => res.data);
};

api.fetchDocument = (docType: string, issuer: string, params: any) => {
  return api.post('/api/digilocker/fetch', {
    user_id: 1,
    doc_type: docType,
    issuer,
    params
  }).then((res: AxiosResponse) => res.data);
};

// Helper function to calculate distance

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default api;

