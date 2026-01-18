import { useNavigate } from 'react-router-dom';
import { Bus, X } from 'lucide-react';
import { transportUtilityServices } from '../../services/serviceDefinitions';

interface TransportQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const TransportQuickMenu: React.FC<TransportQuickMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAction = (service: any) => {
        if (service.action.type === 'navigate' && service.action.handler) {
            service.action.handler({ navigate, onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
                <div className="bg-orange-50 flex items-center justify-between p-6 border-b border-orange-100">
                    <h2 className="text-2xl font-bold text-orange-700 flex items-center gap-2">
                        <Bus className="w-6 h-6" /> Transport Services
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-orange-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-orange-500" />
                    </button>
                </div>

                <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {transportUtilityServices.map((service, index) => (
                        <button
                            key={index}
                            onClick={() => handleAction(service)}
                            className={`flex items-start p-4 text-left border rounded-xl transition-all duration-200 ${service.color} group`}
                        >
                            <div className="p-3 bg-white rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                <service.icon className={`w-8 h-8 ${service.category === 'travel' ? 'text-green-600' : 'text-orange-600'}`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {service.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-500">
                    <span>
                        <span className="font-semibold text-orange-600">Explore:</span> Public Transport & Fuel
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

export default TransportQuickMenu;
