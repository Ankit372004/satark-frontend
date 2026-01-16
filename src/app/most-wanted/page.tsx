"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { WantedTicker } from '@/components/WantedTicker';
import { COLORS, GRADIENTS } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter, EyeOff, ShieldAlert, Award, AlertTriangle, Siren } from 'lucide-react';
import { DetailCanvas } from '@/components/DetailCanvas';
import { useRouter } from 'next/navigation';

export default function MostWantedPage() {
    const router = useRouter();
    const [selectedLeadId, setSelectedLeadId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');

    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Leads
    React.useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads?limit=50`);
                const data = await res.json();

                const mappedData = data
                    .filter((l: any) => l.status === 'WANTED') // STRICT FILTERING: ONLY WANTED
                    .map((l: any) => {
                        let details: any = {};
                        try { details = typeof l.details === 'string' ? JSON.parse(l.details) : l.details; } catch (e) { }

                        const image = l.image_url || "/assets/delhi-police-logo.png";
                        const reward = l.reward_amount ? `${l.reward_amount}` : null;

                        return {
                            ...l,
                            name: details.name || l.title,
                            alias: details.alias || "Unknown",
                            location: l.location || "Delhi NCR",
                            priority: l.priority,
                            reward: reward,
                            image: image,
                            description: l.description,
                            risk: details.risk || (l.priority === 'CRITICAL' ? 'EXTREME' : 'HIGH'),
                            category: l.category_id || 'general'
                        };
                    });

                setLeads(mappedData);
            } catch (err) {
                console.error("Failed to fetch leads", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // Filter Logic
    const filteredData = leads.filter(person => {
        const matchesSearch = person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || person.priority === filterPriority;

        return matchesSearch && matchesPriority;
    });

    const handleReport = (e: React.MouseEvent, person: any) => {
        e.stopPropagation();
        router.push(`/report?mode=anonymous&ref=${person.id}&title=${encodeURIComponent(person.title)}`);
    };

    return (
        <main className="min-vh-100 font-sans" style={{ background: '#0a0a0a', color: '#fff' }}>
            <Header />

            {/* HERO SECTION */}
            <section className="position-relative py-5 overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: `linear-gradient(to bottom, #000000 0%, #1a0505 100%)`, // Very dark red/black gradient
                    opacity: 0.95
                }}></div>

                {/* Decorative Elements */}
                <div className="position-absolute top-0 end-0 opacity-10 pe-none">
                    <Siren size={400} strokeWidth={0.5} color="#DC143C" />
                </div>

                <div className="container position-relative z-1 text-center pt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-danger bg-danger bg-opacity-25 text-danger mb-3"
                    >
                        <ShieldAlert size={16} />
                        <span className="small fw-bold text-uppercase ls-1">Official Red Notices</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="display-2 fw-black text-uppercase mb-2 text-white"
                        style={{ letterSpacing: '4px', textShadow: '0 0 30px rgba(220, 20, 60, 0.4)' }}
                    >
                        Most <span className="text-danger">Wanted</span>
                    </motion.h1>

                    <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
                        High-priority fugitives sought by law enforcement. <br className="d-none d-md-block" />
                        Identify these individuals and help keep our communities safe.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="d-flex justify-content-center gap-2 flex-wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="position-relative flex-grow-1" style={{ maxWidth: '400px', minWidth: '300px' }}>
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, alias..."
                                className="form-control form-control-lg bg-dark border-secondary text-white ps-5 rounded-pill shadow-lg focus-ring-danger"
                                style={{ borderColor: '#333' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            {['All', 'CRITICAL', 'HIGH'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterPriority(cat)}
                                    className={`btn rounded-circle fw-bold d-flex align-items-center justify-content-center border-0 transition-all ${filterPriority === cat ? 'bg-danger text-white shadow-danger-glow' : 'bg-dark text-secondary border border-secondary'}`}
                                    style={{ width: '48px', height: '48px' }}
                                    title={`Filter ${cat}`}
                                >
                                    {cat === 'All' ? <Filter size={20} /> : cat.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* AUTO SCROLL TICKER */}
            <WantedTicker />

            {/* GRID SECTION */}
            <div className="container py-5" style={{ maxWidth: '1600px' }}>
                <div className="row g-4 justify-content-center">
                    <AnimatePresence>
                        {filteredData.map((person) => (
                            <div key={person.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    onClick={() => setSelectedLeadId(person.id)}
                                    className="card bg-dark border-0 h-100 overflow-hidden cursor-pointer position-relative group"
                                    style={{
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        border: '1px solid #333'
                                    }}
                                >
                                    {/* Header Warning Bar */}
                                    <div className="bg-danger text-white text-center py-1 small fw-bold text-uppercase ls-2" style={{ fontSize: '10px' }}>
                                        {person.risk === 'EXTREME' ? 'ARMED & DANGEROUS' : 'WANTED FUGITIVE'}
                                    </div>

                                    {/* Image Container */}
                                    <div className="position-relative overflow-hidden" style={{ paddingTop: '100%' }}>
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover transition-transform"
                                            style={{ filter: 'grayscale(20%) contrast(110%)' }}
                                        />
                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black to-transparent">
                                            {/* Name Overlay */}
                                            <h4 className="fw-black text-white text-uppercase mb-0 text-shadow leading-tight">
                                                {person.name}
                                            </h4>
                                            {person.alias && (
                                                <p className="text-white-50 small mb-0 fst-italic">AKA: "{person.alias}"</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="card-body p-3 bg-dark d-flex flex-column border-top border-secondary">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="d-flex align-items-center text-secondary small">
                                                <MapPin size={14} className="me-1 text-danger" />
                                                {person.location}
                                            </div>
                                            {person.votes > 0 && <span className="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill">{person.votes} Tips</span>}
                                        </div>

                                        {/* Reward Section - Prominent */}
                                        {person.reward ? (
                                            <div className="bg-black border border-danger border-opacity-50 p-3 text-center rounded-2 mb-3 mt-auto">
                                                <div className="text-uppercase x-small text-danger fw-bold ls-1 mb-1">Total Bounty</div>
                                                <div className="fw-black text-white fs-4 lh-1">{person.reward}</div>
                                            </div>
                                        ) : (
                                            <div className="bg-white bg-opacity-5 p-3 text-center rounded-2 mb-3 mt-auto border border-white border-opacity-10">
                                                <div className="text-white-50 small fw-medium">Justice Required</div>
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-danger w-100 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 py-2"
                                            onClick={(e) => handleReport(e, person)}
                                            style={{ letterSpacing: '1px', fontSize: '12px' }}
                                        >
                                            <EyeOff size={16} /> Report Sighting
                                        </button>
                                    </div>

                                    {/* Priority Badge */}
                                    {person.priority === 'CRITICAL' && (
                                        <div className="position-absolute top-0 end-0 mt-4 me-2">
                                            {/* mt-4 to clear the header bar */}
                                            <div className="badge bg-danger text-white shadow fw-bold animate-pulse rounded-1 text-uppercase border-white border">
                                                Critical
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredData.length === 0 && !loading && (
                    <div className="text-center py-5">
                        <div className="mb-3 text-secondary opacity-25">
                            <ShieldAlert size={64} />
                        </div>
                        <h4 className="text-white">No fugitives found</h4>
                        <p className="text-secondary">Try adjusting your filters or search query.</p>
                        <button onClick={() => { setFilterPriority('All'); setSearchQuery(''); }} className="btn btn-outline-light btn-sm mt-2">Reset Filters</button>
                    </div>
                )}
            </div>

            <DetailCanvas leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
        </main>
    );
}
