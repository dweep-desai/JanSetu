import { useState } from 'react';
import { School, Search } from 'lucide-react';

interface Institution {
    id: string;
    name: string;
    type: string;
    location: string;
    status: 'Approved' | 'Pending';
    programs: string[];
}

const AICTE = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [institutions] = useState<Institution[]>([
        { id: '1', name: 'IIT Delhi', type: 'Engineering', location: 'New Delhi', status: 'Approved', programs: ['B.Tech', 'M.Tech', 'PhD'] },
        { id: '2', name: 'NIT Delhi', type: 'Engineering', location: 'New Delhi', status: 'Approved', programs: ['B.Tech', 'M.Tech'] },
        { id: '3', name: 'DTU', type: 'Engineering', location: 'New Delhi', status: 'Approved', programs: ['B.Tech', 'M.Tech', 'MBA'] },
        { id: '4', name: 'NSIT', type: 'Engineering', location: 'New Delhi', status: 'Approved', programs: ['B.Tech', 'M.Tech'] },
    ]);

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AICTE - All India Council for Technical Education</h1>
                <p className="text-gray-600">Find AICTE approved institutions and programs</p>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search institutions or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>
            </div>

            {/* Institutions List */}
            <div className="space-y-4">
                {filteredInstitutions.length > 0 ? (
                    filteredInstitutions.map((institution) => (
                        <div key={institution.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                        <School className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{institution.name}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${institution.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {institution.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{institution.type} • {institution.location}</p>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">Programs Offered:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {institution.programs.map((program, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                                                        {program}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No institutions found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICTE;
