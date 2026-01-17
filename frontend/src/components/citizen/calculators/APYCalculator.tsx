import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface APYCalculatorProps {
    onBack: () => void;
}

const APYCalculator: React.FC<APYCalculatorProps> = ({ onBack }) => {
    // State for inputs
    const [desiredPension, setDesiredPension] = useState(1000); // 1000 to 5000
    const [currentAge, setCurrentAge] = useState(20); // 18 to 39

    // Fixed Constants
    const INTEREST_RATE = 7.94;
    const RETIREMENT_AGE = 60;
    const CORPUS_FACTOR = 170000; // Corpus for 1000 pension is approx 1.7L

    // Calculation Logic
    const {
        monthlyContribution,
        totalInvestment,
        investmentDuration,
        maturityAmount,
        chartData
    } = useMemo(() => {
        const yearsToInvest = RETIREMENT_AGE - currentAge;
        const months = yearsToInvest * 12;
        const monthlyRate = INTEREST_RATE / 12 / 100;

        // Target Corpus logic: For 1000 pension -> 1.7L. Linearly scales.
        const targetCorpus = (desiredPension / 1000) * CORPUS_FACTOR;

        // Calculate Monthly Contribution using PMT formula:
        // PMT = FV * r / ((1 + r)^n - 1)
        // This ensures the math matches the "7.94%" return claim dynamically
        let contribution = 0;
        if (monthlyRate > 0 && months > 0) {
            contribution = (targetCorpus * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
        }

        // Data generation for Chart
        let accumulatedAmount = 0;
        let investedRunning = 0;
        const data = [];

        for (let year = 1; year <= yearsToInvest; year++) {
            for (let m = 1; m <= 12; m++) {
                accumulatedAmount = (accumulatedAmount + contribution) * (1 + monthlyRate);
                investedRunning += contribution;
            }
            data.push({
                year: `${currentAge + year}Yr`,
                investment: Math.round(investedRunning),
                value: Math.round(accumulatedAmount)
            });
        }

        return {
            monthlyContribution: contribution,
            totalInvestment: contribution * months,
            investmentDuration: yearsToInvest,
            maturityAmount: targetCorpus,
            chartData: data
        };

    }, [desiredPension, currentAge]);

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
                <h2 className="text-xl font-bold text-gray-800">Atal Pension Yojana (APY) Calculator</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts & Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Monthly Contribution</p>
                            <p className="text-xl font-bold text-gray-900">₹{monthlyContribution.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Invested</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Investment Duration</p>
                            <p className="text-xl font-bold text-gray-900">{investmentDuration} Years</p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">APY Growth Over Time</h3>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div> Total Investment
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div> Amount After Maturity
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValueAPY" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvAPY" x1="0" y1="0" x2="0" y2="1">
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
                                        tickFormatter={(value) => {
                                            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                                            return `₹${(value / 1000).toFixed(0)}K`;
                                        }}
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
                                        fill="url(#colorValueAPY)"
                                        name="Amount After Maturity"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investment"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorInvAPY)"
                                        name="Total Investment"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center flex-wrap gap-8 text-sm mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-1 bg-blue-500 border border-blue-600"></div>
                                <span className="text-gray-600">Total Investment: {formatCurrency(totalInvestment)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-1 bg-orange-400 border border-orange-500"></div>
                                <span className="text-gray-600">Amount After Maturity: {formatCurrency(maturityAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">

                    {/* Desired Monthly Pension */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Desired Monthly Pension</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{desiredPension}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="5000"
                            step="1000"
                            value={desiredPension}
                            onChange={(e) => setDesiredPension(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min ₹1000</span>
                            <span>Max ₹5000</span>
                        </div>
                    </div>

                    {/* Fixed Interest Rate */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Interest Rate (% p.a.)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={INTEREST_RATE}
                                readOnly
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-500 outline-none cursor-not-allowed"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                        </div>
                    </div>

                    {/* Joining Age */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Your Joining Age (Years)</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {currentAge}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="18"
                            max="39"
                            step="1"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min 18 Yr</span>
                            <span>Max 39 Yr</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APYCalculator;
