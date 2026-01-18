import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from 'recharts';
import { Activity, Users, FileText, ArrowRight, Server, CheckCircle2 } from 'lucide-react';

const PlatformStats = () => {

    // Mock Data based on the user's image
    const servicesData = [
        { name: 'Jan', value: 5 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 26 },
        { name: 'Apr', value: 165 }, { name: 'May', value: 3 }, { name: 'Jun', value: 39 },
        { name: 'Jul', value: 0 }, { name: 'Aug', value: 21 }, { name: 'Sep', value: 3 },
        { name: 'Oct', value: 2 }, { name: 'Nov', value: 11 }
    ];

    const registrationsData = [
        { name: 'Jan', value: 0.21 }, { name: 'Feb', value: 0.17 }, { name: 'Mar', value: 0.19 },
        { name: 'Apr', value: 0.15 }, { name: 'May', value: 0.20 }, { name: 'Jun', value: 0.17 },
        { name: 'Jul', value: 0.24 }, { name: 'Aug', value: 0.33 }, { name: 'Sep', value: 0.36 },
        { name: 'Oct', value: 0.29 }, { name: 'Nov', value: 0.22 }
    ];

    const transactionsData = [
        { name: 'Jan', value: 12.31 }, { name: 'Feb', value: 11.28 }, { name: 'Mar', value: 10.81 },
        { name: 'Apr', value: 7.33 }, { name: 'May', value: 12.24 }, { name: 'Jun', value: 6.61 },
        { name: 'Jul', value: 13.82 }, { name: 'Aug', value: 15.99 }, { name: 'Sep', value: 17.32 },
        { name: 'Oct', value: 16.83 }, { name: 'Nov', value: 18.18 }
    ];

    const topDepartments = [
        { name: 'EPFO', value: 144.63, color: '#4338ca' }, // Indigo-700
        { name: 'GST Network', value: 3.59, color: '#0ea5e9' }, // Sky-500
        { name: 'ESIC', value: 2.84, color: '#0ea5e9' },
        { name: 'Indian Oil', value: 1.30, color: '#0ea5e9' },
        { name: 'My Aadhaar', value: 1.23, color: '#0ea5e9' },
        { name: 'Indian Railways', value: 1.14, color: '#0ea5e9' },
        { name: 'Mera Ration', value: 0.68, color: '#0ea5e9' },
        { name: 'Aadhaar', value: 0.48, color: '#0ea5e9' },
    ];

    const StatCard = ({ title, count, data, color, subColor, icon: Icon }: any) => (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">{count}</span>
                        {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            ▲ 12%
                        </span> */}
                    </div>
                </div>
                <div className={`p-2.5 rounded-xl ${subColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
            </div>

            {/* Sparkline Chart */}
            <div className="h-20 w-full -ml-2">
                <ResponsiveContainer width="105%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color.replace('text-', '').replace('-600', '')} stopOpacity={0.1} /> {/* Hacky for demo */}
                                <stop offset="95%" stopColor={color.replace('text-', '').replace('-600', '')} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={title === 'Services' ? '#0ea5e9' : title === 'Registrations' ? '#8b5cf6' : '#ec4899'} // Hardcoded colors for recharts
                            fill={title === 'Services' ? '#e0f2fe' : title === 'Registrations' ? '#f3e8ff' : '#fce7f3'}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Platform Performance</h2>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                    title="Services Delivered"
                    count="2,376"
                    data={servicesData}
                    color="text-sky-600"
                    subColor="bg-sky-50"
                    icon={FileText}
                />
                <StatCard
                    title="Registrations"
                    count="10.08 Cr"
                    data={registrationsData}
                    color="text-violet-600"
                    subColor="bg-violet-50"
                    icon={Users}
                />
                <StatCard
                    title="Transactions"
                    count="717.04 Cr"
                    data={transactionsData}
                    color="text-pink-600"
                    subColor="bg-pink-50"
                    icon={Activity}
                />
            </div>

            {/* Bottom Row: Charts & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Top Departments Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Top Departments by Transactions</h3>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topDepartments}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {topDepartments.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Health & Status */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-slate-400" />
                        System Health
                    </h3>

                    <div className="space-y-6 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">API Gateway</p>
                                    <p className="text-xs text-slate-500">Uptime: 99.99%</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Database Cluster</p>
                                    <p className="text-xs text-slate-500">Latency: 12ms</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">AI Inference Engine</p>
                                    <p className="text-xs text-slate-500">Groq: Operational</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Notification Service</p>
                                    <p className="text-xs text-slate-500">Queue: Empty</p>
                                </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                            <div className="bg-emerald-100 p-2 rounded-full">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-800">All Systems Operational</p>
                                <p className="text-xs text-emerald-600">Last updated: Just now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformStats;
