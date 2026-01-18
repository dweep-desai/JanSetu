import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { healthServices, executeServiceAction } from '../../services/serviceDefinitions';

interface HealthQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const HealthQuickMenu: React.FC<HealthQuickMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleServiceClick = (service: typeof healthServices[0]) => {
        executeServiceAction(service, { navigate, onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Health Services</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {healthServices
                        .filter(service => service.id !== 'e-sanjeevani' && service.id !== 'patient-health-report')
                        .map((service) => {
                            const IconComponent = service.icon;
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className={`flex items-start p-4 text-left border rounded-xl transition-all duration-200 ${service.color} group`}
                                >
                                    <div className="p-3 bg-white rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                        <IconComponent className="w-8 h-8" style={{
                                            color: service.color.includes('pink') ? '#db2777' :
                                                service.color.includes('blue') ? '#2563eb' :
                                                    service.color.includes('red') ? '#dc2626' :
                                                        service.color.includes('green') ? '#16a34a' : '#6b7280'
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

                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Close Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthQuickMenu;
