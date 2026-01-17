
import React from 'react';
import { Bus, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicTransport = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-orange-50 p-6 animate-in fade-in duration-500">
            <div className="max-w-md mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-orange-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left text-orange-700"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
                        <Bus className="w-8 h-8" /> Public Transport
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bus className="w-10 h-10 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Book Your Journey</h2>
                        <p className="text-gray-500 text-sm">Select your mode of transport and destination</p>
                    </div>

                    {/* Inputs Placeholder */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <MapPin className="w-5 h-5 text-orange-400" />
                                <input type="text" placeholder="Current Location" className="bg-transparent w-full outline-none text-gray-700 font-medium" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase">To</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <MapPin className="w-5 h-5 text-orange-600" />
                                <input type="text" placeholder="Enter Destination" className="bg-transparent w-full outline-none text-gray-700 font-medium" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700 font-medium">Today</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Time</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700 font-medium">Now</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-200 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Find Transport
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PublicTransport;
