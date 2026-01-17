import { useState } from 'react';
import { X, Calculator, Landmark, Briefcase, Building2 } from 'lucide-react';
import NPSCalculator from './calculators/NPSCalculator';
import EPFCalculator from './calculators/EPFCalculator';
import APYCalculator from './calculators/APYCalculator';
import PPFCalculator from './calculators/PPFCalculator';
import FDTDRCalculator from './calculators/FDTDRCalculator';

interface FinancialCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({ isOpen, onClose }) => {
    const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

    if (!isOpen) return null;

    if (activeCalculator === 'NPS') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="h-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <NPSCalculator onBack={() => setActiveCalculator(null)} />
                    </div>
                </div>
            </div>
        );
    }

    if (activeCalculator === 'EPF') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="h-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <EPFCalculator onBack={() => setActiveCalculator(null)} />
                    </div>
                </div>
            </div>
        );
    }

    if (activeCalculator === 'APY') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="h-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <APYCalculator onBack={() => setActiveCalculator(null)} />
                    </div>
                </div>
            </div>
        );
    }

    if (activeCalculator === 'PPF') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="h-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <PPFCalculator onBack={() => setActiveCalculator(null)} />
                    </div>
                </div>
            </div>
        );
    }

    if (activeCalculator === 'FDTDR') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="h-full relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <FDTDRCalculator onBack={() => setActiveCalculator(null)} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-blue-600" />
                        Financial Calculators
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Retirement Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Retirement
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                onClick={() => setActiveCalculator('NPS')}
                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group relative overflow-hidden"
                            >


                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-blue-700">NPS</h4>
                                        <p className="text-xs text-gray-500 mt-1">National Pension Scheme</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => setActiveCalculator('EPF')}
                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                                        <Building2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-green-700">EPF</h4>
                                        <p className="text-xs text-gray-500 mt-1">Employees' Provident Fund</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => setActiveCalculator('APY')}
                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-200 transition-colors">
                                        <Landmark className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-orange-700">APY</h4>
                                        <p className="text-xs text-gray-500 mt-1">Atal Pension Yojana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank & Post Office */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Landmark className="w-4 h-4" /> Bank & Post Office
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                onClick={() => setActiveCalculator('PPF')}
                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors">
                                        <Briefcase className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-indigo-700">PPF</h4>
                                        <p className="text-xs text-gray-500 mt-1">Public Provident Fund</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Bank
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div
                                onClick={() => setActiveCalculator('FDTDR')}
                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                                        <Landmark className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-purple-700">FD(TDR)</h4>
                                        <p className="text-xs text-gray-500 mt-1">Fixed Deposit (Term Deposit)</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialCalculatorModal;
