"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Search, Bell, User } from 'lucide-react';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';

export default function Header() {
    const { t, i18n } = useTranslation();

    const toggleLang = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            {/* Top Bar - Government Style */}
            <div
                className="top-bar py-2"
                style={{
                    background: GRADIENTS.gov,
                    borderBottom: `2px solid ${COLORS.golden}`
                }}
            >
                <div className="container-fluid px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/100px-Emblem_of_India.svg.png"
                                alt="Government of India"
                                style={{ height: '30px', width: 'auto' }}
                            />
                            <span className="text-white small fw-bold">GOVERNMENT OF INDIA</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <button
                                onClick={toggleLang}
                                className="btn btn-sm text-white border-0"
                                style={{ background: GRADIENTS.glass }}
                            >
                                {i18n.language === 'en' ? 'हिंदी' : 'English'}
                            </button>
                            <span className="text-white small">|</span>
                            <button className="btn btn-sm text-white border-0 d-flex align-items-center gap-1">
                                <User size={16} />
                                <span className="d-none d-md-inline">Login</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                className="main-header py-3 shadow-sm"
                style={{
                    background: GRADIENTS.header,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000
                }}
            >
                <div className="container-fluid px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        {/* Logo and Branding */}
                        <Link href="/" className="text-decoration-none d-flex align-items-center gap-3">
                            <img
                                src="/delhi-police-logo.png"
                                alt="Delhi Police"
                                style={{ height: '60px', width: 'auto' }}
                            />
                            <div className="d-none d-md-block">
                                <h1 className="h5 mb-0 fw-bold text-white">{t('title')}</h1>
                                <p className="small mb-0" style={{ color: COLORS.golden }}>{t('subtitle')}</p>
                            </div>
                        </Link>

                        {/* Portal Tagline */}
                        <div className="d-none d-xl-block position-absolute start-50 translate-middle-x">
                            <h3 className="mb-0 fw-black text-uppercase text-center ls-1" style={{ color: '#FFFF00', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                See Something, Say Something
                            </h3>
                        </div>

                        {/* Navigation */}
                        <nav className="d-none d-lg-flex align-items-center gap-4">
                            <Link href="/" className="nav-link text-white fw-500 hover-gold">
                                {t('nav.home')}
                            </Link>
                            <Link href="/most-wanted" className="nav-link text-white fw-500 hover-gold">
                                Wanted
                            </Link>
                            <Link href="/missing-persons" className="nav-link text-white fw-500 hover-gold">
                                Missing Person
                            </Link>
                            <Link
                                href="/login"
                                className="btn btn-sm fw-bold px-4"
                                style={{
                                    background: GRADIENTS.gold,
                                    color: COLORS.navyBlue,
                                    border: 'none',
                                    boxShadow: SHADOWS.gold
                                }}
                            >
                                {t('nav.login')}
                            </Link>
                        </nav>

                        {/* Mobile Menu Icon */}
                        <button className="btn btn-link text-white d-lg-none">
                            <svg width="24" height="24" fill="currentColor">
                                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <style jsx>{`
                .hover-gold:hover {
                    color: #FFD700 !important;
                    transition: color 0.3s ease;
                }
                .fw-500 {
                    font-weight: 500;
                }
            `}</style>
        </>
    );
}
