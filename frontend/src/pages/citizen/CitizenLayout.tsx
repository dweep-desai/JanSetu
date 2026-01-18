import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
    Home, Grid3X3, FileText, BookOpen, LayoutDashboard,
    Search, Bell, Menu, User, ChevronDown, HelpCircle,
    LogOut, Settings
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';

// Sidebar Component
const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: "myJanSetu", path: "/citizen", isLink: true },
        { icon: <Grid3X3 className="w-5 h-5" />, label: "Services", path: "/citizen/services", isLink: true },
        { icon: <FileText className="w-5 h-5" />, label: "DigiLocker", path: "/citizen/digilocker", isLink: true },
        { icon: <BookOpen className="w-5 h-5" />, label: "Schemes", path: "/citizen/schemes", isLink: true },
        { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/citizen", isLink: true },
    ];

    const isHelpActive = location.pathname === '/citizen/help';

    return (
        <aside className="w-60 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col justify-between hidden md:flex shrink-0 z-40">
            <nav className="p-4 space-y-1">
                <div className="px-3 py-4 mb-2 flex items-center gap-2 lg:hidden">
                    <span className="font-bold text-xl text-blue-600">JanSetu</span>
                </div>

                <ul className="space-y-1">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path || (item.path !== '/citizen' && location.pathname.startsWith(item.path));

                        const content = (
                            <>
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </>
                        );

                        const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                            ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`;

                        return (
                            <li key={index}>
                                {item.isLink ? (
                                    <NavLink
                                        to={item.path}
                                        end={item.path === "/citizen"}
                                        className={({ isActive: navIsActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${navIsActive
                                                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {content}
                                    </NavLink>
                                ) : (
                                    <a href={item.path} className={className}>
                                        {content}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={() => navigate('/citizen/help')}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isHelpActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium">Help & Support</span>
                </button>
            </div>
        </aside>
    );
};

// Header Component
const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.aadhar) {
            return user.aadhar.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    // Get full Aadhaar ID for display
    const getAadhaarDisplay = () => {
        if (user?.aadhar) {
            return user.aadhar;
        }
        return 'N/A';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/60 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-3">
                            <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    J
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 hidden sm:block">
                                    JanSetu
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-md">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                                    placeholder="Search services, schemes, or documents..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                                    {getUserInitials()}
                                </div>
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-xs font-semibold text-slate-700 leading-none group-hover:text-slate-900">
                                        {getAadhaarDisplay()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 leading-none mt-0.5">Citizen</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-200 border border-slate-100 z-50">
                                    <div className="px-4 py-3 border-b border-slate-50">
                                        <p className="text-sm font-medium text-slate-900">Signed in as</p>
                                        <p className="text-sm text-slate-500 truncate font-mono">{getAadhaarDisplay()}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate('/citizen/profile');
                                            }}
                                            className="group flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                                            Your Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate('/citizen/settings');
                                            }}
                                            className="group flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-slate-100 py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

import Chatbot from '../../components/citizen/Chatbot';

const CitizenLayout = () => {
    const location = useLocation();

    // Hide chatbot on Dashboard (index /citizen) and Help (/citizen/help)
    // The index route path is '/citizen' exactly (usually, but let's check strictness)
    // If user visits /citizen/dashboard (if that redirects), we want to be safe.
    // Based on App.tsx, the routes are:
    // /citizen (Dashboard)
    // /citizen/help (Help)
    // So if pathname IS exactly '/citizen' OR '/citizen/help', hide it.
    // Also user might access /citizen/ (trailing slash).

    const pathname = location.pathname.toLowerCase().replace(/\/$/, ""); // Remove trailing slash if any
    const isHelp = pathname === '/citizen/help';

    // Only hide on Help page now, as per user request to include Dashboard
    const showChatbot = !isHelp;

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-0">
                <Header />
                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 md:py-10 max-w-7xl mx-auto w-full">
                    <Outlet />
                    {showChatbot && <Chatbot />}
                </main>
            </div>
        </div>
    );
};

export default CitizenLayout;
