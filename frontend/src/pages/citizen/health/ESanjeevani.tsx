import { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Stethoscope } from 'lucide-react';
import api from '../../../services/api';

interface Provider {
    esanjeevani_provider_id: string;
    service_provider_id: string;
    full_name: string;
    specialization: string;
    provider_type: string;
    years_of_experience: number | null;
    rating: number | null;
    available_slots: number | null;
    phone: string | null;
}

const ESanjeevani = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">e-Sanjeevani</h1>
                <p className="text-gray-600">Telemedicine services - Consult doctors online</p>
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

            {!selectedProvider ? (
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
                                                {provider.rating && (
                                                    <span className="flex items-center gap-1">
                                                        ⭐ {provider.rating.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                            {provider.available_slots && provider.available_slots > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                                        Available Slots: {provider.available_slots}
                                                    </p>
                                                </div>
                                            )}
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
