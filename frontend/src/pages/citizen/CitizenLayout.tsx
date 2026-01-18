import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
    Home, Grid3X3, FileText, BookOpen, LayoutDashboard,
    Search, Bell, Moon, Menu, User, ChevronDown, HelpCircle
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import './CitizenDashboard.css';

// Sidebar Component
const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: <Home className="nav-icon" />, label: "myJanSetu", path: "/citizen", isLink: true },
        { icon: <Grid3X3 className="nav-icon" />, label: "Services", path: "/citizen/services", isLink: true },
        { icon: <FileText className="nav-icon" />, label: "DigiLocker", path: "/citizen/digilocker", isLink: true },
        // State Removed
        { icon: <BookOpen className="nav-icon" />, label: "Schemes", path: "/citizen/schemes", isLink: true },
        { icon: <LayoutDashboard className="nav-icon" />, label: "Dashboard", path: "/citizen", isLink: true },
    ];

    const isHelpActive = location.pathname === '/citizen/help';

    return (
        <aside className="sidebar flex flex-col justify-between">
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        if (item.isLink) {
                            return (
                                <li key={index}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === "/citizen"}
                                        className={({ isActive: navIsActive }) =>
                                            `nav-item ${navIsActive ? 'active' : ''}`
                                        }
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                </li>
                            );
                        } else {
                            return (
                                <li key={index}>
                                    <a href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                                        {item.icon}
                                        {item.label}
                                    </a>
                                </li>
                            );
                        }
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => navigate('/citizen/help')}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${isHelpActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Help & Support</span>
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
            // Use first two characters of Aadhar
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

    const handleViewProfile = () => {
        setDropdownOpen(false);
        navigate('/citizen/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="icon-btn">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="logo">
                    <div className="logo-icon">
                        <span>J</span>
                    </div>
                    <span className="logo-text">JanSetu</span>
                </div>
            </div>

            <div className="search-container">
                <div className="search-box">
                    <Search className="search-icon" />
                    <input type="text" placeholder='Search For "EPFO"' className="search-input" />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-btn">
                    <Bell className="w-5 h-5" />
                </button>
                <button className="icon-btn">
                    <Moon className="w-5 h-5" />
                </button>
                <div className="user-dropdown" ref={dropdownRef}>
                    <div
                        className="user-info-dropdown-trigger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(!dropdownOpen);
                        }}
                    >
                        <div className="avatar">{getUserInitials()}</div>
                        <span className="user-aadhaar">{getAadhaarDisplay()}</span>
                        <ChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} size={16} />
                    </div>
                    {dropdownOpen && (
                        <div className="user-dropdown-menu">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile();
                                }}
                                className="dropdown-item"
                            >
                                <User className="dropdown-item-icon" size={16} />
                                <span>View Profile</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLogout();
                                }}
                                className="dropdown-item"
                            >
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
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
        <div className="dashboard">
            <Sidebar />
            <div className="main-container">
                <Header />
                <main className="main-content">
                    <Outlet />
                    {showChatbot && <Chatbot />}
                </main>
            </div>
        </div>
    );
};

export default CitizenLayout;
