import { useState } from 'react';
import { TrendingUp, TrendingDown, Search, Package, MapPin } from 'lucide-react';

interface SupplyData {
    id: string;
    product: string;
    category: string;
    quantity: string;
    price: number;
    location: string;
    supplier: string;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
}

const AgriSupplyExchange = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', 'Cereals', 'Vegetables', 'Fruits', 'Oilseeds', 'Pulses'];

    const [supplyData] = useState<SupplyData[]>([
        { id: '1', product: 'Wheat', category: 'Cereals', quantity: '5000 Quintals', price: 2100, location: 'Delhi', supplier: 'Farmers Cooperative', trend: 'up', lastUpdated: '2024-01-20' },
        { id: '2', product: 'Rice', category: 'Cereals', quantity: '3000 Quintals', price: 3200, location: 'Punjab', supplier: 'State Marketing Board', trend: 'stable', lastUpdated: '2024-01-20' },
        { id: '3', product: 'Tomato', category: 'Vegetables', quantity: '200 Tons', price: 40, location: 'Haryana', supplier: 'Farm Direct', trend: 'down', lastUpdated: '2024-01-20' },
        { id: '4', product: 'Potato', category: 'Vegetables', quantity: '1500 Tons', price: 25, location: 'UP', supplier: 'Agri Marketing Society', trend: 'up', lastUpdated: '2024-01-20' },
        { id: '5', product: 'Mustard', category: 'Oilseeds', quantity: '800 Quintals', price: 5200, location: 'Rajasthan', supplier: 'Oilseed Board', trend: 'stable', lastUpdated: '2024-01-20' },
        { id: '6', product: 'Cotton', category: 'Fibers', quantity: '1200 Bales', price: 6500, location: 'Gujarat', supplier: 'Cotton Corporation', trend: 'up', lastUpdated: '2024-01-20' },
    ]);

    const filteredData = supplyData.filter(item => {
        const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
            default: return <span className="w-4 h-4 flex items-center justify-center">—</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">National Agri Supply Exchange</h1>
                <p className="text-gray-600">Provide agri supply info to govt and citizens to avoid hoarding (transparency)</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products or locations..."
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

            {/* Supply Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Supplier</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">{item.product}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="font-bold text-gray-900">₹{item.price}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            {item.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.supplier}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getTrendIcon(item.trend)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgriSupplyExchange;
