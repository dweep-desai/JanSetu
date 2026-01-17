import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronLeft } from 'lucide-react';

interface EPFCalculatorProps {
    onBack: () => void;
}

const EPFCalculator: React.FC<EPFCalculatorProps> = ({ onBack }) => {
    // State for inputs
    const [basicSalary, setBasicSalary] = useState(50000);
    const [currentAge, setCurrentAge] = useState(25);
    const [currentBalance, setCurrentBalance] = useState(50000);
    const [contributionType, setContributionType] = useState<'1800' | '12%'>('12%');

    // Fixed Constants
    const INTEREST_RATE = 8.25;
    const RETIREMENT_AGE = 60; // Standard for calc

    // Calculation Logic
    const {
        maturityAmount,
        totalEmployeeContribution,
        totalEmployerContribution,
        totalEPSContribution,
        totalInterest,
        chartData
    } = useMemo(() => {
        const yearsToInvest = RETIREMENT_AGE - currentAge;
        const monthlyRate = INTEREST_RATE / 12 / 100;

        let accumulatedEPF = currentBalance;
        let accumulatedEPS = 0;
        let totalEmployee = 0;
        let totalEmployer = 0;

        const data = [];

        // Generate year-wise data
        for (let year = 1; year <= yearsToInvest; year++) {
            // Calculate for this year (12 months)
            for (let m = 1; m <= 12; m++) {
                // Determine Basis
                // If 1800 is selected, it effectively means capping calculation on 15000 basic
                // If 12% is selected, it uses actual basic salary

                let employeeShare = 0;
                let employerShareTotal = 0; // 12%

                if (contributionType === '1800') {
                    employeeShare = 1800;
                    employerShareTotal = 1800;
                } else {
                    employeeShare = basicSalary * 0.12;
                    employerShareTotal = basicSalary * 0.12;
                }

                // EPS Calculation: 8.33% of Basic, capped at 15000 wage ceiling
                // EPS basis is min(Basic, 15000) regardless of contribution type usually, 
                // BUT if '1800' restricted, it aligns.
                // Standard rule: EPS is on wage ceiling (15k).
                const epsBasis = Math.min(basicSalary, 15000);
                const epsShare = epsBasis * 0.0833;

                // Employer EPF is the remainder
                const employerEPFShare = employerShareTotal - epsShare;

                // Monthly Interest on EPF (Opening Balance + Monthly Contributions)
                // Interest is typically credited annually, but for compounding effect in standard calculators
                // it's often treated with monthly compounding or yearly accumulation. 
                // Let's use monthly compounding approximation for smooth graph/standard online calc matching.

                accumulatedEPF = (accumulatedEPF + employeeShare + employerEPFShare) * (1 + monthlyRate);
                accumulatedEPS += epsShare;

                totalEmployee += employeeShare;
                totalEmployer += employerEPFShare; // Only EPF part counts towards investment in graph usually? 
                // Or does "Total Employer Contribution" meaning EPF part? 
                // The image shows "Total Employer Contribution 2.31L" vs "Total Employee 7.56L".
                // 2.31 is much lower than 7.56. 
                // 3.67% vs 12% ratio is roughly 1:3. 2.31 * 3 = 6.93. Close.
                // So "Total Employer Contribution" here likely refers to the EPF part.
            }

            data.push({
                year: `${currentAge + year}Yr`,
                investment: Math.round(currentBalance + totalEmployee + totalEmployer), // Total Principal
                value: Math.round(accumulatedEPF)
            });
        }

        return {
            maturityAmount: accumulatedEPF,
            totalEmployeeContribution: totalEmployee,
            totalEmployerContribution: totalEmployer, // EPF Part
            totalEPSContribution: accumulatedEPS,
            totalInterest: accumulatedEPF - (currentBalance + totalEmployee + totalEmployer),
            chartData: data
        };

    }, [basicSalary, currentAge, currentBalance, contributionType]);

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
                <h2 className="text-xl font-bold text-gray-800">Employee Provident Fund (EPF) Calculator</h2>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts & Summary */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-1">
                            <p className="text-sm text-gray-500 mb-1">Maturity Value</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(maturityAmount)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Employee Contribution</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalEmployeeContribution)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Employer Contribution</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalEmployerContribution)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total EPS Contribution</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalEPSContribution)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">Total Interest</p>
                            <p className="text-lg font-bold text-green-600">+{formatCurrency(totalInterest)}</p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">EPF Growth Over Time</h3>
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
                                        <linearGradient id="colorValueEPF" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvEPF" x1="0" y1="0" x2="0" y2="1">
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
                                        fill="url(#colorValueEPF)"
                                        name="Maturity Value"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="investment"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorInvEPF)"
                                        name="Total Investment"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">

                    {/* Monthly Salary */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Monthly Basic Salary</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{basicSalary}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="5000"
                            max="1000000"
                            step="1000"
                            value={basicSalary}
                            onChange={(e) => setBasicSalary(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>₹5000</span>
                            <span>₹10L</span>
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

                    {/* Age */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Current Age (Years)</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                {currentAge}
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
                            <span>Min 18 Yr</span>
                            <span>Max 59 Yr</span>
                        </div>
                    </div>

                    {/* Current EPF Balance */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-700">Current EPF Balance</label>
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                                ₹{currentBalance}
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="5000"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Min ₹0</span>
                            <span>Max ₹10L</span>
                        </div>
                    </div>

                    {/* Contribution Radio */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-3">Employee's and employer's contribution</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contribution"
                                    value="1800"
                                    checked={contributionType === '1800'}
                                    onChange={() => setContributionType('1800')}
                                    className="w-5 h-5 text-blue-600 accent-blue-600"
                                />
                                <span className="text-gray-700 font-medium">₹1800</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="contribution"
                                    value="12%"
                                    checked={contributionType === '12%'}
                                    onChange={() => setContributionType('12%')}
                                    className="w-5 h-5 text-blue-600 accent-blue-600"
                                />
                                <span className="text-gray-700 font-medium">12% of the basic</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EPFCalculator;
