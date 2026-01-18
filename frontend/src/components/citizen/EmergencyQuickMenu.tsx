import { useNavigate } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';
import { emergencyServices, executeServiceAction } from '../../services/serviceDefinitions';

interface EmergencyQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const EmergencyQuickMenu: React.FC<EmergencyQuickMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleServiceClick = (service: typeof emergencyServices[0], event?: React.MouseEvent) => {
        // For call actions, don't prevent default to allow tel: links to work
        if (service.action.type !== 'call' && event) {
            event.preventDefault();
        }

        // Execute the service action
        executeServiceAction(service, { navigate, onClose });
    };

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
                    {emergencyServices.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <button
                                key={service.id}
                                onClick={(e) => handleServiceClick(service, e)}
                                className={`flex items-start p-4 text-left border rounded-xl transition-all duration-200 ${service.color} group`}
                            >
                                <div className="p-3 bg-white rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-8 h-8" style={{
                                        color: service.color.includes('orange') ? '#ea580c' :
                                            service.color.includes('pink') ? '#db2777' :
                                                service.color.includes('blue') ? '#2563eb' :
                                                    service.color.includes('red') ? '#dc2626' : '#6b7280'
                                    }} />
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
                        );
                    })}
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
