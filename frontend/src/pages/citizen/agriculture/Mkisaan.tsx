import { useState } from 'react';
import { ShoppingCart, User, Search, MapPin, Phone } from 'lucide-react';

interface Listing {
    id: string;
    type: 'buy' | 'sell';
    product: string;
    category: string;
    quantity: string;
    price: number;
    location: string;
    seller: string;
    phone?: string;
    postedDate: string;
}

const Mkisaan = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'buy' | 'sell'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', 'Cereals', 'Vegetables', 'Fruits', 'Oilseeds', 'Pulses', 'Livestock'];

    const [listings] = useState<Listing[]>([
        { id: '1', type: 'sell', product: 'Wheat', category: 'Cereals', quantity: '100 Quintals', price: 2100, location: 'Delhi', seller: 'Rajesh Kumar', phone: '9876543210', postedDate: '2024-01-19' },
        { id: '2', type: 'buy', product: 'Rice', category: 'Cereals', quantity: '50 Quintals', price: 3200, location: 'Punjab', seller: 'Amit Singh', phone: '9876543211', postedDate: '2024-01-18' },
        { id: '3', type: 'sell', product: 'Tomato', category: 'Vegetables', quantity: '5 Tons', price: 40, location: 'Haryana', seller: 'Priya Sharma', phone: '9876543212', postedDate: '2024-01-20' },
        { id: '4', type: 'buy', product: 'Potato', category: 'Vegetables', quantity: '10 Tons', price: 25, location: 'UP', seller: 'Mohit Verma', phone: '9876543213', postedDate: '2024-01-17' },
        { id: '5', type: 'sell', product: 'Mustard', category: 'Oilseeds', quantity: '20 Quintals', price: 5200, location: 'Rajasthan', seller: 'Sunil Patel', phone: '9876543214', postedDate: '2024-01-19' },
    ]);

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || listing.type === selectedType;
        const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
        return matchesSearch && matchesType && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mkisaan - Buyer and Seller Platform</h1>
                <p className="text-gray-600">Connect farmers with buyers</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as 'all' | 'buy' | 'sell')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="buy">Want to Buy</option>
                        <option value="sell">Want to Sell</option>
                    </select>
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

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                        <div key={listing.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${listing.type === 'sell' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {listing.type === 'sell' ? 'For Sale' : 'Want to Buy'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(listing.postedDate).toLocaleDateString()}</span>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2">{listing.product}</h3>
                            <p className="text-sm text-gray-500 mb-3">{listing.category}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Quantity: <span className="font-medium">{listing.quantity}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-bold text-lg text-gray-900">₹{listing.price}</span>
                                    <span className="text-gray-500">per unit</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{listing.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{listing.seller}</span>
                                </div>
                            </div>

                            {listing.phone && (
                                <a
                                    href={`tel:${listing.phone}`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    <Phone className="w-4 h-4" />
                                    Contact Seller
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No listings found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mkisaan;
