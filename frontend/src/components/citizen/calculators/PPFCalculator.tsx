import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface PPFCalculatorProps {
    onBack: () => void;
}

const PPFCalculator: React.FC<PPFCalculatorProps> = ({ onBack }) => {
    // State for inputs
    const [investmentFrequency, setInvestmentFrequency] = useState<'yearly' | 'monthly'>('yearly');
    const [investmentAmount, setInvestmentAmount] = useState(50000); // Shared state, value depends on freq
    const [tenure, setTenure] = useState(15);

    // Fixed Constants
    const INTEREST_RATE = 7.1;

    // Calculation Logic
    const {
        maturityAmount,
        totalInvestment,
        totalInterest,
        chartData
    } = useMemo(() => {
        const annualRate = INTEREST_RATE / 100;
        let balance = 0;
        let investedRunning = 0;
        const data = [];

        // Reset investment amount if switching modes causes out of bounds (handled in UI usually, but internal safety)
        // If monthly, max is usually 1.5L/12 ~ 12500 per month theoretically for tax, but calculator might allow more.
        // Image shows Min 500, Max 150000 for Yearly.
        // Let's assume limits:
        // Yearly: 500 - 1,50,000
        // Monthly: 500 - 12,500 (since 12.5k * 12 = 1.5L)? 
        // Or just let user put whatever? The image shows Max 150000 for Yearly Investment.

        for (let year = 1; year <= tenure; year++) {
            let interestForYear = 0;
            let investmentForYear = 0;

            if (investmentFrequency === 'yearly') {
                // Assuming deposited at start of year (April 1-5) to maximize interest, standard for calc
                investmentForYear = investmentAmount;
                // Interest on opening balance + current investment for the whole year
                // I = (Balance + Inv) * r
                interestForYear = (balance + investmentForYear) * annualRate;
                balance += investmentForYear + interestForYear;
                investedRunning += investmentForYear;
            } else {
                // Monthly
                // Deposit every month.
                // Balance grows monthly.
                // Interest calculated on lowest balance of month (effectively opening balance of month + deposit if before 5th)
                // We assume deposit before 5th.
                // Month 1: Bal + Inv. Int calc on (Bal + Inv) * r/12 ?
                // PPF Rule: Interest calculated monthly, credited annually.

                investmentForYear = investmentAmount * 12;

                // Let's sim 12 months
                let currentYearInterestAccumulation = 0;
                let monthlyBalance = balance;

                for (let m = 1; m <= 12; m++) {
                    monthlyBalance += investmentAmount;
                    // Interest for this month
                    currentYearInterestAccumulation += monthlyBalance * (annualRate / 12);
                }

                // End of year credit
                balance = monthlyBalance + currentYearInterestAccumulation;
                investedRunning += investmentForYear;
            }

            data.push({
                year: `${year}Yr`,
                investment: Math.round(investedRunning),
                value: Math.round(balance)
            });
        }

        return {
            maturityAmount: balance,
            totalInvestment: investedRunning,
            totalInterest: balance - investedRunning,
            chartData: data
        };

    }, [investmentAmount, tenure, investmentFrequency]);

    // Update handlers to clamp values when switching modes?
    // Not strictly necessary if sliders adjust range dynamically.

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
                <h2 className="text-xl font-bold text-gray-800">Public Provident Fund (PPF) Calculator</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts & Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">PPF Growth Over Time</h3>
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
                                        <linearGradient id="colorValuePPF" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvPPF" x1="0" y1="0" x2="0" y2="1">
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
                                        fill="url(#colorValuePPF)"
                                        name="Maturity Value"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investment"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorInvPPF)"
                                        name="Total Investment"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">

                    {/* Toggle */}
                    <div className="bg-gray-100 p-1 rounded-xl flex">
                        <button
                            onClick={() => {
                                setInvestmentFrequency('yearly');
                                setInvestmentAmount(Math.min(investmentAmount, 150000));
                            }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${investmentFrequency === 'yearly' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Yearly
                        </button>
                        <button
                            onClick={() => {
                                setInvestmentFrequency('monthly');
                                setInvestmentAmount(Math.min(investmentAmount, 12500));
                            }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${investmentFrequency === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Monthly
                        </button>
                    </div>

                    {/* Investment Amount */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                {investmentFrequency === 'yearly' ? 'Yearly' : 'Monthly'} Investment
                            </label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{investmentAmount}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max={investmentFrequency === 'yearly' ? 150000 : 12500}
                            step="500"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>₹500</span>
                            <span>₹{investmentFrequency === 'yearly' ? '1.5L' : '12.5K'}</span>
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
                        <p className="text-xs text-green-600 font-medium mt-2">Fixed Interest</p>
                    </div>

                    {/* Tenure */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Tenure (Years)</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {tenure} Yrs
                            </div>
                        </div>
                        <input
                            type="range"
                            min="15"
                            max="50"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min 15 Yr</span>
                            <span>Max 50 Yr</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PPFCalculator;
