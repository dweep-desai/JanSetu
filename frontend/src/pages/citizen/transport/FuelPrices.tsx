import { useState, useEffect } from 'react';
import { Fuel, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api from '../../../services/api';

interface FuelPrice {
    id: string;
    fuelType: string;
    price: number;
    change: number;
    changePercent: number;
    lastUpdated: string;
}

const FuelPrices = () => {
    const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFuelPrices();
    }, []);

    const fetchFuelPrices = async () => {
        try {
            setLoading(true);
            const data = await api.getFuelPrices();
            if (data && Array.isArray(data) && data.length > 0) {
                // Transform API data to FuelPrice format
                const transformed = data.map((item: any, index: number) => ({
                    id: item.id?.toString() || `fuel-${index}`,
                    fuelType: item.fuel_type || item.fuelType || item.name || 'Unknown',
                    price: parseFloat(item.price || item.rate || 0),
                    change: parseFloat(item.change || item.price_change || 0),
                    changePercent: parseFloat(item.change_percent || item.price_change_percent || 0),
                    lastUpdated: item.date || item.last_updated || new Date().toISOString().split('T')[0]
                }));
                setFuelPrices(transformed);
            } else {
                // Fallback data
                setFuelPrices([
                    { id: '1', fuelType: 'Petrol', price: 96.72, change: 0.15, changePercent: 0.16, lastUpdated: new Date().toISOString().split('T')[0] },
                    { id: '2', fuelType: 'Diesel', price: 89.62, change: -0.10, changePercent: -0.11, lastUpdated: new Date().toISOString().split('T')[0] },
                    { id: '3', fuelType: 'CNG', price: 73.59, change: 0.25, changePercent: 0.34, lastUpdated: new Date().toISOString().split('T')[0] },
                    { id: '4', fuelType: 'LPG (14.2 kg)', price: 903.00, change: 0, changePercent: 0, lastUpdated: new Date().toISOString().split('T')[0] },
                ]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching fuel prices:', err);
            setError('Failed to load fuel prices. Showing default data.');
            // Set fallback data
            setFuelPrices([
                { id: '1', fuelType: 'Petrol', price: 96.72, change: 0.15, changePercent: 0.16, lastUpdated: new Date().toISOString().split('T')[0] },
                { id: '2', fuelType: 'Diesel', price: 89.62, change: -0.10, changePercent: -0.11, lastUpdated: new Date().toISOString().split('T')[0] },
                { id: '3', fuelType: 'CNG', price: 73.59, change: 0.25, changePercent: 0.34, lastUpdated: new Date().toISOString().split('T')[0] },
                { id: '4', fuelType: 'LPG (14.2 kg)', price: 903.00, change: 0, changePercent: 0, lastUpdated: new Date().toISOString().split('T')[0] },
            ]);
            setLoading(false);
        }
    };

    const getChangeIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="w-4 h-4" />;
        if (change < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-red-600';
        if (change < 0) return 'text-green-600';
        return 'text-gray-600';
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Today's Fuel Prices</h1>
                <p className="text-gray-600">Current fuel rates in Delhi (per liter/kg)</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading fuel prices...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">{error}</p>
                </div>
            )}

            {/* Fuel Prices Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fuelPrices.map((fuel) => (
                    <div key={fuel.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <Fuel className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{fuel.fuelType}</h3>
                                    <p className="text-xs text-gray-500">Updated: {new Date(fuel.lastUpdated).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-bold text-gray-900">₹{fuel.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500 mt-1">per {fuel.fuelType.includes('LPG') ? 'cylinder' : 'liter'}</p>
                            </div>
                            <div className={`flex items-center gap-1 ${getChangeColor(fuel.change)}`}>
                                {getChangeIcon(fuel.change)}
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {fuel.change > 0 ? '+' : ''}₹{Math.abs(fuel.change).toFixed(2)}
                                    </p>
                                    <p className="text-xs">
                                        ({fuel.changePercent > 0 ? '+' : ''}{fuel.changePercent.toFixed(2)}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Fuel prices are updated daily and may vary by location. 
                    Prices shown are indicative for Delhi region.
                </p>
            </div>
        </div>
    );
};

export default FuelPrices;
