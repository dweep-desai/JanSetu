import { useState } from 'react';
import { FileCheck, Search } from 'lucide-react';

interface Exam {
    id: string;
    name: string;
    category: string;
    registrationStart: string;
    registrationEnd: string;
    examDate: string;
    status: 'Open' | 'Closed' | 'Upcoming';
}

const NTA = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [exams] = useState<Exam[]>([
        { id: '1', name: 'JEE Main 2024', category: 'Engineering', registrationStart: '2024-01-01', registrationEnd: '2024-01-31', examDate: '2024-04-15', status: 'Open' },
        { id: '2', name: 'NEET 2024', category: 'Medical', registrationStart: '2024-02-01', registrationEnd: '2024-03-15', examDate: '2024-05-05', status: 'Open' },
        { id: '3', name: 'CUET 2024', category: 'University Entrance', registrationStart: '2024-02-15', registrationEnd: '2024-03-30', examDate: '2024-05-21', status: 'Open' },
        { id: '4', name: 'UGC NET 2024', category: 'Research', registrationStart: '2024-03-01', registrationEnd: '2024-03-31', examDate: '2024-06-15', status: 'Upcoming' },
    ]);

    const filteredExams = exams.filter(exam =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-red-100 text-red-700';
            case 'Upcoming': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">NTA - National Testing Agency</h1>
                <p className="text-gray-600">View and register for national level examinations</p>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    />
                </div>
            </div>

            {/* Exams List */}
            <div className="space-y-4">
                {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                        <div key={exam.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
                                        <FileCheck className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{exam.name}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                {exam.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{exam.category}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 mb-1">Registration Period</p>
                                                <p className="font-medium">
                                                    {new Date(exam.registrationStart).toLocaleDateString('en-IN')} - {new Date(exam.registrationEnd).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">Exam Date</p>
                                                <p className="font-medium">{new Date(exam.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                {exam.status === 'Open' && (
                                                    <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                                                        Register Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No exams found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NTA;
