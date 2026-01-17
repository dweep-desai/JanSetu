import {
  Building2, MapPin, Ambulance, Pill, Phone, ShieldAlert,
  Car, CloudSun, FileText, LucideIcon, Tractor, ShoppingCart,
  Calculator, Zap, Bus, Fuel, Droplet,
  Activity, Stethoscope, Download, IdCard, School, FileCheck, FolderLock
} from 'lucide-react';



// Service Action Types
export type ServiceActionType = 'navigate' | 'call' | 'custom';

// Service Action Handler - receives context (navigate, onClose, etc.)
export type ServiceActionHandler = (context?: {
  navigate?: (path: string) => void;
  onClose?: () => void;
  [key: string]: any;
}) => void | Promise<void>;

// Service Action
export interface ServiceAction {
  type: ServiceActionType;
  handler: ServiceActionHandler;
}

// Service Definition Interface
export interface ServiceDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'health' | 'emergency' | 'travel' | 'utility' | 'general' | 'agriculture' | 'education';
  color: string;
  action: ServiceAction;
  metadata?: {
    phoneNumber?: string;
    path?: string;
    [key: string]: any;
  };
}

// Helper to create navigate action
const createNavigateAction = (path: string): ServiceAction => ({
  type: 'navigate',
  handler: (context) => {
    if (context?.onClose) context.onClose();
    if (context?.navigate) {
      context.navigate(path);
    } else {
      window.location.href = path;
    }
  }
});

// Helper to create call action
const createCallAction = (phoneNumber: string): ServiceAction => ({
  type: 'call',
  handler: (context) => {
    // Close menu if onClose is provided
    if (context?.onClose) {
      context.onClose();
    }

    // Execute the phone call immediately
    // Multiple methods to ensure it works across different browsers/devices
    const makeCall = () => {
      try {
        // Primary method: direct location change (works on mobile and desktop)
        window.location.href = `tel:${phoneNumber}`;
      } catch (error) {
        console.error('Error with window.location.href:', error);
        // Fallback method: create and click anchor element
        try {
          const link = document.createElement('a');
          link.href = `tel:${phoneNumber}`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          // Clean up after a short delay
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }, 100);
        } catch (fallbackError) {
          console.error('Error with anchor element method:', fallbackError);
          // Last resort: alert user (shouldn't happen)
          alert(`Please call ${phoneNumber} manually`);
        }
      }
    };

    // Execute immediately
    makeCall();
  }
});

// Shared Call Ambulance Service (used in both Health and Emergency)
const callAmbulanceService: ServiceDefinition = {
  id: 'call-ambulance',
  title: 'Call an Ambulance',
  description: 'Emergency booking',
  icon: Ambulance,
  category: 'health',
  color: 'bg-red-50 hover:bg-red-100 border-red-200',
  action: createNavigateAction('/citizen/health/call-ambulance'),
  metadata: {
    path: '/citizen/health/call-ambulance'
  }
};

// Health Services Definitions
export const healthServices: ServiceDefinition[] = [
  {
    id: 'medical-stores-near-me',
    title: 'Medical Stores Near Me',
    description: 'Find pharmacies nearby',
    icon: Building2,
    category: 'health',
    color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    action: createNavigateAction('/citizen/health/medical-stores-near-me'),
    metadata: {
      path: '/citizen/health/medical-stores-near-me'
    }
  },
  {
    id: 'hospitals-near-me',
    title: 'Hospitals Near Me',
    description: 'Find hospitals & clinics',
    icon: MapPin,
    category: 'health',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    action: createNavigateAction('/citizen/health/hospitals-near-me'),
    metadata: {
      path: '/citizen/health/hospitals-near-me'
    }
  },
  callAmbulanceService, // Use shared service object
  {
    id: 'search-medicines',
    title: 'Search Medicines',
    description: 'Check prices & MRP',
    icon: Pill,
    category: 'health',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    action: createNavigateAction('/citizen/health/search-medicines'),
    metadata: {
      path: '/citizen/health/search-medicines'
    }
  },
  {
    id: 'patient-health-report',
    title: 'Patient Health Report',
    description: 'View your health records',
    icon: Activity,
    category: 'health',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    action: createNavigateAction('/citizen/health/patient-report'),
    metadata: {
      path: '/citizen/health/patient-report'
    }
  },
  {
    id: 'e-sanjeevani',
    title: 'e-Sanjeevani',
    description: 'Telemedicine services',
    icon: Stethoscope,
    category: 'health',
    color: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
    action: createNavigateAction('/citizen/health/e-sanjeevani'),
    metadata: {
      path: '/citizen/health/e-sanjeevani'
    }
  },
  {
    id: 'blood-bank',
    title: 'Blood Bank',
    description: 'Find blood availability',
    icon: Droplet,
    category: 'health',
    color: 'bg-red-50 hover:bg-red-100 border-red-200',
    action: createNavigateAction('/citizen/health/blood-bank'),
    metadata: {
      path: '/citizen/health/blood-bank'
    }
  }
];

