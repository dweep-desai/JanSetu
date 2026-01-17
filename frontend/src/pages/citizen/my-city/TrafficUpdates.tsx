import { useState, useEffect } from 'react';
import { Car, MapPin, Clock } from 'lucide-react';


interface TrafficZone {
    id: string;
    area: string;
    status: 'Low' | 'Medium' | 'High';
    details: string;
    delay: string;
}

const TrafficUpdates = () => {
    const [zones, setZones] = useState<TrafficZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [userLocation, setUserLocation] = useState<string | null>(null);

    useEffect(() => {
        const fetchTraffic = async (lat?: number, lng?: number) => {
            try {
                // Simulated API call with location
                // const data = await api.getTrafficUpdates(lat, lng); 

                // Mock Data for MVP
                setTimeout(() => {
                    const isLocal = !!lat || !!lng;
                    setZones([
                        { id: '1', area: isLocal ? 'Nearby Main Road' : 'City Center', status: 'High', details: 'Heavy congestion reported', delay: '+15 mins' },

                        { id: '2', area: isLocal ? 'Local Highway' : 'Highway NH-8', status: 'Low', details: 'Traffic moving smoothly', delay: 'On time' },
                        { id: '3', area: isLocal ? 'Nearby Market' : 'Industrial Area', status: 'Medium', details: 'Moderate traffic', delay: '+5 mins' },
                        { id: '4', area: isLocal ? 'Station Road' : 'Railway Station Road', status: 'High', details: 'Blocked due to procession', delay: '+20 mins' },
                        { id: '5', area: isLocal ? 'University Rd' : 'University Campus', status: 'Low', details: 'No delays reported', delay: 'On time' },
                    ]);
                    setLoading(false);
                }, 800);
            } catch (err) {
                console.error("Failed to load traffic data");
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    fetchTraffic(latitude, longitude);
                },
                () => {
                    fetchTraffic();
                }
            );
        } else {
            fetchTraffic();
        }
    }, []);

    const filteredZones = filter === 'All' ? zones : zones.filter(z => z.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
            <div className="max-w-3xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Car className="text-orange-600" /> Traffic Updates
                    </h1>
                    <p className="text-gray-600">
                        {userLocation ? `Real-time status near ${userLocation}` : 'Real-time city traffic status'}
                    </p>
                </header>


                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['All', 'High', 'Medium', 'Low'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border hover:bg-gray-50'
                                }`}
                        >
                            {f} Traffic
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredZones.map(zone => (
                            <div key={zone.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {zone.area}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(zone.status)}`}>
                                            {zone.status} Congestion
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{zone.details}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> Delay: <span className={zone.delay.includes('+') ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>{zone.delay}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrafficUpdates;
