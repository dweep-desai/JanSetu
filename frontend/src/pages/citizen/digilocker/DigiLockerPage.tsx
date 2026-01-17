import { useState, useEffect } from 'react';
import {
    Search, ShieldCheck, FileText, Download, Share2,
    AlertTriangle, RefreshCw, CheckCircle2,

    Landmark, CreditCard, GraduationCap, Car, User
} from 'lucide-react';
import api from '../../../services/api';
// import { digiLockerServices } from '../../../services/serviceDefinitions';


interface Document {
    id: number;
    title: string;
    doc_type: string;
    issuer: string;
    issued_date: string;
    size: string;
}

const DigiLockerPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLinked, setIsLinked] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [digilockerIdInput, setDigilockerIdInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [fetchingDoc, setFetchingDoc] = useState<string | null>(null);

    useEffect(() => {
        fetchMyDocuments();
    }, []);

    const fetchMyDocuments = async () => {
        setLoading(true);
        try {
            const data = await api.getMyDocuments();
            setIsLinked(data.linked);
            setDocuments(data.documents || []);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkDigiLocker = async () => {
        try {
            await api.linkDigiLocker(digilockerIdInput);
            setShowLinkModal(false);
            fetchMyDocuments();
            setDigilockerIdInput('');
        } catch (error) {
            alert("Failed to link DigiLocker");
        }
    };

    const handleFetchDocument = async (docType: string, title: string) => {
        setFetchingDoc(docType);
        try {
            // Simulate fetch delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            await api.fetchDocument(docType, "Govt of India", {});
            await fetchMyDocuments();
            alert(`${title} fetched successfully!`);
        } catch (error: any) {
            if (error.response?.data?.status === 'exists') {
                alert("Document already exists in your locker.");
            } else {
                alert("Failed to fetch document");
            }
        } finally {
            setFetchingDoc(null);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const suggestedDocs = [
        { id: 'aadhaar', title: 'Aadhaar Card', icon: User },
        { id: 'pan', title: 'PAN Verification', icon: CreditCard },
        { id: 'driving_license', title: 'Driving License', icon: Car },
        { id: 'class_x', title: 'Class X Marksheet', icon: GraduationCap },
        { id: 'class_xii', title: 'Class XII Marksheet', icon: GraduationCap },
        { id: 'rc', title: 'Vehicle RC', icon: Car },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Search Bar */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your documents..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-8">

                {/* 2. Hero Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-indigo-200" />
                            DigiLocker Integration
                        </h1>
                        <p className="text-indigo-100 mb-4">
                            Access your authentic digital documents. Secure, verified, and legally valid under IT Act 2000.
                        </p>
                        {!isLinked && (
                            <button
                                onClick={() => setShowLinkModal(true)}
                                className="px-6 py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Link DigiLocker
                            </button>
                        )}
                    </div>
                    <div className="hidden md:block opacity-20 transform scale-150 translate-x-10 translate-y-10">
                        <ShieldCheck className="h-64 w-64" />
                    </div>
                </div>

                {/* 3. My Documents */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" /> My Documents
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : !isLinked ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-800">Account Not Linked</h3>
                            <p className="text-gray-600 mb-4">Please link your DigiLocker account to view your documents.</p>
                            <button
                                onClick={() => setShowLinkModal(true)}
                                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
                            >
                                Link Now
                            </button>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No documents found. Try fetching some below.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {filteredDocs.map((doc) => (
                                <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 line-clamp-1">{doc.title}</h3>
                                                <p className="text-xs text-gray-500">{doc.issuer}</p>
                                                <p className="text-xs text-gray-400 mt-1">{doc.issued_date} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Download">
                                                <Download className="h-5 w-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Share">
                                                <Share2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 4. Documents You Might Need */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Documents You Might Need</h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {suggestedDocs.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => handleFetchDocument(doc.id, doc.title)}
                                disabled={fetchingDoc === doc.id || !isLinked}
                                className="flex-shrink-0 w-32 flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group disabled:opacity-50"
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors relative">
                                    {fetchingDoc === doc.id ? (
                                        <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
                                    ) : (
                                        <doc.icon className="h-6 w-6 text-indigo-600" />
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-center text-gray-700 line-clamp-2">
                                    {doc.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 5. State Documents (Mock) */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">State Government Services</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Delhi', code: 'DL' },
                            { name: 'Maharashtra', code: 'MH' },
                            { name: 'Karnataka', code: 'KA' },
                            { name: 'Uttar Pradesh', code: 'UP' },
                            { name: 'Gujarat', code: 'GJ' },
                            { name: 'Rajasthan', code: 'RJ' }
                        ].map((state) => (
                            <div key={state.code} className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                                <div className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                    <Landmark className="h-5 w-5 text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{state.name}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                        View All (36) States
                    </button>
                </section>

            </div>

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Link DigiLocker Account</h3>
                        <p className="text-gray-600 text-sm mb-6">Enter your DigiLocker ID / Aadhaar / Mobile number to link your account.</p>

                        <input
                            type="text"
                            placeholder="Ex: 9876543210"
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                            autoFocus
                            value={digilockerIdInput}
                            onChange={(e) => setDigilockerIdInput(e.target.value)}
                        />

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="px-4 py-2 text-gray-600 title-font font-medium hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLinkDigiLocker}
                                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                            >
                                Link Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigiLockerPage;
