"use client";

import React from 'react';
import { Home, Zap, Shield, Hash, MapPin, Users, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/theme';
import { LEAD_CATEGORIES } from '@/lib/constants';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    activeCategory: string | null;
    onCategoryChange: (catId: string | null) => void;
    activeJurisdiction: string | null;
    onJurisdictionChange: (juris: string | null) => void;
}

export default function LeftSidebar({ activeTab, onTabChange, activeCategory, onCategoryChange, activeJurisdiction, onJurisdictionChange }: SidebarProps) {
    const menuItems = [
        { icon: Home, label: "Home", id: "all" },
        { icon: Zap, label: "Popular", id: "popular" },
        { icon: TrendingUp, label: "Trending", id: "trending" },
        { icon: Award, label: "High Rewards", id: "rewards" }, // Added High Rewards
    ];

    const CATEGORY_STYLES: Record<string, { icon: any, color: string }> = {
        terrorism: { icon: Shield, color: COLORS.wineRed },
        kidnapping: { icon: Users, color: '#6610f2' },
        cyber_crime: { icon: Hash, color: '#007bff' },
        organized_crime: { icon: Shield, color: '#6c757d' },
        drug_rackets: { icon: Zap, color: '#8800ff' },
        money_laundering: { icon: Hash, color: '#28a745' },
        corruption: { icon: Shield, color: '#fd7e14' },
        parental_kidnappings: { icon: Users, color: '#dc3545' },
        human_trafficking: { icon: Users, color: '#e83e8c' },
        seeking_info: { icon: Award, color: COLORS.golden },
        other: { icon: Hash, color: '#6c757d' }
    };

    const categories = LEAD_CATEGORIES.map(cat => ({
        id: cat.id,
        label: cat.label,
        icon: CATEGORY_STYLES[cat.id]?.icon || Hash, // Safe fallback
        color: CATEGORY_STYLES[cat.id]?.color || '#6c757d'
    }));

    const jurisdictions = [
        { label: "Central District" },
        { label: "Crime Branch" },
        { label: "Dwarka District" },
        { label: "East District" },
        { label: "Economic Offences Wing" },
        { label: "IGI Airport" },
        { label: "Licensing Unit" },
        { label: "Metro" },
        { label: "New Delhi District" },
        { label: "North District" },
        { label: "North-East District" },
        { label: "North-West District" },
        { label: "Outer District" },
        { label: "Outer-North District" },
        { label: "Railways" },
        { label: "Rohini District" },
        { label: "Shahdara District" },
        { label: "South District" },
        { label: "South-East District" },
        { label: "South-West District" },
        { label: "Special Cell" },
        { label: "Traffic Unit" },
        { label: "Vigilance" },
        { label: "West District" },
    ];

    return (
        <div className="d-none d-lg-block h-100">
            <div className="sticky-top" style={{ top: '100px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>

                {/* Navigation */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Feeds</p>
                    <ul className="list-unstyled">
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onTabChange(item.id)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all border-0 w-100 text-start"
                                    style={{
                                        color: activeTab === item.id ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeTab === item.id ? 'rgba(0, 0, 128, 0.05)' : 'transparent',
                                        fontWeight: activeTab === item.id ? '600' : '500'
                                    }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Communities / Categories */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Communities (Categories)</p>
                    <ul className="list-unstyled">
                        {categories.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onCategoryChange(activeCategory === item.id ? null : item.id)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all hover-bg border-0 w-100 text-start"
                                    style={{
                                        color: activeCategory === item.id ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeCategory === item.id ? 'rgba(0, 0, 128, 0.05)' : 'transparent'
                                    }}
                                >
                                    <item.icon size={20} style={{ color: item.color }} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Jurisdictions / Ideas */}
                <div className="mb-4">
                    <p className="small fw-bold text-uppercase mb-2 px-3" style={{ fontSize: '11px', letterSpacing: '0.5px', color: COLORS.textSecondary }}>Jurisdictions</p>
                    <ul className="list-unstyled">
                        {jurisdictions.map((item, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onJurisdictionChange(activeJurisdiction === item.label ? null : item.label)}
                                    className="d-flex align-items-center gap-3 py-2 px-3 text-decoration-none rounded-3 transition-all hover-bg border-0 w-100 text-start"
                                    style={{
                                        color: activeJurisdiction === item.label ? COLORS.navyBlue : COLORS.textPrimary,
                                        background: activeJurisdiction === item.label ? 'rgba(0, 0, 128, 0.05)' : 'transparent'
                                    }}
                                >
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                                        <MapPin size={12} />
                                    </div>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Create Community CTA */}
                <div className="px-3">
                    <button className="btn w-100 rounded-pill btn-outline-dark fw-bold btn-sm">
                        + Custom Feed
                    </button>
                </div>

            </div>
            <style jsx>{`
        .hover-bg:hover {
            background-color: rgba(0,0,0,0.05);
        }
      `}</style>
        </div>
    );
}
