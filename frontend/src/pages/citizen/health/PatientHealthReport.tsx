import { useState } from 'react';
import { FileText, Download, Calendar, Activity, Heart, Stethoscope } from 'lucide-react';

interface HealthRecord {
    id: string;
    date: string;
    type: 'Lab Report' | 'Prescription' | 'Vaccination' | 'Checkup';
    doctor?: string;
    hospital?: string;
    description: string;
    fileUrl?: string;
}

const PatientHealthReport = () => {
    const [records] = useState<HealthRecord[]>([
        { id: '1', date: '2024-01-15', type: 'Lab Report', hospital: 'AIIMS Delhi', description: 'Complete Blood Count (CBC)', fileUrl: '#' },
        { id: '2', date: '2024-01-10', type: 'Prescription', doctor: 'Dr. Sharma', hospital: 'Apollo Hospital', description: 'General Checkup - Fever & Cold', fileUrl: '#' },
        { id: '3', date: '2023-12-20', type: 'Vaccination', hospital: 'Government Hospital', description: 'COVID-19 Booster Dose', fileUrl: '#' },
        { id: '4', date: '2023-12-05', type: 'Checkup', doctor: 'Dr. Patel', hospital: 'Max Hospital', description: 'Annual Health Checkup', fileUrl: '#' },
    ]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Lab Report': return <Activity className="w-5 h-5" />;
            case 'Prescription': return <FileText className="w-5 h-5" />;
            case 'Vaccination': return <Heart className="w-5 h-5" />;
            case 'Checkup': return <Stethoscope className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Lab Report': return 'bg-blue-100 text-blue-700';
            case 'Prescription': return 'bg-green-100 text-green-700';
            case 'Vaccination': return 'bg-purple-100 text-purple-700';
            case 'Checkup': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Health Report</h1>
                <p className="text-gray-600">View your health records and medical history</p>
            </div>

            <div className="space-y-4">
                {records.length > 0 ? (
                    records.map((record) => (
                        <div key={record.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(record.type)}`}>
                                        {getTypeIcon(record.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{record.type}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(record.type)}`}>
                                                {record.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{record.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            {record.doctor && (
                                                <div>
                                                    <span className="font-medium">Doctor:</span> {record.doctor}
                                                </div>
                                            )}
                                            {record.hospital && (
                                                <div>
                                                    <span className="font-medium">Hospital:</span> {record.hospital}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {record.fileUrl && (
                                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No health records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHealthReport;
