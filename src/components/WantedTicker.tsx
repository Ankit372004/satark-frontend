"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WantedTicker = () => {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTopWanted = async () => {
            try {
                // Fetch public leads
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads?limit=50`);
                const data = await res.json();

                // Filter for WANTED and Sort by Priority/Reward (Mock logic for "Top")
                const wanted = data
                    .filter((l: any) => l.status === 'WANTED')
                    .map((l: any) => {
                        let details: any = {};
                        try { details = typeof l.details === 'string' ? JSON.parse(l.details) : l.details; } catch (e) { }
                        return {
                            id: l.id,
                            title: l.title,
                            name: details.name || l.title,
                            image: l.image_url || "/assets/delhi-police-logo.png",
                            reward: l.reward_amount ? `${l.reward_amount}` : null,
                            priority: l.priority
                        };
                    });

                // Sort: Critical first, then by Reward presence
                wanted.sort((a: any, b: any) => {
                    if (a.priority === 'CRITICAL' && b.priority !== 'CRITICAL') return -1;
                    if (b.priority === 'CRITICAL' && a.priority !== 'CRITICAL') return 1;
                    if (a.reward && !b.reward) return -1;
                    if (!a.reward && b.reward) return 1;
                    return 0;
                });

                setLeads(wanted.slice(0, 10)); // Top 10
            } catch (err) {
                console.error("Ticker Fetch Error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopWanted();
    }, []);

    if (loading || leads.length === 0) return null;

    // Logic for seamless loop: We need enough items to fill the width.
    // If fewer than 5 items, repeat them more times to ensure smooth scrolling.
    const displayLeads = leads.length < 5 ? [...leads, ...leads, ...leads, ...leads] : [...leads, ...leads];

    return (
        <div className="w-100 bg-black border-top border-bottom border-danger border-opacity-25 overflow-hidden py-2 position-relative">
            {/* Gradient Fade Edges */}
            <div className="position-absolute top-0 start-0 h-100 w-100 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-2" style={{ background: 'linear-gradient(90deg, black 0%, transparent 10%, transparent 90%, black 100%)' }}></div>

            <div className="d-flex align-items-center">
                <div className="bg-danger text-white px-3 py-1 fw-bold text-uppercase small flex-shrink-0 z-3 position-relative ms-3 shadow-lg rounded-1 cursor-default">
                    <span className="me-2 animate-pulse">●</span> TOP ACTIVE FUGITIVES
                </div>

                <div className="overflow-hidden flex-grow-1 position-relative" style={{ height: '50px' }}>
                    <motion.div
                        className="d-flex align-items-center gap-5 position-absolute top-50 translate-middle-y"
                        initial={{ x: "0" }}
                        animate={{ x: "-50%" }} // Move halfway (since we doubled the content)
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: leads.length * 5, // Dynamic duration based on count
                        }}
                        style={{ whiteSpace: 'nowrap', paddingLeft: '20px' }}
                    >
                        {displayLeads.map((lead, i) => (
                            <div
                                key={`${lead.id}-${i}`}
                                className="d-flex align-items-center gap-3 cursor-pointer opacity-75 hover-opacity-100 transition-all flex-shrink-0"
                                onClick={() => router.push(`/dashboard/case/${lead.id}`)}
                            >
                                <img
                                    src={lead.image}
                                    alt={lead.name}
                                    className="rounded-circle border border-secondary"
                                    style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                />
                                <div className="d-flex flex-column justify-content-center lh-1">
                                    <div className="text-white fw-bold text-uppercase x-small d-flex align-items-center gap-2">
                                        {lead.name}
                                        {lead.priority === 'CRITICAL' && <AlertTriangle size={10} className="text-danger" />}
                                    </div>
                                    {lead.reward && (
                                        <div className="text-warning x-small fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                                            <Award size={10} /> {lead.reward}
                                        </div>
                                    )}
                                </div>
                                <div className="vr bg-secondary opacity-25" style={{ height: '20px' }}></div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
