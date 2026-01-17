import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface FDTDRCalculatorProps {
    onBack: () => void;
}

const FDTDRCalculator: React.FC<FDTDRCalculatorProps> = ({ onBack }) => {
    // State for inputs
    const [investmentAmount, setInvestmentAmount] = useState(50000);
    const [interestRate, setInterestRate] = useState(7.1);
    const [tenure, setTenure] = useState(3);

    // Calculation Logic
    const {
        maturityAmount,
        totalInterest,
        chartData
    } = useMemo(() => {
        // Compound Interest Formula: A = P(1 + r/n)^(nt)
        // FD TDR usually compounds quarterly (n=4) called "Cumulative FD" often, 
        // or pays out interest ("Non-Cumulative"). 
        // The image says "Calculate maturity and interest for non-cumulative FD" but then shows "Growth Over Time" with accumulation?
        // Actually, "Non-cumulative" means interest is paid out and NOT reinvested.
        // BUT the graph shows "Amount After Maturity" > "Total Investment" growing over time?
        // Wait, if it's non-cumulative, the corpus doesn't grow, you just get interest payouts.
        // However, the standard calculator "FD Calculator" usually implies finding the Maturity Value of a reinvestment plan (Cumulative) OR calculating total interest earned.
        // The image label "Calculate maturity and interest for non-cumulative FD" might be a slight misnomer in the mock/reference OR it implies calculating what the total return would be.
        // BUT, looking at the graph in the image: "Year-wise corpus accumulation". This curve looks compounded.
        // Linear growth = Simple Interest. Exponential/Curve = Compound Interest.
        // The graph curve is slightly exponential.
        // AND the note says "Interest is calculated on a quarterly basis".
        // This strongly suggests Cumulative FD logic (Compounded Quarterly) is what's expected for the calculator's "Maturity Value".
        // I will implement Quarterly Compounding.

        const P = investmentAmount;
        const R = interestRate;
        const n = 4; // Quarterly
        const t = tenure;

        // A = P * (1 + (R/100)/n)^(n*t)
        const totalMaturity = P * Math.pow(1 + (R / 100) / n, n * t);

        // Generate Chart Data
        const data = [];
        for (let year = 1; year <= t; year++) {
            // Value at end of year
            const valueAtYear = P * Math.pow(1 + (R / 100) / n, n * year);
            data.push({
                year: `${year}Yr`,
                investment: P,
                value: Math.round(valueAtYear)
            });
        }

        return {
            maturityAmount: totalMaturity,
            totalInterest: totalMaturity - P,
            chartData: data
        };

    }, [investmentAmount, interestRate, tenure]);

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
                <h2 className="text-xl font-bold text-gray-800">FD(TDR) Calculator</h2>
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
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(investmentAmount)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                            <p className="text-xl font-bold text-green-600">+{formatCurrency(totalInterest)}</p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">FD-TDR Growth Over Time</h3>
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
                                        <linearGradient id="colorValueFDTDR" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvFDTDR" x1="0" y1="0" x2="0" y2="1">
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
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
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
                                        fill="url(#colorValueFDTDR)"
                                        name="Maturity Value"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investment"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorInvFDTDR)"
                                        name="Total Investment"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">

                    {/* Investment Amount */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">I want to invest</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{investmentAmount}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="10000000"
                            step="500"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min ₹500</span>
                            <span>Max ₹1 Cr</span>
                        </div>
                    </div>

                    {/* Interest Rate (Slider!) */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Interest Rate (% p.a.)</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {interestRate}%
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min 1%</span>
                            <span>Max 15%</span>
                        </div>
                    </div>

                    {/* Tenure */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">For a period of (Years)</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {tenure} Yrs
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min 1 Yr</span>
                            <span>Max 50 Yr</span>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
                        Please Note: Interest is calculated on a quarterly basis.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FDTDRCalculator;
