import { useState } from 'react';
import { Phone, Mail, Send, MessageSquare, MapPin } from 'lucide-react';

const HelpAndSupport = () => {
    const [complaint, setComplaint] = useState('');
    const [category, setCategory] = useState('General');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setComplaint('');
                setCategory('General');
            }, 3000);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <MessageSquare className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
                    <p className="text-blue-100 max-w-xl">We are here to assist you. Submit your grievances or contact our support team directly.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Complaint Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Send className="w-5 h-5 text-blue-600" />
                                Submit a Complaint
                            </h2>
                        </div>

                        <div className="p-8">
                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <Send className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted!</h3>
                                    <p className="text-gray-500 max-w-md">
                                        Your reference ID is <span className="font-mono font-bold text-gray-800">#GRV-{Math.floor(Math.random() * 10000)}</span>.
                                        We will respond to your registered email within 24-48 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-700"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Technical Issue</option>
                                                <option>Service Delivery</option>
                                                <option>Payment/Refund</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
                                        <textarea
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-48 text-gray-700"
                                            placeholder="Please provide details about the issue you are facing..."
                                            value={complaint}
                                            onChange={(e) => setComplaint(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <p className="text-sm text-gray-500">
                                            * Our support team is available 24/7.
                                        </p>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                        >
                                            Submit Complaint
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="space-y-6">
                    {/* Quick Contact Cards */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Contact Us</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Helpline Number</p>
                                    <p className="text-xl font-bold text-gray-800">1800-200-3000</p>
                                    <p className="text-xs text-blue-600 mt-1">Toll Free, 24/7</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-white text-orange-600 rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Support Email</p>
                                    <p className="text-lg font-bold text-gray-800 break-all">support@jansetu.gov.in</p>
                                    <p className="text-xs text-orange-600 mt-1">Response in 24 hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Office Address (Optional addition for full page feel) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Central Office</h3>
                        <div className="flex gap-4">
                            <MapPin className="w-6 h-6 text-gray-400 shrink-0" />
                            <p className="text-gray-600 text-sm leading-relaxed">
                                JanSetu Bhavan,<br />
                                Block C, CGO Complex,<br />
                                Lodhi Road, New Delhi - 110003
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpAndSupport;
