"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Inbox,
    BarChart3,
    User,
    LogOut,
    Shield,
    Bell,
    Settings,
    Menu,
    X,
    UserCircle,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/theme';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname() || '';

    useEffect(() => {
        const u = localStorage.getItem('user');
        if (!u) {
            window.location.href = '/login';
        } else {
            setUser(JSON.parse(u));
        }

        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    if (!user) return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted fw-bold">Authenticating Authority...</p>
            </div>
        </div>
    );

    const navLinks = [
        { href: '/dashboard', label: 'Intelligence Inbox', icon: Inbox },
        { href: '/dashboard/analytics', label: 'Strategic Analytics', icon: BarChart3 },
        { href: '/dashboard/profile', label: 'Officer Profile', icon: User },
        { href: '/dashboard/settings', label: 'Unit Settings', icon: Settings },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    const sidebarWidth = isSidebarOpen ? '280px' : (isMobile ? '0px' : '80px');

    return (
        <div className="d-flex vh-100 overflow-hidden" style={{ background: COLORS.lightBg }}>
            {/* Mobile Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 blur-sm"
                    style={{ zIndex: 1040, backdropFilter: 'blur(2px)' }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarWidth }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`d-flex flex-column shadow-lg ${isMobile ? 'position-fixed h-100 start-0 top-0' : ''}`}
                style={{
                    background: `linear-gradient(180deg, ${COLORS.darkNavy} 0%, ${COLORS.deepBlue} 100%)`,
                    zIndex: 1050,
                    color: '#fff',
                    overflowX: 'hidden',
                    whiteSpace: 'nowrap'
                }}
            >
                {/* Sidebar Header */}
                <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-white border-opacity-10" style={{ minWidth: '280px' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-white p-1 rounded shadow-sm">
                            <Shield size={24} style={{ color: COLORS.navyBlue }} />
                        </div>
                        <span className="fw-bold tracking-wider" style={{ fontSize: '1.2rem', color: '#fff' }}>SATARK <span style={{ color: COLORS.golden }}>PORTAL</span></span>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsSidebarOpen(false)} className="btn btn-sm btn-link text-white p-0">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <div style={{ minWidth: '280px' }}>
                    {/* User Profile Summary */}
                    {(isSidebarOpen || isMobile) && (
                        <div className="p-4 mb-2">
                            <div className="d-flex align-items-center gap-3 p-3 rounded-4 border border-white border-opacity-10" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px', background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.wineRed})` }}>
                                    <UserCircle size={24} className="text-white" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="fw-bold text-truncate text-white" style={{ fontSize: '14px' }}>{user.name}</div>
                                    <div className="text-white text-uppercase fw-bold opacity-50" style={{ fontSize: '10px' }}>{user.role}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="nav flex-column gap-2 px-3 mb-auto mt-3">
                        {/* PRIMARY ACTION BUTTON & SUB-MENU */}
                        <div className="mb-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="btn w-100 d-flex align-items-center justify-content-center gap-2 p-3 rounded-3 shadow-lg hover-scale transition-transform position-relative"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: COLORS.darkNavy,
                                    border: 'none',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    zIndex: 2
                                }}
                                data-bs-toggle="collapse"
                                data-bs-target="#publishSubmenu"
                                aria-expanded="false"
                            >
                                <Shield size={20} />
                                <span>PUBLISH INTEL</span>
                                <Plus size={16} className="ms-auto opacity-50" />
                            </button>

                            <div className={`collapse ${isSidebarOpen ? 'show' : ''} mt-2`} id="publishSubmenu">
                                <div className="card card-body border-0 p-2 rounded-3 gap-1" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                    <Link href="/dashboard/publish/wanted" className="btn btn-sm text-start text-white opacity-75 hover-opacity-100 d-flex align-items-center gap-2 py-2">
                                        <div className="bg-danger rounded-circle" style={{ width: 6, height: 6 }}></div> Wanted Fugitive
                                    </Link>
                                    <Link href="/dashboard/publish/missing" className="btn btn-sm text-start text-white opacity-75 hover-opacity-100 d-flex align-items-center gap-2 py-2">
                                        <div className="bg-warning rounded-circle" style={{ width: 6, height: 6 }}></div> Missing Person
                                    </Link>
                                    <Link href="/dashboard/publish/alert" className="btn btn-sm text-start text-white opacity-75 hover-opacity-100 d-flex align-items-center gap-2 py-2">
                                        <div className="bg-warning text-dark rounded-circle" style={{ width: 6, height: 6 }}></div> Public Safety Alert
                                    </Link>
                                    <Link href="/dashboard/publish/general" className="btn btn-sm text-start text-white opacity-75 hover-opacity-100 d-flex align-items-center gap-2 py-2">
                                        <div className="bg-secondary rounded-circle" style={{ width: 6, height: 6 }}></div> General Intel
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {navLinks.map((link, idx) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className={`nav-link d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${active ? 'shadow-sm' : 'hover-bg-white'}`}
                                    style={{
                                        border: active ? `1px solid rgba(255,255,255,0.1)` : '1px solid transparent',
                                        color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                                        background: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                                    }}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                >
                                    <link.icon size={22} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)' }} />
                                    <span className="fw-medium">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-top border-white border-opacity-10">
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold text-danger"
                            style={{ borderColor: 'rgba(220, 38, 38, 0.4)' }}
                        >
                            <LogOut size={18} />
                            <span>Exit Portal</span>
                        </button>
                        <div className="mt-3 text-center">
                            <small className="text-white opacity-50" style={{ fontSize: '10px' }}>SECURE SESSION ACTIVE</small>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-grow-1 overflow-auto d-flex flex-column">
                {/* Top Header */}
                <header className="bg-white border-bottom p-3 px-4 d-flex justify-content-between align-items-center sticky-top shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-light rounded-circle shadow-sm"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen && !isMobile ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <h5 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
                                Strategic Command Center
                                <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '10px' }}>LIVE</span>
                            </h5>
                            <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>Monitoring Intelligence for Delhi Jurisdiction</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                            <button className="btn btn-light rounded-circle shadow-sm p-2">
                                <Bell size={20} className="text-muted" />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '8px' }}>
                                    3+
                                </span>
                            </button>
                        </div>
                        <div className="vr h-25 mx-2"></div>
                        <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
                            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            <small className="fw-bold text-muted" style={{ fontSize: '10px' }}>ENCRYPTED CHANNEL</small>
                        </div>
                    </div>
                </header>

                <div className="container-fluid py-4 px-4 px-md-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