// Emergency Services Definitions
export const emergencyServices: ServiceDefinition[] = [
  {
    id: 'call-childline',
    title: 'Call Childline',
    description: 'For children in distress',
    icon: Phone,
    category: 'emergency',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    action: createCallAction('1098'),
    metadata: {
      phoneNumber: '1098'
    }
  },
  {
    id: 'woman-helpline',
    title: 'Woman Helpline',
    description: '24/7 Support for women',
    icon: ShieldAlert,
    category: 'emergency',
    color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    action: createCallAction('1091'),
    metadata: {
      phoneNumber: '1091'
    }
  },
  {
    id: 'locate-police-station',
    title: 'Locate Police Station',
    description: 'Find nearest police station',
    icon: MapPin,
    category: 'emergency',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    action: createNavigateAction('/citizen/emergency/police-stations-near-me'),
    metadata: {
      path: '/citizen/emergency/police-stations-near-me'
    }
  },
  callAmbulanceService // Use the same shared service object from Health Services
];

// My City Services Definitions
export const myCityServices: ServiceDefinition[] = [
  {
    id: 'public-transport',
    title: 'Public Transport',
    description: 'Book buses & metro',
    icon: Bus,
    category: 'travel',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    action: createNavigateAction('/citizen/my-city/public-transport'),
    metadata: {
      path: '/citizen/my-city/public-transport'
    }
  },
  {
    id: 'traffic-updates',
    title: 'Traffic Updates',
    description: 'Check congestion & delays',
    icon: Car,
    category: 'travel',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    action: createNavigateAction('/citizen/my-city/traffic'),
    metadata: {
      path: '/citizen/my-city/traffic'
    }
  },
  {
    id: 'weather-info',
    title: 'Weather Info',
    description: 'Pollution & forecast',
    icon: CloudSun,
    category: 'utility',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    action: createNavigateAction('/citizen/my-city/weather'),
    metadata: {
      path: '/citizen/my-city/weather'
    }
  },
  {
    id: 'complaints',
    title: 'Complaints',
    description: 'Report civic issues',
    icon: FileText,
    category: 'general',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    action: createNavigateAction('/citizen/my-city/complaints'),
    metadata: {
      path: '/citizen/my-city/complaints'
    }
  },
  {
    id: 'book-public-transport',
    title: 'Book Public Transport',
    description: 'Reserve bus & metro tickets',
    icon: Bus,
    category: 'travel',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    action: createNavigateAction('/citizen/my-city/book-transport'),
    metadata: {
      path: '/citizen/my-city/book-transport'
    }
  }
];

// Agriculture Services Definitions
export const agricultureServices: ServiceDefinition[] = [
  {
    id: 'national-agri-supply-exchange',
    title: 'National Agri Supply Exchange',
    description: 'Provide agri supply info to govt and citizens',
    icon: Tractor,
    category: 'agriculture',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    action: createNavigateAction('/citizen/agriculture/agri-supply-exchange'),
    metadata: {
      path: '/citizen/agriculture/agri-supply-exchange'
    }
  },
  {
    id: 'mkisaan-platform',
    title: 'Mkisaan - Buyer and Seller Platform',
    description: 'Connect farmers with buyers',
    icon: ShoppingCart,
    category: 'agriculture',
    color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    action: createNavigateAction('/citizen/agriculture/mkisaan'),
    metadata: {
      path: '/citizen/agriculture/mkisaan'
    }
  },
  {
    id: 'check-msp',
    title: 'Check MSP',
    description: 'View Minimum Support Prices',
    icon: Calculator,
    category: 'agriculture',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    action: createNavigateAction('/citizen/agriculture/check-msp'),
    metadata: {
      path: '/citizen/agriculture/check-msp'
    }
  },
  {
    id: 'see-market-availability',
    title: 'See Market Where Product Available',
    description: 'Find product availability in markets',
    icon: MapPin,
    category: 'agriculture',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    action: createNavigateAction('/citizen/agriculture/market-availability'),
    metadata: {
      path: '/citizen/agriculture/market-availability'
    }
  }
];

