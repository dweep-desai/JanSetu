import React, { useState } from 'react';
import { Search, ChevronRight, SlidersHorizontal, Building, GraduationCap, HeartPulse, Home, Scale, Cpu, Briefcase, Users, Trophy, Bus, Plane, Wrench, Sprout, Landmark, Banknote, Map as MapIcon, Globe, Radio, Droplet, Sun, Fuel, Train, BookOpen, BarChart, Shirt, Fish, Utensils, Anchor } from 'lucide-react';

// Types for our data
interface StatCard {
    title: string;
    count: string;
    icon: React.ReactNode;
    color: string;
}

interface StateCard {
    name: string;
    count: string;
    icon: string; // Using emojis or image placeholders for flags/maps
}

interface MinistryCard {
    name: string;
    count: string;
    icon: React.ReactNode;
}

import SchemeWizard from '../../components/citizen/SchemeWizard';

const Schemes = () => {
    const [activeTab, setActiveTab] = useState<'categories' | 'states' | 'ministries'>('categories');
    const [wizardOpen, setWizardOpen] = useState(false);

    // Static Data matching screenshots
    const categories: StatCard[] = [
        { title: "Agriculture,Rural & Environment", count: "718 Schemes", icon: <Sprout className="w-6 h-6" />, color: "bg-green-100 text-green-700" },
        { title: "Banking,Financial Services and Insurance", count: "293 Schemes", icon: <Landmark className="w-6 h-6" />, color: "bg-amber-100 text-amber-700" },
        { title: "Business & Entrepreneurship", count: "622 Schemes", icon: <Banknote className="w-6 h-6" />, color: "bg-purple-100 text-purple-700" },
        { title: "Education & Learning", count: "1068 Schemes", icon: <GraduationCap className="w-6 h-6" />, color: "bg-red-100 text-red-700" },
        { title: "Health & Wellness", count: "255 Schemes", icon: <HeartPulse className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-700" },
        { title: "Housing & Shelter", count: "118 Schemes", icon: <Home className="w-6 h-6" />, color: "bg-blue-100 text-blue-700" },
        { title: "Public Safety,Law & Justice", count: "27 Schemes", icon: <Scale className="w-6 h-6" />, color: "bg-slate-100 text-slate-700" },
        { title: "Science, IT & Communications", count: "96 Schemes", icon: <Cpu className="w-6 h-6" />, color: "bg-indigo-100 text-indigo-700" },
        { title: "Skills & Employment", count: "350 Schemes", icon: <Briefcase className="w-6 h-6" />, color: "bg-orange-100 text-orange-700" },
        { title: "Social welfare & Empowerment", count: "1449 Schemes", icon: <Users className="w-6 h-6" />, color: "bg-pink-100 text-pink-700" },
        { title: "Sports & Culture", count: "247 Schemes", icon: <Trophy className="w-6 h-6" />, color: "bg-lime-100 text-lime-700" },
        { title: "Transport & Infrastructure", count: "75 Schemes", icon: <Bus className="w-6 h-6" />, color: "bg-cyan-100 text-cyan-700" },
        { title: "Travel & Tourism", count: "67 Schemes", icon: <Plane className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
        { title: "Utility & Sanitation", count: "48 Schemes", icon: <Wrench className="w-6 h-6" />, color: "bg-rose-100 text-rose-700" },
        { title: "Women and Child", count: "437 Schemes", icon: <Users className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-700" },
    ];

    const states: StateCard[] = [
        { name: "Andaman and Nicobar Islands", count: "20 Schemes", icon: "🌴" },
        { name: "Andhra Pradesh", count: "52 Schemes", icon: "🗺️" },
        { name: "Arunachal Pradesh", count: "40 Schemes", icon: "🏔️" },
        { name: "Assam", count: "71 Schemes", icon: "🦏" },
        { name: "Bihar", count: "115 Schemes", icon: "🏛️" },
        { name: "Chandigarh", count: "20 Schemes", icon: "🏙️" },
        { name: "Chhattisgarh", count: "108 Schemes", icon: "🌳" },
        { name: "Dadra & Nagar Haveli", count: "50 Schemes", icon: "🌊" },
        { name: "Delhi", count: "51 Schemes", icon: "🏛️" },
        { name: "Goa", count: "246 Schemes", icon: "🏖️" },
        { name: "Gujarat", count: "636 Schemes", icon: "🦁" },
        { name: "Haryana", count: "248 Schemes", icon: "🌾" },
        { name: "Himachal Pradesh", count: "66 Schemes", icon: "🏔️" },
        { name: "Jammu and Kashmir", count: "51 Schemes", icon: "🗻" },
        { name: "Jharkhand", count: "97 Schemes", icon: "🐘" },
        { name: "Karnataka", count: "65 Schemes", icon: "🕌" },
        { name: "Kerala", count: "83 Schemes", icon: "🥥" },
        { name: "Ladakh", count: "5 Schemes", icon: "🏯" },
        { name: "Lakshadweep", count: "9 Schemes", icon: "🏝️" },
        { name: "Madhya Pradesh", count: "234 Schemes", icon: "🐅" },
        { name: "Maharashtra", count: "86 Schemes", icon: "🏰" },
        { name: "Manipur", count: "30 Schemes", icon: "🏞️" },
        { name: "Meghalaya", count: "63 Schemes", icon: "🌧️" },
        { name: "Mizoram", count: "21 Schemes", icon: "🎋" },
        { name: "Nagaland", count: "22 Schemes", icon: "🦅" },
        { name: "Odisha", count: "75 Schemes", icon: "🏛️" },
        { name: "Puducherry", count: "234 Schemes", icon: "🏡" },
        { name: "Punjab", count: "41 Schemes", icon: "🚜" },
        { name: "Rajasthan", count: "161 Schemes", icon: "🐪" },
        { name: "Sikkim", count: "25 Schemes", icon: "🏔️" },
        { name: "Tamil Nadu", count: "237 Schemes", icon: "🛕" },
        { name: "Telangana", count: "24 Schemes", icon: "🏯" },
        { name: "Tripura", count: "39 Schemes", icon: "🏰" },
        { name: "Uttar Pradesh", count: "47 Schemes", icon: "🕌" },
        { name: "Uttarakhand", count: "327 Schemes", icon: "⛰️" },
        { name: "West Bengal", count: "110 Schemes", icon: "🐅" },
    ];

    const ministries: MinistryCard[] = [
        { name: "Comptroller And Auditor General Of India", count: "2 Schemes", icon: <Building className="w-6 h-6" /> },
        { name: "Ministry Of Chemicals And Fertilizers", count: "2 Schemes", icon: <Experiment className="w-6 h-6" /> },
        { name: "Ministry Of Commerce And Industry", count: "29 Schemes", icon: <Briefcase className="w-6 h-6" /> },
        { name: "Ministry Of Communication", count: "6 Schemes", icon: <Phone className="w-6 h-6" /> },
        { name: "Ministry Of Consumer Affairs, Food And Public Distribution", count: "1 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of Culture", count: "13 Schemes", icon: <Landmark className="w-6 h-6" /> },
        { name: "Ministry Of Defence", count: "15 Schemes", icon: <Shield className="w-6 h-6" /> },
        { name: "Ministry Of Development Of North Eastern Region", count: "1 Schemes", icon: <MapIcon className="w-6 h-6" /> },
        { name: "Ministry Of Earth Sciences", count: "1 Schemes", icon: <Globe className="w-6 h-6" /> },
        { name: "Ministry Of Environment, Forest and Climate Change", count: "2 Schemes", icon: <Sprout className="w-6 h-6" /> },
        { name: "Ministry Of External Affairs", count: "5 Schemes", icon: <Plane className="w-6 h-6" /> },
        { name: "Ministry Of Finance", count: "18 Schemes", icon: <IndianRupee className="w-6 h-6" /> },
        { name: "Ministry Of Health & Family Welfare", count: "15 Schemes", icon: <HeartPulse className="w-6 h-6" /> },
        { name: "Ministry Of Home Affairs", count: "11 Schemes", icon: <Home className="w-6 h-6" /> },
        { name: "Ministry Of Housing & Urban Affairs", count: "5 Schemes", icon: <Building className="w-6 h-6" /> },
        { name: "Ministry Of Information And Broadcasting", count: "1 Schemes", icon: <Radio className="w-6 h-6" /> },
        { name: "Ministry Of Jal Shakti", count: "6 Schemes", icon: <Droplet className="w-6 h-6" /> },
        { name: "Ministry Of Labour and Employment", count: "10 Schemes", icon: <Briefcase className="w-6 h-6" /> },
        { name: "Ministry Of Law and Justice", count: "3 Schemes", icon: <Scale className="w-6 h-6" /> },
        { name: "Ministry Of Micro, Small and Medium Enterprises", count: "29 Schemes", icon: <Factory className="w-6 h-6" /> },
        { name: "Ministry Of Minority Affairs", count: "11 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of New and Renewable Energy", count: "7 Schemes", icon: <Sun className="w-6 h-6" /> },
        { name: "Ministry Of Panchayati Raj", count: "3 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of Personnel, Public Grievances and Pensions", count: "3 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of Petroleum and Natural Gas", count: "3 Schemes", icon: <Fuel className="w-6 h-6" /> },
        { name: "Ministry Of Railways", count: "1 Schemes", icon: <Train className="w-6 h-6" /> },
        { name: "Ministry Of Road Transport & Highways", count: "2 Schemes", icon: <Bus className="w-6 h-6" /> },
        { name: "Ministry Of Rural Development", count: "11 Schemes", icon: <Sprout className="w-6 h-6" /> },
        { name: "Ministry Of Science And Technology", count: "69 Schemes", icon: <Experiment className="w-6 h-6" /> },
        { name: "Ministry Of Skill Development And Entrepreneurship", count: "6 Schemes", icon: <BookOpen className="w-6 h-6" /> },
        { name: "Ministry Of Social Justice and Empowerment", count: "103 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of Statistics and Programme Implementation", count: "2 Schemes", icon: <BarChart className="w-6 h-6" /> },
        { name: "Ministry Of Textiles", count: "17 Schemes", icon: <Shirt className="w-6 h-6" /> },
        { name: "Ministry Of Tourism", count: "6 Schemes", icon: <Plane className="w-6 h-6" /> },
        { name: "Ministry Of Tribal Affairs", count: "8 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "Ministry Of Youth Affairs & Sports", count: "5 Schemes", icon: <Trophy className="w-6 h-6" /> },
        { name: "Ministry Of Corporate Affairs", count: "2 Schemes", icon: <Briefcase className="w-6 h-6" /> },
        { name: "Ministry Of Education", count: "79 Schemes", icon: <GraduationCap className="w-6 h-6" /> },
        { name: "Ministry Of Electronics and Information Technology", count: "9 Schemes", icon: <Cpu className="w-6 h-6" /> },
        { name: "Ministry of Fisheries, Animal Husbandry and Dairying", count: "13 Schemes", icon: <Fish className="w-6 h-6" /> },
        { name: "Ministry of Food Processing Industries", count: "1 Schemes", icon: <Utensils className="w-6 h-6" /> },
        { name: "Ministry of Heavy Industries", count: "2 Schemes", icon: <Factory className="w-6 h-6" /> },
        { name: "Ministry of Ports, Shipping and Waterways", count: "1 Schemes", icon: <Anchor className="w-6 h-6" /> },
        { name: "Ministry of Women and Child Development", count: "6 Schemes", icon: <Users className="w-6 h-6" /> },
        { name: "NITI Aayog (National Institution for Transforming India)", count: "1 Schemes", icon: <Landmark className="w-6 h-6" /> },
        { name: "The Lokpal of India", count: "1 Schemes", icon: <Scale className="w-6 h-6" /> },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Search Section */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search For Schemes"
                    className="w-full p-4 pl-6 pr-12 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:text-orange-600">
                    <Search className="w-6 h-6" />
                </button>
            </div>

            {/* Explore Banner */}
            <div
                onClick={() => setWizardOpen(true)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 items-center">
                        <SlidersHorizontal className="w-8 h-8 text-blue-600" />
                        <div className="w-px h-8 bg-gray-300 mx-2"></div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Explore Eligible Schemes</h3>
                    </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Tabs & Filters */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Explore Schemes</h2>
                    <button className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1 rounded-md">View All</button>
                </div>

                <div className="flex gap-4 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'categories'
                            ? 'bg-[#005CA8] text-white shadow-md'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('states')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'states'
                            ? 'bg-[#005CA8] text-white shadow-md'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                    >
                        State/UTs
                    </button>
                    <button
                        onClick={() => setActiveTab('ministries')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'ministries'
                            ? 'bg-[#005CA8] text-white shadow-md'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                    >
                        Central Ministries
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Categories View */}
                    {activeTab === 'categories' && categories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-pointer group">
                            <div className={`p-3 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-[#005CA8] transition-colors line-clamp-2">{cat.title}</h3>
                                <p className="text-sm text-orange-500 font-medium mt-1">{cat.count}</p>
                            </div>
                        </div>
                    ))}

                    {/* States View */}
                    {activeTab === 'states' && states.map((state, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-pointer group">
                            <div className="p-3 bg-blue-50 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                                {state.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-[#005CA8] transition-colors">{state.name}</h3>
                                <p className="text-sm text-orange-500 font-medium mt-1">{state.count}</p>
                            </div>
                        </div>
                    ))}

                    {/* Ministries View */}
                    {activeTab === 'ministries' && ministries.map((min, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-pointer group">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                                {min.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-[#005CA8] transition-colors line-clamp-2">{min.name}</h3>
                                <p className="text-sm text-orange-500 font-medium mt-1">{min.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SchemeWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
        </div>
    );
};

// Helper components for missing Lucide icons in default set
const Factory = ({ className }: { className?: string }) => <Building className={className} />;

const Experiment = ({ className }: { className?: string }) => <div className={className}>⚗️</div>;
const Phone = ({ className }: { className?: string }) => <div className={className}>📞</div>;
const Shield = ({ className }: { className?: string }) => <div className={className}>🛡️</div>;
const IndianRupee = ({ className }: { className?: string }) => <span className={`font-bold ${className}`}>₹</span>;


export default Schemes;
