import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Stethoscope, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import api from '../../../services/api';

interface Provider {
    esanjeevani_provider_id: string;
    service_provider_id: string;
    full_name: string;
    specialization: string;
    provider_type: string;
    years_of_experience: number | null;
    phone: string | null;
}

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
    provider_name: string | null;
    specialization: string | null;
}

const ESanjeevani = () => {
    const [activeTab, setActiveTab] = useState<'book' | 'appointments'>('book');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [providers, setProviders] = useState<Provider[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Generate random available slots (1-15) for each provider
    const getRandomSlots = (providerId: string): number => {
        // Use provider ID as seed for consistent random slots per provider
        const hash = providerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 15) + 1; // Returns 1-15
    };

    // Generate time slots
    const generateTimeSlots = (): string[] => {
        const slots: string[] = [];
        const startHour = 9; // 9 AM
        const endHour = 18; // 6 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeStr = hour >= 12 
                    ? `${hour === 12 ? 12 : hour - 12}:${minute.toString().padStart(2, '0')} PM`
                    : `${hour}:${minute.toString().padStart(2, '0')} AM`;
                slots.push(timeStr);
            }
        }
        
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        if (activeTab === 'appointments') {
            fetchAppointments();
        }
    }, [activeTab]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/appointments/providers/esanjeevani');
            setProviders(response.data);
        } catch (err: any) {
            console.error('Failed to fetch providers:', err);
            setError('Failed to load service providers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            setAppointmentsLoading(true);
            const response = await api.get('/appointments/my-appointments');
            setAppointments(response.data);
        } catch (err: any) {
            console.error('Failed to fetch appointments:', err);
            setError('Failed to load your appointments. Please try again later.');
        } finally {
            setAppointmentsLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedProvider || !selectedSlot || !selectedDate) {
            setError('Please select a provider, date, and time slot.');
            return;
        }

        try {
            setBooking(true);
            setError(null);
            setSuccess(null);

            await api.post('/appointments/book', {
                esanjeevani_provider_id: selectedProvider.esanjeevani_provider_id,
                appointment_date: selectedDate,
                appointment_time: selectedSlot,
                symptoms: null,
                medical_history: null
            });

            setSuccess(`Appointment request sent successfully! The service provider will review your request and notify you.`);
            
            // Reset form
            setSelectedProvider(null);
            setSelectedSlot('');
            setSelectedDate('');
            
            // Refresh appointments if on appointments tab
            if (activeTab === 'appointments') {
                fetchAppointments();
            }
        } catch (err: any) {
            console.error('Failed to book appointment:', err);
            setError(err.response?.data?.detail || 'Failed to book appointment. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">e-Sanjeevani</h1>
                    <p className="text-gray-600">Telemedicine services - Consult doctors online</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600">Loading service providers...</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'CANCELLED': return 'bg-gray-50 text-gray-700 border-gray-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED': return <CheckCircle size={16} className="text-green-600" />;
            case 'PENDING': return <AlertCircle size={16} className="text-yellow-600" />;
            case 'REJECTED': return <XCircle size={16} className="text-red-600" />;
            case 'COMPLETED': return <CheckCircle size={16} className="text-blue-600" />;
            case 'CANCELLED': return <XCircle size={16} className="text-gray-600" />;
            default: return <AlertCircle size={16} className="text-slate-600" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">e-Sanjeevani</h1>
                <p className="text-gray-600">Telemedicine services - Consult doctors online</p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => {
                        setActiveTab('book');
                        setError(null);
                        setSuccess(null);
                    }}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                        activeTab === 'book'
                            ? 'border-teal-600 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Book Appointment
                </button>
                <button
                    onClick={() => {
                        setActiveTab('appointments');
                        setError(null);
                        setSuccess(null);
                    }}
                    className={`px-6 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                        activeTab === 'appointments'
                            ? 'border-teal-600 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FileText size={16} />
                    My Appointments
                    {appointments.filter(a => a.status === 'PENDING').length > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            {appointments.filter(a => a.status === 'PENDING').length}
                        </span>
                    )}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    {success}
                </div>
            )}

            {activeTab === 'appointments' ? (
                <div className="space-y-4">
                    {appointmentsLoading ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-gray-600">Loading your appointments...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No appointments yet</h3>
                            <p className="text-gray-600">You haven't booked any appointments. Book your first appointment to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                My Appointments ({appointments.length})
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {appointments.map((appointment) => (
                                    <div
                                        key={appointment.consultation_id}
                                        className={`bg-white rounded-xl border p-5 shadow-sm transition-all duration-200 ${
                                            appointment.status === 'PENDING'
                                                ? 'border-l-4 border-l-yellow-400 border-gray-200'
                                                : appointment.status === 'APPROVED'
                                                ? 'border-l-4 border-l-green-400 border-gray-200'
                                                : appointment.status === 'REJECTED'
                                                ? 'border-l-4 border-l-red-400 border-gray-200'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                                                        <Stethoscope size={20} className="text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">
                                                            {appointment.provider_name || 'Unknown Provider'}
                                                        </h3>
                                                        {appointment.specialization && (
                                                            <p className="text-sm text-gray-600">{appointment.specialization}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(appointment.status)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>{appointment.appointment_date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>{appointment.appointment_time}</span>
                                            </div>
                                        </div>

                                        {appointment.symptoms && (
                                            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Symptoms</span>
                                                <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                                            </div>
                                        )}

                                        {appointment.status === 'REJECTED' && appointment.rejection_reason && (
                                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                                <div className="flex items-start gap-2">
                                                    <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-semibold text-red-700 block mb-1">Rejection Reason</span>
                                                        <p className="text-sm text-red-800">{appointment.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {appointment.status === 'APPROVED' && appointment.provider_notes && (
                                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-semibold text-green-700 block mb-1">Provider Notes</span>
                                                        <p className="text-sm text-green-800">{appointment.provider_notes}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {appointment.status === 'PENDING' && (
                                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                                <p className="text-sm text-yellow-800 flex items-center gap-2">
                                                    <AlertCircle size={16} />
                                                    Your appointment request is pending. The provider will review and notify you soon.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : !selectedProvider ? (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Available Service Providers ({providers.length})
                    </h2>
                    {providers.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-gray-600">
                                No approved service providers available at the moment. Please check back later.
                            </p>
                        </div>
                    ) : (
                        providers.map((provider) => (
                            <div key={provider.esanjeevani_provider_id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Stethoscope className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900">{provider.full_name}</h3>
                                            <p className="text-gray-600 mb-1">{provider.specialization}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{provider.provider_type}</span>
                                                {provider.years_of_experience && (
                                                    <span>{provider.years_of_experience} years experience</span>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    Available Slots: {getRandomSlots(provider.esanjeevani_provider_id)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProvider(provider)}
                                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setSelectedProvider(null);
                                setSelectedSlot('');
                                setSelectedDate('');
                                setError(null);
                                setSuccess(null);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                        >
                            ← Back to Providers
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Book Appointment with {selectedProvider.full_name}
                        </h2>
                        <p className="text-gray-600">{selectedProvider.specialization}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Select Time Slot
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                {timeSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            selectedSlot === slot
                                                ? 'bg-teal-600 text-white border-teal-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Video className="w-5 h-5 text-teal-600 mt-0.5" />
                                <div className="text-sm text-teal-800">
                                    <p className="font-medium mb-1">Video Consultation</p>
                                    <p>You will receive a video call link via SMS/Email before your appointment time.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedSlot || booking}
                            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {booking ? 'Booking...' : 'Confirm Appointment Request'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ESanjeevani;
