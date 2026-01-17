import { useState } from 'react';
import { Droplet, MapPin, Phone, Search, Activity } from 'lucide-react';

interface BloodBank {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: string;
    availableGroups: string[];
    stockStatus: 'Available' | 'Low' | 'Critical';
}

const BloodBank = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('all');

    const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const [bloodBanks] = useState<BloodBank[]>([
        { id: '1', name: 'AIIMS Blood Bank', address: 'AIIMS Campus, New Delhi', phone: '011-26588500', distance: '2.5 km', availableGroups: ['A+', 'B+', 'O+', 'AB+'], stockStatus: 'Available' },
        { id: '2', name: 'Red Cross Blood Bank', address: 'Red Cross Building, Connaught Place', phone: '011-23345678', distance: '1.8 km', availableGroups: ['A+', 'A-', 'B+', 'O+', 'O-'], stockStatus: 'Available' },
        { id: '3', name: 'Apollo Blood Bank', address: 'Apollo Hospital, Sarita Vihar', phone: '011-26825678', distance: '5.2 km', availableGroups: ['B+', 'AB+', 'O+'], stockStatus: 'Low' },
        { id: '4', name: 'Government Blood Bank', address: 'Safdarjung Hospital, New Delhi', phone: '011-26165000', distance: '3.1 km', availableGroups: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'], stockStatus: 'Available' },
    ]);

    const filteredBanks = bloodBanks.filter(bank => {
        const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bank.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = selectedGroup === 'all' || bank.availableGroups.includes(selectedGroup);
        return matchesSearch && matchesGroup;
    });

    const getStockColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700';
            case 'Low': return 'bg-yellow-100 text-yellow-700';
            case 'Critical': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Bank</h1>
                <p className="text-gray-600">Find blood availability and nearby blood banks</p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search blood banks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    >
                        {bloodGroups.map(group => (
                            <option key={group} value={group}>
                                {group === 'all' ? 'All Blood Groups' : `Blood Group ${group}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Blood Banks List */}
            <div className="space-y-4">
                {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                        <div key={bank.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Droplet className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{bank.name}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(bank.stockStatus)}`}>
                                                {bank.stockStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{bank.address}</span>
                                        </div>
                                        <p className="text-sm text-green-600 font-medium mb-3">{bank.distance} away</p>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Available Blood Groups:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {bank.availableGroups.map((group, idx) => (
                                                    <span key={idx} className={`px-3 py-1 rounded text-xs font-medium ${selectedGroup === group ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'
                                                        }`}>
                                                        {group}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <a
                                    href={`tel:${bank.phone}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call
                                </a>
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                                    <Activity className="w-4 h-4" />
                                    Request Blood
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No blood banks found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodBank;
