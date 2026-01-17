import { X, Calculator, Landmark, Briefcase, Building2 } from 'lucide-react';

interface FinancialCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const sections = [
        {
            title: "Retirement",
            items: [
                {
                    title: "National Pension Scheme",
                    desc: "Know the investment amount to achieve your dream retirement",
                    icon: <Briefcase className="w-6 h-6 text-pink-600" />,
                    iconBg: "bg-pink-100",
                    isNew: true
                },
                {
                    title: "Employee Provident Fund",
                    desc: "Know your total EPF amount when you retire",
                    icon: <Briefcase className="w-6 h-6 text-pink-600" />,
                    iconBg: "bg-pink-100",
                    isNew: true
                },
                {
                    title: "Atal Pension Yojana",
                    desc: "Calculate your monthly investments under Atal Pension Yojana",
                    icon: <Briefcase className="w-6 h-6 text-pink-600" />,
                    iconBg: "bg-pink-100",
                    isNew: true
                }
            ]
        },
        {
            title: "Bank & Post Office",
            items: [
                {
                    title: "Public Provident Fund",
                    desc: "Calculate the returns on your PPF investments online",
                    icon: <Landmark className="w-6 h-6 text-purple-600" />,
                    iconBg: "bg-purple-100",
                    isNew: true
                }
            ]
        },
        {
            title: "Bank",
            items: [
                {
                    title: "Fixed Deposit- TDR(Interest Payout)",
                    desc: "Calculate maturity and interest for non-cumulative FD",
                    icon: <Building2 className="w-6 h-6 text-cyan-600" />,
                    iconBg: "bg-cyan-100",
                    isNew: true
                },
                {
                    title: "Fixed Deposit-STDR(Cumulative)",
                    desc: "Calculate maturity and interest for cumulative FD.",
                    icon: <Building2 className="w-6 h-6 text-cyan-600" />,
                    iconBg: "bg-cyan-100",
                    isNew: true
                }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                        <Calculator className="w-8 h-8 text-blue-600" />
                        Financial Calculators
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
                    <div className="space-y-10">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">{section.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.items.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            {item.isNew && (
                                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                                    NEW
                                                </div>
                                            )}

                                            <div className={`w-14 h-14 rounded-full ${item.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                {item.icon}
                                            </div>

                                            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h4>

                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialCalculatorModal;
