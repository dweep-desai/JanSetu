import { useState } from 'react';
import { FileText, MapPin, Send, CheckCircle } from 'lucide-react';


interface Complaint {
    id: string;
    category: string;
    description: string;
    status: 'Submitted' | 'In Progress' | 'Resolved';
    date: string;
}

const Complaints = () => {
    const [view, setView] = useState<'new' | 'history'>('new');
    const [formData, setFormData] = useState({ category: '', description: '', location: '' });
    const [submitted, setSubmitted] = useState(false);
    const [history, setHistory] = useState<Complaint[]>([
        { id: 'CMP-2024-001', category: 'Garbage', description: 'Uncollected garbage in Sector 4', status: 'Resolved', date: '2024-01-10' },
        { id: 'CMP-2024-002', category: 'Street Light', description: 'Light not wording on Main Rd', status: 'In Progress', date: '2024-01-15' },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API Submisson
        const newComplaint: Complaint = {
            id: `CMP-2024-${Math.floor(Math.random() * 1000)}`,
            category: formData.category,
            description: formData.description,
            status: 'Submitted',
            date: new Date().toISOString().split('T')[0]
        };

        setHistory([newComplaint, ...history]);
        setSubmitted(true);
        setFormData({ category: '', description: '', location: '' });

        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` }));
                },
                () => {
                    alert('Could not detect location. Please enter manually.');
                }

            );
        } else {
            alert('Geolocation not supported.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
            <div className="max-w-xl mx-auto">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-purple-600" /> Civic Complaints
                        </h1>
                        <p className="text-gray-600 text-sm">Report issues to local authorities</p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <button
                        onClick={() => setView('new')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'new' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        New Complaint
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'history' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My History
                    </button>
                </div>

                {view === 'new' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {submitted ? (
                            <div className="text-center py-10 animate-in zoom-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Complaint Submitted!</h3>
                                <p className="text-gray-600 mt-2">Thank you for being a responsible citizen.</p>
                                <button onClick={() => setView('history')} className="mt-6 text-purple-600 font-medium hover:underline">Track Status</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Category</label>
                                    <select
                                        required
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Garbage">Garbage / Sanitation</option>
                                        <option value="Street Light">Street Light</option>
                                        <option value="Water">Water Supply</option>
                                        <option value="Road">Road / Potholes</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        placeholder="Describe the issue in detail..."
                                        rows={4}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter landmark or address"
                                            className="w-full pl-10 pr-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            className="absolute right-3 top-2.5 p-1 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Use Current Location"
                                        >
                                            <MapPin className="w-5 h-5" />
                                        </button>
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                                >
                                    <Send className="w-5 h-5" /> Submit Complaint
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-400 block mb-1">{item.id} &bull; {item.date}</span>
                                        <h3 className="font-bold text-gray-900">{item.category}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
