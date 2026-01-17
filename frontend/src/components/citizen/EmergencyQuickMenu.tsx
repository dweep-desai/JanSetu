import { useNavigate } from 'react-router-dom';
import { Phone, ShieldAlert, Ambulance, MapPin, X } from 'lucide-react';
import '../../pages/citizen/CitizenDashboard.css';

interface EmergencyQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const EmergencyQuickMenu: React.FC<EmergencyQuickMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCall = (number: string) => {
        window.location.href = `tel:${number}`;
    };

    const options = [
        {
            title: "Call Childline",
            description: "For children in distress",
            icon: <Phone className="w-8 h-8 text-orange-600" />,
            action: () => handleCall('1098'),
            color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
        },
        {
            title: "Woman Helpline",
            description: "24/7 Support for women",
            icon: <ShieldAlert className="w-8 h-8 text-pink-600" />,
            action: () => handleCall('1091'),
            color: "bg-pink-50 hover:bg-pink-100 border-pink-200"
        },
        {
            title: "Locate Police Station",
            description: "Find nearest police station",
            icon: <MapPin className="w-8 h-8 text-blue-600" />,
            action: () => {
                onClose();
                navigate('/citizen/emergency/police-stations-near-me');
            },
            color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
        },
        {
            title: "Call Ambulance",
            description: "Emergency Medical Support",
            icon: <Ambulance className="w-8 h-8 text-red-600" />,
            action: () => { onClose(); navigate('/citizen/health/call-ambulance'); },
            color: "bg-red-50 hover:bg-red-100 border-red-200"
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
                <div className="bg-red-50 flex items-center justify-between p-6 border-b border-red-100">
                    <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6" /> Emergency Services
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-red-500" />
                    </button>
                </div>

                <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={option.action}
                            className={`flex items-start p-4 text-left border rounded-xl transition-all duration-200 ${option.color} group`}
                        >
                            <div className="p-3 bg-white rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                {option.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {option.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
                    <span>
                        <span className="font-semibold text-red-600">Note:</span> Services available 24/7
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-medium text-gray-600 hover:text-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyQuickMenu;
