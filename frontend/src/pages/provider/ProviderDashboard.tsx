import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest, Service } from '../../types';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Layers,
  Briefcase,
  Users,
  Search,
  ArrowRight,
  Trash2,
  FileText,
  Activity,
  Inbox,
  Package,
  ShoppingCart
} from 'lucide-react';

interface Appointment {
  consultation_id: string;
  citizen_id: string;
  esanjeevani_provider_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  symptoms: string | null;
  medical_history: string | null;
  rejection_reason: string | null;
  provider_notes: string | null;
  created_at: string;
  updated_at: string;
  citizen_name: string | null;
  citizen_phone: string | null;
  citizen_gender: string | null;
  citizen_age: number | null;
  citizen_date_of_birth: string | null;
  citizen_address: string | null;
}

interface Product {
  product_id: string;
  mkisan_citizen_id: string;
  product_name: string;
  product_type: string;
  category: string;
  quantity: string;
  price_per_unit: number;
  location: string | null;
  description: string | null;
  seller_name: string;
  seller_phone: string | null;
  created_at: string;
  updated_at: string;
}

const ProviderDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceOnboardingRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [providerType, setProviderType] = useState<'esanjeevani' | 'mkisan' | 'unknown'>('unknown');
  const [productsLoading, setProductsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'products' | 'services'>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [providerNotes, setProviderNotes] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_url: '',
    category: 'OTHER',
    service_id: '',
  });

  useEffect(() => {
    fetchData();
    detectProviderType();
    // Always try to fetch products in case user is mKisan provider
    fetchProducts();
  }, []);

  useEffect(() => {
    if (providerType === 'esanjeevani') {
      fetchAppointments();
    } else if (providerType === 'mkisan') {
      // Only fetch if not already fetched during detection
      if (products.length === 0) {
        fetchProducts();
      }
      setActiveTab('products');
    }
  }, [providerType]);

  const fetchData = async () => {
    try {
      const [requestsRes, servicesRes] = await Promise.all([
        api.get('/services/onboarding-requests'),
        api.get('/services/my-services'),
      ]);
      setRequests(requestsRes.data);
      setServices(servicesRes.data.services || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const detectProviderType = async () => {
    try {
      // Try to fetch appointments to check if e-Sanjeevani provider
      try {
        const appointmentsResponse = await api.get('/appointments/provider/appointments');
        setAppointments(appointmentsResponse.data || []);
        setProviderType('esanjeevani');
        return;
      } catch (e: any) {
        // If appointments fails (403/404), user is likely mKisan provider
        // For mKisan providers, always fetch and show products
        if (e.response?.status === 403 || e.response?.status === 404 || e.response?.status === 401) {
          try {
            const productsResponse = await api.get('/mkisan/products');
            setProducts(productsResponse.data || []);
            setProviderType('mkisan');
            setActiveTab('products');
            return;
          } catch (productsError: any) {
            console.error('Could not fetch products:', productsError);
            // Still set as mKisan even if products fetch fails
            setProviderType('mkisan');
            setActiveTab('products');
          }
        } else {
          // Other error, try products as fallback
          try {
            const productsResponse = await api.get('/mkisan/products');
            setProducts(productsResponse.data || []);
            setProviderType('mkisan');
            setActiveTab('products');
          } catch (productsError: any) {
            console.error('Fallback product fetch failed:', productsError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to detect provider type:', error);
      // Final fallback: try to fetch products
      try {
        const productsResponse = await api.get('/mkisan/products');
        setProducts(productsResponse.data || []);
        setProviderType('mkisan');
        setActiveTab('products');
      } catch (fallbackError) {
        console.error('Final fallback product fetch failed:', fallbackError);
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/provider/appointments');
      setAppointments(response.data);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      if (error.response?.status !== 404) {
        console.error('Error fetching appointments:', error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await api.get('/mkisan/products');
      setProducts(response.data || []);
      setProviderType('mkisan');
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      if (error.response?.status !== 404) {
        console.error('Error fetching products:', error);
      }
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/services/onboard', formData);
      setShowForm(false);
      setFormData({ name: '', description: '', base_url: '', category: 'OTHER', service_id: '' });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to submit request');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await api.delete(`/services/onboarding-requests/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to delete request');
    }
  };

  const handleAppointmentAction = async () => {
    if (!selectedAppointment || !actionType) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    try {
      await api.put(`/appointments/provider/appointments/${selectedAppointment.consultation_id}/action`, {
        action: actionType === 'approve' ? 'APPROVE' : 'REJECT',
        rejection_reason: actionType === 'reject' ? rejectionReason : null,
        provider_notes: actionType === 'approve' ? providerNotes : null
      });

      setSelectedAppointment(null);
      setActionType(null);
      setRejectionReason('');
      setProviderNotes('');
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to process appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Service Provider Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage appointments and publish services to JanSetu</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-primary/90 transition-all duration-200 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          Submit New Service
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Action Needed</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingAppointments}</div>
          <div className="text-sm text-slate-500">Pending Appointments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{services.filter(s => s.status === 'APPROVED').length}</div>
          <div className="text-sm text-slate-500">Active Services</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Lifetime</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
          <div className="text-sm text-slate-500">Total Appointments</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Layers size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Status</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{services.length + requests.length}</div>
          <div className="text-sm text-slate-500">Services Submitted</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Segmented Control Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-fit border border-slate-200">
          {providerType === 'esanjeevani' && (
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${activeTab === 'appointments'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Calendar size={16} />
              Appointment Requests
              {pendingAppointments > 0 && (
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'appointments' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                  {pendingAppointments}
                </span>
              )}
            </button>
          )}
          {(providerType === 'mkisan' || (providerType !== 'esanjeevani' && products.length > 0)) && (
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${activeTab === 'products'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Package size={16} />
              Available Products
              {products.length > 0 && (
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'products' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                  {products.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${activeTab === 'services'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Layers size={16} />
            My Services
            {(services.length + requests.length) > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'services' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>
                {services.length + requests.length}
              </span>
            )}
          </button>
        </div>

        {/* Products Grid (mKisan) */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {productsLoading ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Package size={32} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">No products available</h4>
                <p className="text-slate-500 max-w-sm mt-1">There are no products listed on the mKisan portal at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{product.product_name}</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-medium">{product.category}</span> • {product.product_type}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <Package size={20} className="text-green-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Quantity:</span>
                        <span className="font-medium text-slate-900">{product.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Price per unit:</span>
                        <span className="font-bold text-green-600">₹{product.price_per_unit.toFixed(2)}</span>
                      </div>
                      {product.location && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{product.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded border border-slate-100 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Users size={12} className="text-slate-400" />
                          <span>{product.seller_name}</span>
                        </div>
                        {product.seller_phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-400" />
                            <span>{product.seller_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Grid */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">No appointment requests yet</h4>
                <p className="text-slate-500 max-w-sm mt-1">New requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.consultation_id}
                    onClick={() => appointment.status === 'PENDING' && setSelectedAppointment(appointment)}
                    className={`bg-white rounded-xl border p-5 shadow-sm transition-all duration-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${appointment.status === 'PENDING'
                        ? 'border-l-4 border-l-yellow-400 border-slate-200 hover:shadow-md cursor-pointer hover:border-l-yellow-500'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-slate-900">{appointment.citizen_name || 'Unknown Citizen'}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border max-md:hidden ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {appointment.appointment_date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {appointment.appointment_time}
                        </div>
                        {appointment.citizen_phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-slate-400" />
                            {appointment.citizen_phone}
                          </div>
                        )}
                      </div>
                      {appointment.symptoms && (
                        <p className="text-sm text-slate-500 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2">
                          "{appointment.symptoms}"
                        </p>
                      )}
                      <span className={`md:hidden inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    {appointment.status === 'PENDING' && (
                      <div className="hidden md:flex flex-col items-center justify-center pl-4 border-l border-slate-100 text-slate-400 gap-1 min-w-[60px]">
                        <Activity size={20} />
                        <span className="text-xs font-medium">Review</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Services Grid */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2">

            {/* Active Services Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                Active Services
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-normal border border-slate-200">
                  Live
                </span>
              </h3>

              {services.length === 0 ? (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-500">You don't have any active services yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                          <Layers size={20} />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Onboarding Requests Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                Onboarding Requests
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-normal border border-slate-200">
                  Pending Review
                </span>
              </h3>

              {requests.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={32} className="text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">No pending requests</h4>
                  <p className="text-slate-500 max-w-sm mt-1">Submit a new service to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all duration-200 relative group overflow-hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                          <FileText size={20} />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{request.name}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-2">{request.description}</p>

                      {request.admin_notes && (
                        <div className="text-xs bg-red-50 text-red-600 p-2 rounded border border-red-100 mt-2">
                          <span className="font-semibold block mb-0.5">Admin Feedback:</span>
                          {request.admin_notes}
                        </div>
                      )}

                      {(request.status === 'PENDING' || request.status === 'CHANGES_REQUESTED') && (
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 rounded-full"
                          title="Delete Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Submit Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-slate-900">Submit New Service</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                  placeholder="e.g., e-District Portal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all bg-white"
                  >
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="AGRICULTURE">Agriculture</option>
                    <option value="GRIEVANCE">Grievance</option>
                    <option value="EDUCATION">Education</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service ID</label>
                  <input
                    type="text"
                    value={formData.service_id}
                    onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                    placeholder="e.g., UP-EDIST-01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                  placeholder="Briefly describe the service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base URL</label>
                <input
                  type="url"
                  value={formData.base_url}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                  placeholder="https://example.com/service"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary/90 transition-all">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Action Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-900">Review Appointment</h3>
              <button
                onClick={() => { setSelectedAppointment(null); setActionType(null); setRejectionReason(''); setProviderNotes(''); }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Appointment Details */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedAppointment.appointment_date}</h4>
                    <p className="text-sm text-slate-500">{selectedAppointment.appointment_time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.symptoms && (
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Symptoms</span>
                    <p className="text-sm text-slate-700 mt-0.5">{selectedAppointment.symptoms}</p>
                  </div>
                )}
                {selectedAppointment.medical_history && (
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medical History</span>
                    <p className="text-sm text-slate-700 mt-0.5">{selectedAppointment.medical_history}</p>
                  </div>
                )}
              </div>

              {/* Citizen Details Section */}
              <div className="bg-blue-50 p-4 rounded-xl space-y-3 border border-blue-100">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Citizen Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Full Name</span>
                    <p className="text-slate-900 font-medium">{selectedAppointment.citizen_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Phone</span>
                    <p className="text-slate-900 font-medium flex items-center gap-1">
                      <Phone size={14} className="text-slate-400" />
                      {selectedAppointment.citizen_phone || 'N/A'}
                    </p>
                  </div>
                  {selectedAppointment.citizen_gender && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Gender</span>
                      <p className="text-slate-900 font-medium">{selectedAppointment.citizen_gender}</p>
                    </div>
                  )}
                  {selectedAppointment.citizen_age !== null && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Age</span>
                      <p className="text-slate-900 font-medium">{selectedAppointment.citizen_age} years</p>
                    </div>
                  )}
                  {selectedAppointment.citizen_date_of_birth && (
                    <div className="col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Date of Birth</span>
                      <p className="text-slate-900 font-medium">{selectedAppointment.citizen_date_of_birth}</p>
                    </div>
                  )}
                  {selectedAppointment.citizen_address && (
                    <div className="col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Address</span>
                      <p className="text-slate-900 font-medium flex items-start gap-1">
                        <MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{selectedAppointment.citizen_address}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!actionType ? (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setActionType('approve')}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button
                    onClick={() => setActionType('reject')}
                    className="flex-1 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {actionType === 'approve' ? 'Provider Notes (Optional):' : 'Rejection Reason (Required):'}
                  </label>
                  <textarea
                    value={actionType === 'approve' ? providerNotes : rejectionReason}
                    onChange={(e) => actionType === 'approve' ? setProviderNotes(e.target.value) : setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                    placeholder={actionType === 'approve' ? 'Add any notes...' : 'Reason for rejection...'}
                    required={actionType === 'reject'}
                    autoFocus
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleAppointmentAction} className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                    </button>
                    <button
                      onClick={() => { setActionType(null); setRejectionReason(''); setProviderNotes(''); }}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