// Education Services Definitions
export const educationServices: ServiceDefinition[] = [
  {
    id: 'download-marksheet',
    title: 'Download Marksheet',
    description: 'Get your academic certificates',
    icon: Download,
    category: 'education',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    action: createNavigateAction('/citizen/education/download-marksheet'),
    metadata: {
      path: '/citizen/education/download-marksheet'
    }
  },
  {
    id: 'abc-id',
    title: 'ABC ID',
    description: 'Academic Bank of Credits',
    icon: IdCard,
    category: 'education',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    action: createNavigateAction('/citizen/education/abc-id'),
    metadata: {
      path: '/citizen/education/abc-id'
    }
  },
  {
    id: 'aicte',
    title: 'AICTE',
    description: 'All India Council for Technical Education',
    icon: School,
    category: 'education',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    action: createNavigateAction('/citizen/education/aicte'),
    metadata: {
      path: '/citizen/education/aicte'
    }
  },
  {
    id: 'nta',
    title: 'NTA',
    description: 'National Testing Agency',
    icon: FileCheck,
    category: 'education',
    color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    action: createNavigateAction('/citizen/education/nta'),
    metadata: {
      path: '/citizen/education/nta'
    }
  }
];

// Transport & Utility Services Definitions
export const transportUtilityServices: ServiceDefinition[] = [
  {
    id: 'petrol-stations-near-me',
    title: 'Petrol Stations Near Me',
    description: 'Find nearby fuel stations',
    icon: Fuel,
    category: 'utility',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    action: createNavigateAction('/citizen/transport/petrol-stations-near-me'),
    metadata: {
      path: '/citizen/transport/petrol-stations-near-me'
    }
  },
  {
    id: 'view-fuel-prices',
    title: "View Today's Fuel Prices",
    description: 'Check current fuel rates',
    icon: Zap,
    category: 'utility',
    color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
    action: createNavigateAction('/citizen/transport/fuel-prices'),
    metadata: {
      path: '/citizen/transport/fuel-prices'
    }
  }
];

// DigiLocker Services Definitions
export const digiLockerServices: ServiceDefinition[] = [
  {
    id: 'digilocker-dashboard',
    title: 'DigiLocker',
    description: 'Access your documents',
    icon: FolderLock,
    category: 'general',
    color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    action: createNavigateAction('/citizen/digilocker'),
    metadata: {
      path: '/citizen/digilocker'
    }
  }
];



// Helper function to get services by category
export const getServicesByCategory = (category: ServiceDefinition['category']): ServiceDefinition[] => {
  const allServices = [
    ...healthServices,
    ...emergencyServices,
    ...myCityServices,
    ...agricultureServices,
    ...educationServices,
    ...transportUtilityServices
  ];
  return allServices.filter(service => service.category === category);
};

// Helper function to get service by ID
export const getServiceById = (id: string): ServiceDefinition | undefined => {
  const allServices = [
    ...healthServices,
    ...emergencyServices,
    ...myCityServices,
    ...agricultureServices,
    ...educationServices,
    ...transportUtilityServices
  ];
  return allServices.find(service => service.id === id);
};


// Helper function to execute service action
export const executeServiceAction = (
  service: ServiceDefinition,
  context?: {
    navigate?: (path: string) => void;
    onClose?: () => void;
    [key: string]: any;
  }
) => {
  try {
    // Pass the service itself in context so handlers can access metadata
    if (service && service.action && service.action.handler) {
      service.action.handler({
        ...context,
        service
      });
    } else {
      console.error('Invalid service definition:', service);
    }
  } catch (error) {
    console.error('Error executing service action:', error, service);
  }
};

// Export all services
export const allServices: ServiceDefinition[] = [
  ...healthServices,
  ...emergencyServices,
  ...myCityServices,
  ...agricultureServices,
  ...educationServices,
  ...transportUtilityServices,
  ...digiLockerServices
];


