import React, { useState } from 'react';
import { Search, Calculator, Info } from 'lucide-react';
import api from '../../../services/api';

interface MSPData {
    id: string;
    crop: string;
    category: string;
    msp2023: number;
    msp2024: number;
    change: number;
    unit: string;
}

const CheckMSP = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [mspData, setMspData] = useState<MSPData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        fetchMSPData();
    }, []);

    const fetchMSPData = async () => {
        try {
            setLoading(true);
            const data = await api.getMSPData();
            if (data && Array.isArray(data)) {
                // Transform API data to MSPData format
                const transformed = data.map((item: any, index: number) => ({
                    id: item.id?.toString() || `msp-${index}`,
                    crop: item.commodity || item.crop || 'Unknown',
                    category: item.category || 'Cereals',
                    msp2023: parseFloat(item.msp_2023 || item.msp2023 || 0),
                    msp2024: parseFloat(item.msp_2024 || item.msp2024 || item.msp || 0),
                    change: parseFloat(item.change_percent || 0),
                    unit: item.unit || 'Quintal'
                }));
                setMspData(transformed);
            } else {
                // Fallback to default data if API structure is different
                setMspData([
                    { id: '1', crop: 'Paddy (Common)', category: 'Cereals', msp2023: 2040, msp2024: 2183, change: 7.0, unit: 'Quintal' },
                    { id: '2', crop: 'Wheat', category: 'Cereals', msp2023: 2125, msp2024: 2275, change: 7.1, unit: 'Quintal' },
                    { id: '3', crop: 'Jowar (Hybrid)', category: 'Cereals', msp2023: 2970, msp2024: 3179, change: 7.0, unit: 'Quintal' },
                    { id: '4', crop: 'Bajra', category: 'Cereals', msp2023: 2350, msp2024: 2500, change: 6.4, unit: 'Quintal' },
                    { id: '5', crop: 'Maize', category: 'Cereals', msp2023: 2090, msp2024: 2225, change: 6.5, unit: 'Quintal' },
                    { id: '6', crop: 'Ragi', category: 'Cereals', msp2023: 3578, msp2024: 3827, change: 7.0, unit: 'Quintal' },
                    { id: '7', crop: 'Tur (Arhar)', category: 'Pulses', msp2023: 7000, msp2024: 7000, change: 0.0, unit: 'Quintal' },
                    { id: '8', crop: 'Moong', category: 'Pulses', msp2023: 7755, msp2024: 8500, change: 9.6, unit: 'Quintal' },
                    { id: '9', crop: 'Urad', category: 'Pulses', msp2023: 6950, msp2024: 6950, change: 0.0, unit: 'Quintal' },
                    { id: '10', crop: 'Groundnut', category: 'Oilseeds', msp2023: 5850, msp2024: 6377, change: 9.0, unit: 'Quintal' },
                    { id: '11', crop: 'Sunflower Seed', category: 'Oilseeds', msp2023: 6760, msp2024: 6760, change: 0.0, unit: 'Quintal' },
                    { id: '12', crop: 'Soyabean', category: 'Oilseeds', msp2023: 4300, msp2024: 4600, change: 7.0, unit: 'Quintal' },
                    { id: '13', crop: 'Sesamum', category: 'Oilseeds', msp2023: 7830, msp2024: 8500, change: 8.6, unit: 'Quintal' },
                    { id: '14', crop: 'Cotton (Medium Staple)', category: 'Fibers', msp2023: 6080, msp2024: 6620, change: 8.9, unit: 'Quintal' },
                    { id: '15', crop: 'Cotton (Long Staple)', category: 'Fibers', msp2023: 6380, msp2024: 7020, change: 10.0, unit: 'Quintal' },
                ]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching MSP data:', err);
            setError('Failed to load MSP data. Showing default data.');
            // Set fallback data
            setMspData([
                { id: '1', crop: 'Paddy (Common)', category: 'Cereals', msp2023: 2040, msp2024: 2183, change: 7.0, unit: 'Quintal' },
                { id: '2', crop: 'Wheat', category: 'Cereals', msp2023: 2125, msp2024: 2275, change: 7.1, unit: 'Quintal' },
                { id: '3', crop: 'Jowar (Hybrid)', category: 'Cereals', msp2023: 2970, msp2024: 3179, change: 7.0, unit: 'Quintal' },
                { id: '4', crop: 'Bajra', category: 'Cereals', msp2023: 2350, msp2024: 2500, change: 6.4, unit: 'Quintal' },
                { id: '5', crop: 'Maize', category: 'Cereals', msp2023: 2090, msp2024: 2225, change: 6.5, unit: 'Quintal' },
                { id: '6', crop: 'Ragi', category: 'Cereals', msp2023: 3578, msp2024: 3827, change: 7.0, unit: 'Quintal' },
                { id: '7', crop: 'Tur (Arhar)', category: 'Pulses', msp2023: 7000, msp2024: 7000, change: 0.0, unit: 'Quintal' },
                { id: '8', crop: 'Moong', category: 'Pulses', msp2023: 7755, msp2024: 8500, change: 9.6, unit: 'Quintal' },
                { id: '9', crop: 'Urad', category: 'Pulses', msp2023: 6950, msp2024: 6950, change: 0.0, unit: 'Quintal' },
                { id: '10', crop: 'Groundnut', category: 'Oilseeds', msp2023: 5850, msp2024: 6377, change: 9.0, unit: 'Quintal' },
                { id: '11', crop: 'Sunflower Seed', category: 'Oilseeds', msp2023: 6760, msp2024: 6760, change: 0.0, unit: 'Quintal' },
                { id: '12', crop: 'Soyabean', category: 'Oilseeds', msp2023: 4300, msp2024: 4600, change: 7.0, unit: 'Quintal' },
                { id: '13', crop: 'Sesamum', category: 'Oilseeds', msp2023: 7830, msp2024: 8500, change: 8.6, unit: 'Quintal' },
                { id: '14', crop: 'Cotton (Medium Staple)', category: 'Fibers', msp2023: 6080, msp2024: 6620, change: 8.9, unit: 'Quintal' },
                { id: '15', crop: 'Cotton (Long Staple)', category: 'Fibers', msp2023: 6380, msp2024: 7020, change: 10.0, unit: 'Quintal' },
            ]);
            setLoading(false);
        }
    };

    const categories = ['all', 'Cereals', 'Pulses', 'Oilseeds', 'Fibers'];

    const filteredData = mspData.filter(item => {
        const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Minimum Support Price (MSP)</h1>
                <p className="text-gray-600">View current MSP rates for various crops</p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">About MSP</p>
                    <p>Minimum Support Price (MSP) is the price at which the government purchases crops from farmers. MSP is announced by the Government of India at the beginning of each sowing season.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search crops..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading MSP data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">{error}</p>
                </div>
            )}

            {/* MSP Table */}
            {!loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Crop</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">MSP 2023</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">MSP 2024</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Change %</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unit</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.crop}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                ₹{item.msp2023}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm font-bold text-gray-900">₹{item.msp2024}</div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${getChangeColor(item.change)}`}>
                                                {item.change > 0 ? '+' : ''}{item.change}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.unit}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No crops found matching your search.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckMSP;
