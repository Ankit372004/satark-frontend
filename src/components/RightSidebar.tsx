"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, AlertTriangle, Phone, ChevronUp, ChevronDown, Award, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';
import { WantedPerson } from '@/lib/types';

export default function RightSidebar({ onLeadSelect }: { onLeadSelect?: (lead: any) => void }) {
    const [leads, setLeads] = useState<WantedPerson[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pauseTimer = useRef<NodeJS.Timeout | null>(null);

    // Fetch Active Leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                // Fetch only WANTED or CRITICAL leads for the sidebar from PUBLIC API
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads?status=WANTED`);
                if (res.ok) {
                    const data = await res.json();
                    setLeads(Array.isArray(data) ? data : (data.leads || []));
                }
            } catch (err) {
                console.error("Failed to fetch sidebar leads", err);
            }
        };
        fetchLeads();
    }, []);

    // Infinite Autoscroll Logic
    useEffect(() => {
        if (isPaused || leads.length === 0) return;

        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollInterval = setInterval(() => {
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2) {
                scrollContainer.scrollTop = 0;
            } else {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollTop + 1,
                    behavior: 'auto'
                });
            }
        }, 40);

        return () => clearInterval(scrollInterval);
    }, [isPaused, leads]);

    const handleHoverStart = () => {
        setIsPaused(true);
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };

    const handleHoverEnd = () => {
        pauseTimer.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000);
    };

    const scrollUp = () => {
        if (scrollRef.current) scrollRef.current.scrollTop -= 150;
    };

    const scrollDown = () => {
        if (scrollRef.current) scrollRef.current.scrollTop += 150;
    };

    return (
        <div className="d-none d-xl-block h-100">
            <div className="sticky-top" style={{ top: '100px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>

                {/* Fugitive List text and filters removed as per request */}
                <div className="mb-3"></div>

                {/* Vertical Loop - Portrait Mode */}
                <div className="card border-0 shadow-sm mb-3 overflow-hidden flex-grow-1" style={{ borderRadius: '16px', background: COLORS.surface }}>
                    <div className="card-header bg-transparent border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold small text-uppercase mb-0" style={{ color: COLORS.navyBlue, letterSpacing: '1px' }}>
                            <span className="text-danger me-1">●</span> Active Cases
                        </h6>
                        <div className="d-flex gap-1">
                            <button onClick={scrollUp} className="btn btn-sm btn-light rounded-circle p-1"><ChevronUp size={14} /></button>
                            <button onClick={scrollDown} className="btn btn-sm btn-light rounded-circle p-1"><ChevronDown size={14} /></button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="card-body p-3 overflow-y-auto custom-scrollbar"
                        style={{ height: '0', flexGrow: 1 }}
                        onMouseEnter={handleHoverStart}
                        onMouseLeave={handleHoverEnd}
                    >
                        {/* Empty State */}
                        {leads.length === 0 && (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted text-center opacity-50">
                                <ShieldCheck size={48} className="mb-2" />
                                <small className="text-uppercase fw-bold ls-1">No Active Warrants</small>
                            </div>
                        )}

                        <div className="d-flex flex-column gap-4 py-2">
                            {/* Loop items - tripled for smooth scroll only if enough items, otherwise just once */}
                            {(leads.length > 3 ? [...leads, ...leads, ...leads] : leads).map((person, idx) => (
                                <motion.div
                                    key={`${person.id}-${idx}`}
                                    whileHover={{ y: -5, boxShadow: '0 16px 32px rgba(220, 38, 38, 0.25)' }}
                                    onClick={() => onLeadSelect?.(person)}
                                    className="card border-0 overflow-hidden position-relative"
                                    style={{
                                        borderRadius: '16px',
                                        background: 'white',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {/* WANTED Banner - Top */}
                                    <div className="w-100 bg-danger text-white text-center py-2 position-relative overflow-hidden">
                                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                                            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                            opacity: 0.9
                                        }}></div>
                                        <h6 className="fw-black text-uppercase mb-0 position-relative" style={{
                                            fontSize: '13px',
                                            letterSpacing: '2px',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                        }}>
                                            WANTED
                                        </h6>
                                    </div>

                                    {/* Large Portrait Image */}
                                    <div className="w-100 position-relative" style={{ height: '200px', background: '#f8f9fa' }}>
                                        <img
                                            src={person.image_url || (typeof person.image === 'string' ? person.image : '/delhi-police-logo.png')}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ objectPosition: 'top center' }}
                                            alt={person.name}
                                        />
                                        {/* Gradient overlay for better text readability */}
                                        <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                                        }}></div>

                                        {/* Priority Badge - Bottom Right */}
                                        <div className="position-absolute bottom-0 end-0 m-2">
                                            <span className={`badge fw-bold rounded-1 px-2 py-1 shadow ${person.priority === 'CRITICAL' ? 'bg-danger text-white' :
                                                person.priority === 'HIGH' ? 'bg-warning text-dark' :
                                                    'bg-secondary text-white'
                                                }`} style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                                                {person.priority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-3 text-center">
                                        {/* Name - Large and Bold */}
                                        <h5 className="fw-black text-dark text-uppercase mb-1" style={{
                                            fontSize: '16px',
                                            letterSpacing: '0.5px',
                                            lineHeight: '1.2'
                                        }}>
                                            {person.name || person.title?.replace('WANTED:', '').trim() || 'Unknown'}
                                        </h5>

                                        {/* Alias - if exists */}
                                        {person.alias && (
                                            <p className="text-muted fw-semibold mb-2 fst-italic" style={{ fontSize: '12px' }}>
                                                "{person.alias}"
                                            </p>
                                        )}

                                        {/* Bounty Badge - Gold themed */}
                                        {(person.reward || person.reward_amount) && (
                                            <div className="mt-2 mb-2">
                                                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill border border-warning" style={{
                                                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
                                                    boxShadow: '0 2px 8px rgba(252, 211, 77, 0.3)'
                                                }}>
                                                    <Award size={14} className="text-warning" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                                                    <span className="fw-black text-dark" style={{
                                                        fontSize: '12px',
                                                        letterSpacing: '0.3px'
                                                    }}>
                                                        {person.reward || person.reward_amount}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA Button */}
                                        <div className="mt-3 pt-2 border-top">
                                            <button
                                                className="btn btn-danger w-100 fw-bold text-uppercase rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                                                style={{ fontSize: '11px', letterSpacing: '1px' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onLeadSelect?.(person);
                                                }}
                                            >
                                                <ShieldCheck size={16} />
                                                View Case
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '12px', background: '#FFF5F5' }}>
                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="fw-bold text-danger mb-1">Emergency?</h6>
                            <p className="small text-muted mb-0">Call 112 / 100</p>
                        </div>
                        <button className="btn btn-danger btn-sm rounded-circle p-2 shadow-sm pulsing-btn">
                            <Phone size={20} fill="white" />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-2 mt-auto">
                    <p className="small text-muted mb-1" style={{ fontSize: '10px' }}>
                        © 2026 Delhi Police Satark Portal
                    </p>
                </div>
            </div>
        </div>
    );
}
