"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Grid, List, Filter, ChevronRight, EyeOff, ShieldAlert, Award } from 'lucide-react';
import { DetailCanvas } from '@/components/DetailCanvas'; // UNIFIED CANVAS
import { WantedPerson } from '@/lib/types';
import LeftSidebar from '@/components/LeftSidebar';
import { useRouter } from 'next/navigation';

export default function MissingPersonsPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedLeadId, setSelectedLeadId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [leads, setLeads] = useState<any[]>([]); // simplified type
    const [loading, setLoading] = useState(true);

    // Fetch Leads
    React.useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads?limit=50`);
                const data = await res.json();

                const mappedData = data
                    .filter((l: any) => l.status === 'MISSING' || l.notice_type === 'missing_person')
                    .map((l: any) => {
                        let details: any = {};
                        try { details = typeof l.details === 'string' ? JSON.parse(l.details) : l.details; } catch (e) { }

                        // Use real image/reward
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
        const matchesPriority = filterPriority === 'All' || person.priority === filterPriority || person.risk === filterPriority;
        const matchesCategory = activeCategory ? person.category === activeCategory : true;

        return matchesSearch && matchesPriority && matchesCategory;
    });

    const handleReport = (e: React.MouseEvent, person: any) => {
        e.stopPropagation();
        router.push(`/report?mode=anonymous&ref=${person.id}&title=${encodeURIComponent(person.title)}`);
    };

    return (
        <main className="min-vh-100" style={{ background: GRADIENTS.bg }}>
            <Header />

            <div className="container-fluid py-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
                <div className="row g-4">
                    {/* LEFT SIDEBAR - Navigation */}
                    <div className="col-lg-2 pe-lg-4 border-end-lg-0 d-none d-lg-block">
                        <LeftSidebar
                            activeTab="most-wanted"
                            onTabChange={() => { }}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                            activeJurisdiction={null}
                            onJurisdictionChange={() => { }}
                        />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="col-lg-10 px-lg-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-end align-items-md-center mb-4 gap-3">
                            <div>
                                <h1 className="display-5 fw-bold mb-1" style={{ color: COLORS.navyBlue }}>Missing Persons Index</h1>
                                <p className="text-muted mb-0">Help us locate missing citizens. Confidential reporting available.</p>
                            </div>

                            <div className="d-flex gap-2 flex-wrap">
                                {/* Search Bar */}
                                <div className="position-relative">
                                    <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search fugitives..."
                                        className="form-control ps-5 rounded-pill border-0 shadow-sm"
                                        style={{ width: '250px' }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* View Toggles */}
                                <div className="d-flex gap-1 bg-white p-1 rounded-pill shadow-sm">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`btn btn-sm rounded-circle p-2 ${viewMode === 'grid' ? 'btn-dark' : 'btn-light text-muted'}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`btn btn-sm rounded-circle p-2 ${viewMode === 'list' ? 'btn-dark' : 'btn-light text-muted'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="mb-4 d-flex gap-2 overflow-auto pb-2">
                            {['All', 'CRITICAL', 'HIGH', 'EXTREME'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterPriority(cat)}
                                    className={`btn btn-sm rounded-pill fw-bold px-3 ${filterPriority === cat ? 'btn-danger text-white' : 'btn-white border shadow-sm text-muted'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Active Category Indicator */}
                        {activeCategory && (
                            <div className="mb-3">
                                <span className="badge bg-primary rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2">
                                    Category: {activeCategory.toUpperCase()}
                                    <button onClick={() => setActiveCategory(null)} className="btn btn-link p-0 text-white"><EyeOff size={14} /></button>
                                </span>
                            </div>
                        )}

                        <div className={viewMode === 'grid' ? 'row g-3' : 'd-flex flex-column gap-3'}>
                            <AnimatePresence>
                                {filteredData.map((person) => (
                                    <div key={person.id} className={viewMode === 'grid' ? 'col-6 col-md-4 col-lg-3 col-xl-2.5' : 'w-100'}>
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                            onClick={() => setSelectedLeadId(person.id)}
                                            className="card border-0 overflow-hidden cursor-pointer h-100"
                                            style={{
                                                borderRadius: '16px',
                                                background: 'white',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                                border: '1px solid rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {/* Risk Badge with Modern Look */}
                                            <div className="position-absolute top-0 start-0 m-2 z-1">
                                                <span className={`badge border border-white shadow-sm fw-bold rounded-pill px-3 py-1 ${person.risk === 'EXTREME' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                    {person.risk}
                                                </span>
                                            </div>

                                            <div className={viewMode === 'grid' ? 'p-3 d-flex flex-column h-100' : 'd-flex p-3 gap-3 align-items-center'}>
                                                <div className="mx-auto rounded-circle shadow-sm overflow-hidden border border-2 border-white position-relative" style={{ width: viewMode === 'grid' ? '120px' : '80px', height: viewMode === 'grid' ? '120px' : '80px' }}>
                                                    <img
                                                        src={person.image}
                                                        className="w-100 h-100 object-fit-cover"
                                                        style={{ transform: 'scale(1.1)' }}
                                                    />
                                                </div>

                                                <div className="mt-3 text-center flex-grow-1" style={{ textAlign: viewMode === 'grid' ? 'center' : 'left' }}>

                                                    <h6 className="fw-bold mb-1 text-dark text-uppercase text-truncate" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>{person.name}</h6>
                                                    <p className="text-muted mb-3 fw-medium small" style={{ fontSize: '11px' }}>{person.alias}</p>

                                                    {person.reward && (
                                                        <div className="badge rounded-pill mb-3 py-2 px-3 text-dark fw-bold border border-white shadow-sm w-100" style={{
                                                            background: `linear-gradient(135deg, ${COLORS.golden} 0%, #FF8C00 100%)`,
                                                            fontSize: '11px',
                                                            textShadow: '0 1px 2px rgba(255,255,255,0.4)',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            <Award size={12} className="me-1 mb-1" />
                                                            CASH BOUNTY: {person.reward}
                                                        </div>
                                                    )}

                                                    <p className="text-secondary mb-3 d-flex align-items-center justify-content-center gap-1 small" style={{ fontSize: '11px' }}>
                                                        <MapPin size={12} /> {person.location}
                                                    </p>

                                                    {/* Card Actions */}
                                                    <div className="d-grid gap-2">
                                                        <button
                                                            onClick={(e) => handleReport(e, person)}
                                                            className="btn btn-sm btn-light border-0 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                                                            style={{ fontSize: '11px', background: '#f8f9fa' }}
                                                        >
                                                            <EyeOff size={12} /> Report Sighting
                                                        </button>
                                                    </div>
                                                </div>

                                                {viewMode === 'list' && (
                                                    <div className="ms-auto pe-3 text-muted">
                                                        <ChevronRight />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </AnimatePresence>
                            {filteredData.length === 0 && (
                                <div className="text-center py-5 text-muted">
                                    <p>No fugitives found matching the criteria.</p>
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearchQuery(''); setFilterPriority('All'); setActiveCategory(null); }}>Clear Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DetailCanvas leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
        </main>
    );
}
