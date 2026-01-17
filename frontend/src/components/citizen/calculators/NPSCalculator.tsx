import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronLeft, Info } from 'lucide-react';

interface NPSCalculatorProps {
    onBack: () => void;
}

const NPSCalculator: React.FC<NPSCalculatorProps> = ({ onBack }) => {
    // State for inputs
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [interestRate] = useState(7.1);
    const [currentAge, setCurrentAge] = useState(25);
    const [annuityPercentage, setAnnuityPercentage] = useState(40);

    // Constants
    const RETIREMENT_AGE = 60;

    // Calculation Logic
    const { totalInvestment, maturityAmount, totalInterest, chartData } = useMemo(() => {
        const yearsToInvest = RETIREMENT_AGE - currentAge;
        const monthlyRate = interestRate / 12 / 100;

        let totalInv = 0;
        let corpus = 0;
        const data = [];

        // Generate year-wise data
        for (let year = 1; year <= yearsToInvest; year++) {
            // Calculate for this year (12 months)
            for (let m = 1; m <= 12; m++) {
                corpus = (corpus + monthlyInvestment) * (1 + monthlyRate);
                totalInv += monthlyInvestment;
            }

            data.push({
                year: `${currentAge + year}Yr`,
                investment: Math.round(totalInv),
                value: Math.round(corpus)
            });
        }

        return {
            totalInvestment: totalInv,
            maturityAmount: corpus,
            totalInterest: corpus - totalInv,
            chartData: data
        };

    }, [monthlyInvestment, interestRate, currentAge]);

    // Derived Values
    const annuityReinvested = maturityAmount * (annuityPercentage / 100);
    const lumpsumWithdrawn = maturityAmount - annuityReinvested;

    // Formatting Helper
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">National Pension Scheme (NPS) Calculator</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts & Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Maturity Value</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(maturityAmount)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Invested</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                            <p className="text-xl font-bold text-green-600">+{formatCurrency(totalInterest)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-600 mb-1 font-medium">Annuity Reinvested ({annuityPercentage}%)</p>
                            <p className="text-lg font-bold text-blue-900">{formatCurrency(annuityReinvested)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <p className="text-sm text-green-600 mb-1 font-medium">Lumpsum Withdrawn ({100 - annuityPercentage}%)</p>
                            <p className="text-lg font-bold text-green-900">{formatCurrency(lumpsumWithdrawn)}</p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">NPS Growth Over Time</h3>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div> Total Investment
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div> Maturity Value
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#fb923c"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        name="Maturity Value"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investment"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorInv)"
                                        name="Total Investment"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Monthly Investment</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{monthlyInvestment}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>₹500</span>
                            <span>₹1L</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Interest Rate (% p.a.)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={interestRate}
                                readOnly
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-500 outline-none cursor-not-allowed"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Your Age</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {currentAge} yrs
                            </div>
                        </div>
                        <input
                            type="range"
                            min="18"
                            max="59"
                            step="1"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>18 Yr</span>
                            <span>59 Yr</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Min. Annuity Investment</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {annuityPercentage}%
                            </div>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="100"
                            step="5"
                            value={annuityPercentage}
                            onChange={(e) => setAnnuityPercentage(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min 40%</span>
                            <span>Max 100%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed bg-yellow-50 p-2 rounded border border-yellow-100 flex items-start gap-2">
                            <Info className='w-4 h-4 shrink-0 text-yellow-600' />
                            For this NPS calculator, we assume your retirement age is 60 years.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NPSCalculator;
