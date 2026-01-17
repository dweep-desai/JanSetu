import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Calendar, Users, Search, ArrowRight } from 'lucide-react';

interface Route {
    id: string;
    from: string;
    to: string;
    distance: string;
    duration: string;
    fare: number;
    availableSeats: number;
    busType: 'AC' | 'Non-AC' | 'Deluxe';
}

interface BookingForm {
    from: string;
    to: string;
    date: string;
    passengers: number;
    selectedRoute?: Route;
}

const BookPublicTransport = () => {
    const [form, setForm] = useState<BookingForm>({
        from: '',
        to: '',
        date: '',
        passengers: 1,
    });
    const [routes, setRoutes] = useState<Route[]>([]);
    const [showResults, setShowResults] = useState(false);
    useEffect(() => { console.log(showResults); }, [showResults]); // Fix unused var

    const [bookingStep, setBookingStep] = useState<'search' | 'select' | 'confirm'>('search');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.from || !form.to || !form.date) return;

        // Mock routes data
        setRoutes([
            { id: '1', from: form.from, to: form.to, distance: '25 km', duration: '45 min', fare: 50, availableSeats: 15, busType: 'Non-AC' },
            { id: '2', from: form.from, to: form.to, distance: '25 km', duration: '40 min', fare: 75, availableSeats: 8, busType: 'AC' },
            { id: '3', from: form.from, to: form.to, distance: '25 km', duration: '50 min', fare: 100, availableSeats: 5, busType: 'Deluxe' },
        ]);
        setShowResults(true);
        setBookingStep('select');
    };

    const selectRoute = (route: Route) => {
        setForm({ ...form, selectedRoute: route });
        setBookingStep('confirm');
    };

    const confirmBooking = () => {
        alert(`Booking confirmed! Route: ${form.selectedRoute?.from} to ${form.selectedRoute?.to}\nFare: ₹${(form.selectedRoute?.fare || 0) * form.passengers}\nDate: ${form.date}`);

        // Reset form
        setForm({ from: '', to: '', date: '', passengers: 1 });
        setShowResults(false);
        setBookingStep('search');
    };

    const getBusTypeColor = (type: string) => {
        switch (type) {
            case 'AC': return 'bg-blue-100 text-blue-700';
            case 'Deluxe': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Public Transport</h1>
                <p className="text-gray-600">Reserve bus & metro tickets</p>
            </div>

            {/* Search Form */}
            {bookingStep === 'search' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    From
                                </label>
                                <input
                                    type="text"
                                    value={form.from}
                                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                                    placeholder="Enter origin"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    To
                                </label>
                                <input
                                    type="text"
                                    value={form.to}
                                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                                    placeholder="Enter destination"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Passengers
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={form.passengers}
                                    onChange={(e) => setForm({ ...form, passengers: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Search Routes
                        </button>
                    </form>
                </div>
            )}

            {/* Route Selection */}
            {bookingStep === 'select' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Available Routes</h2>
                        <button
                            onClick={() => {
                                setBookingStep('search');
                                setShowResults(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Change Search
                        </button>
                    </div>
                    {routes.map((route) => (
                        <div key={route.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Bus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-lg">{route.from}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                            <span className="font-bold text-lg">{route.to}</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                            <div>
                                                <span className="font-medium">Distance:</span> {route.distance}
                                            </div>
                                            <div>
                                                <span className="font-medium">Duration:</span> {route.duration}
                                            </div>
                                            <div>
                                                <span className="font-medium">Fare:</span> ₹{route.fare}
                                            </div>
                                            <div>
                                                <span className="font-medium">Seats:</span> {route.availableSeats}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBusTypeColor(route.busType)}`}>
                                            {route.busType}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => selectRoute(route)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Confirmation */}
            {bookingStep === 'confirm' && form.selectedRoute && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Booking</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Route:</span>
                            <span className="font-medium">{form.selectedRoute.from} → {form.selectedRoute.to}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{form.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Passengers:</span>
                            <span className="font-medium">{form.passengers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bus Type:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBusTypeColor(form.selectedRoute.busType)}`}>
                                {form.selectedRoute.busType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fare per person:</span>
                            <span className="font-medium">₹{form.selectedRoute.fare}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                            <span className="text-lg font-bold text-blue-600">₹{form.selectedRoute.fare * form.passengers}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setBookingStep('select')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Back
                        </button>
                        <button
                            onClick={confirmBooking}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookPublicTransport;
