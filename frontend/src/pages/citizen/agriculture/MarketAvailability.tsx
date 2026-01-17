import { useState, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, TrendingUp } from 'lucide-react';
import api from '../../../services/api';

interface Product {
    id: string;
    name: string;
    category: string;
    market: string;
    price: number;
    unit: string;
    availability: 'High' | 'Medium' | 'Low';
    location: string;
}

const MarketAvailability = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            const data = await api.getMarketAvailability();
            if (data && Array.isArray(data) && data.length > 0) {
                // Transform API data to Product format
                const transformed = data.map((item: any, index: number) => ({
                    id: item.id?.toString() || `product-${index}`,
                    name: item.commodity || item.product || item.name || 'Unknown',
                    category: item.category || 'Cereals',
                    market: item.market || item.market_name || 'Unknown Market',
                    price: parseFloat(item.price || item.modal_price || 0),
                    unit: item.unit || 'Quintal',
                    availability: item.availability || (Math.random() > 0.5 ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
                    location: item.state || item.location || 'Unknown'
                }));
                setProducts(transformed);
            } else {
                // This shouldn't happen as API returns fallback, but just in case
                setProducts(getDefaultProducts());
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching market availability:', err);
            // API should return fallback data, but if it doesn't, use local fallback
            setProducts(getDefaultProducts());
            setLoading(false);
        }
    };

    const getDefaultProducts = (): Product[] => {
        return [
            { id: '1', name: 'Wheat', category: 'Cereals', market: 'Mandi Bhavan', price: 2100, unit: 'Quintal', availability: 'High', location: 'Delhi' },
            { id: '2', name: 'Rice', category: 'Cereals', market: 'Azadpur Mandi', price: 3200, unit: 'Quintal', availability: 'High', location: 'Delhi' },
            { id: '3', name: 'Tomato', category: 'Vegetables', market: 'Azadpur Mandi', price: 40, unit: 'Kg', availability: 'Medium', location: 'Delhi' },
            { id: '4', name: 'Potato', category: 'Vegetables', market: 'Mandi Bhavan', price: 25, unit: 'Kg', availability: 'High', location: 'Delhi' },
            { id: '5', name: 'Onion', category: 'Vegetables', market: 'Azadpur Mandi', price: 35, unit: 'Kg', availability: 'Low', location: 'Delhi' },
            { id: '6', name: 'Cotton', category: 'Fibers', market: 'Mandi Bhavan', price: 6500, unit: 'Quintal', availability: 'Medium', location: 'Delhi' },
            { id: '7', name: 'Sugarcane', category: 'Cash Crops', market: 'Azadpur Mandi', price: 280, unit: 'Quintal', availability: 'High', location: 'Delhi' },
            { id: '8', name: 'Mustard', category: 'Oilseeds', market: 'Mandi Bhavan', price: 5200, unit: 'Quintal', availability: 'High', location: 'Delhi' },
        ];
    };

    const categories = ['all', 'Cereals', 'Vegetables', 'Fruits', 'Oilseeds', 'Fibers', 'Cash Crops'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.market.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'High': return 'bg-green-100 text-green-700';
            case 'Medium': return 'bg-yellow-100 text-yellow-700';
            case 'Low': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Market Availability - Agriculture Products</h1>
                <p className="text-gray-600">Find where agricultural products are available in markets</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products or markets..."
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
                        <p className="text-gray-600">Loading market data...</p>
                    </div>
                </div>
            )}

            {/* Error State - Only show if there's a real error and no products */}
            {error && products.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800">{error}</p>
                </div>
            )}

            {/* Products List */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(product.availability)}`}>
                                    {product.availability}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{product.market}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{product.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
                                    <span className="text-sm text-gray-500">/{product.unit}</span>
                                </div>
                            </div>

                            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No products found matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarketAvailability;
