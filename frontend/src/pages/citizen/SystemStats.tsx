import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlatformStats from '../../components/citizen/PlatformStats';

const SystemStats = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Dashboard</h1>
                    <p className="text-slate-500 font-medium">Real-time overview of JanSetu's performance and reach</p>
                </div>
            </div>

            <PlatformStats />
        </div>
    );
};

export default SystemStats;
