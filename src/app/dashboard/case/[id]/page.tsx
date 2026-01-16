"use client";

import React, { useState, useEffect } from 'react';
import { LeadCanvasDispatcher } from '@/components/LeadCanvasDispatcher';
import { OfficerActionFloatingBar } from '@/components/OfficerActionFloatingBar';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MessageSquare, Shield, CheckCircle, FileText, Pin, Star, Video, AlertCircle } from 'lucide-react';
import { COLORS } from '@/lib/theme';

export default function OfficerCaseView() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Safety Redirect
    useEffect(() => {
        if (!id) router.push('/dashboard');
    }, [id, router]);

    const [lead, setLead] = useState<any>(null);
    const [relatedReports, setRelatedReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTimelineTab, setActiveTimelineTab] = useState<'all' | 'anonymous' | 'confidential' | 'notes'>('all');

    const handleTogglePin = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${id}/pin`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRelatedReports(prev => prev.map(r => r.id === id ? { ...r, is_pinned: !r.is_pinned } : r));
            }
        } catch (e) {
            console.error("Pin error", e);
        }
    };

    const handleRate = async (id: string, rating: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${id}/rate`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });
            if (res.ok) {
                setRelatedReports(prev => prev.map(r => r.id === id ? { ...r, intelligence_rating: rating } : r));
            }
        } catch (e) {
            console.error("Rate error", e);
        }
    };

    const handleUpdateNotes = async (id: string, notes: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${id}/notes`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notes })
            });
            if (res.ok) {
                setRelatedReports(prev => prev.map(r => r.id === id ? { ...r, internal_notes: notes } : r));
            }
        } catch (e) {
            console.error("Notes error", e);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Master Lead
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                const data = await res.json();

                if (data && !data.error) {
                    setLead(data);

                    // 2. Fetch Related Reports (Relational Thread)
                    const searchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/internal-leads?parent_lead_id=${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const searchData = await searchRes.json();

                    if (Array.isArray(searchData)) {
                        const thread = searchData
                            .filter(l => l.id !== data.id)
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                        setRelatedReports(thread);
                    }
                }
            } catch (e) {
                console.error("Failed to load case data", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-50">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!lead) return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-muted">
            <AlertCircle size={48} className="mb-3 text-danger opacity-50" />
            <h4 className="fw-bold text-dark">Case Unavailable</h4>
            <p className="mb-4">The requested intelligence dossier (ID: {params.id}) could not be retrieved.</p>
            <button onClick={() => router.push('/dashboard')} className="btn btn-primary rounded-pill px-4 fw-bold">
                Return to Command Center
            </button>
        </div>
    );

    // Use dynamic height to fit within dashboard content area without double scrollbars
    // Dashboard header is approx 60-80px.
    const dummyAssets = [
        { file_path: 'http://localhost:5000/uploads/dummy_surveillance.png', file_type: 'image/png' },
        { file_path: 'http://localhost:5000/uploads/dummy_sketch.png', file_type: 'image/png' },
        { file_path: 'http://localhost:5000/uploads/dummy_plate.png', file_type: 'image/png' },
        { file_path: 'http://localhost:5000/uploads/dummy_cctv.png', file_type: 'image/png' },
        { file_path: 'http://localhost:5000/uploads/dummy_map.png', file_type: 'image/png' }
    ];

    const enrichedLead = { ...lead, media: [...(lead.media || []), ...dummyAssets] };

    const sortedReports = relatedReports
        .filter(report => {
            if (activeTimelineTab === 'anonymous') return report.is_anonymous;
            if (activeTimelineTab === 'confidential') return !report.is_anonymous;
            if (activeTimelineTab === 'notes') return true; // Show all to allow noting
            return true;
        })
        .sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    return (
        <div className="d-flex flex-column h-100 bg-slate-50 rounded-4 overflow-hidden shadow-sm border">

            {/* Minimal Officer Toolbar */}
            <div className="bg-white p-2 px-4 d-flex align-items-center justify-content-between border-bottom shrink-0">
                <div className="d-flex align-items-center gap-3">
                    <button onClick={() => router.back()} className="btn btn-sm btn-link text-dark rounded-circle p-2 d-flex align-items-center justify-content-center border-slate-200">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="vr bg-slate-200 my-2" style={{ height: '24px' }}></div>
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-black text-uppercase text-primary" style={{ fontSize: '12px', letterSpacing: '2px' }}>Satark Intel</span>
                            <span className="badge bg-slate-100 text-slate-500 font-monospace border fw-normal" style={{ fontSize: '10px' }}>{enrichedLead.token || 'ID: ' + enrichedLead.id}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm fw-bold d-flex align-items-center gap-2 rounded-3 px-3 shadow-sm border-0" style={{ fontSize: '11px' }}>
                        <CheckCircle size={14} /> Mark Resolved
                    </button>
                    <button className="btn btn-white btn-sm fw-bold rounded-3 px-3 border shadow-sm" style={{ fontSize: '11px' }}>
                        Export Dossier
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 d-flex overflow-hidden">

                {/* LEFT: MASTER RECORD (Reduced Footer, Embedded Card) */}
                <div className="w-50 border-end border-light h-100 position-relative d-flex flex-column bg-white">
                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                        <span className="small fw-bold text-muted text-uppercase tracking-wider d-flex align-items-center gap-2">
                            <Shield size={14} className="text-primary" /> Master Dossier
                        </span>
                    </div>
                    <div className="flex-grow-1 overflow-auto">
                        <LeadCanvasDispatcher lead={enrichedLead} className="h-100" />
                    </div>
                </div>

                {/* RIGHT: THREADED TIMELINE */}
                <div className="w-50 bg-slate-100 h-100 d-flex flex-column">
                    <div className="p-0 border-bottom bg-white shrink-0 shadow-sm z-10">
                        <div className="d-flex border-bottom px-4 pt-3 gap-4">
                            <h6 className="small fw-black text-uppercase tracking-widest text-dark mb-0 pb-3 border-bottom border-2 border-dark">Investigation Timeline</h6>
                            <h6 className="small fw-bold text-uppercase tracking-widest text-muted mb-0 opacity-50">Log Analytics</h6>
                        </div>
                        <div className="d-flex px-4 bg-white">
                            {[
                                { id: 'all', label: 'All Intel', count: relatedReports.length },
                                { id: 'anonymous', label: 'Anonymous', count: relatedReports.filter(r => r.is_anonymous).length },
                                { id: 'confidential', label: 'Confidential', count: relatedReports.filter(r => !r.is_anonymous).length },
                                { id: 'notes', label: 'Enquiry Notes', count: relatedReports.filter(r => r.internal_notes).length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTimelineTab(tab.id as any)}
                                    className={`py-2 px-3 border-0 bg-transparent small fw-bold text-uppercase transition-all border-bottom border-2 ${activeTimelineTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted'}`}
                                    style={{ fontSize: '10px', letterSpacing: '0.5px' }}
                                >
                                    {tab.label} <span className="ms-1 px-1 bg-light rounded text-dark border">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-grow-1 overflow-auto p-4 custom-scrollbar">

                        {/* Case Start Marker */}
                        <div className="d-flex gap-3 mb-5 position-relative">
                            <div className="d-flex flex-column align-items-center">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 z-10 border-4 border-white shadow-sm text-white" style={{ width: '40px', height: '40px', background: COLORS.navyBlue }}>
                                    <Shield size={18} />
                                </div>
                                <div className="vr h-100 my-n2 bg-slate-300" style={{ width: '2px' }}></div>
                            </div>
                            <div className="card shadow-sm border-0 w-100 p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)' }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className="small fw-black px-2 py-1 rounded-pill bg-dark text-white text-uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>Case Opened</span>
                                    <span className="badge bg-white text-muted border font-monospace" style={{ fontSize: '10px' }}>{enrichedLead.token}</span>
                                </div>
                                <h5 className="fw-black text-dark mb-1" style={{ fontFamily: 'Georgia, serif' }}>{enrichedLead.title}</h5>
                                <div className="small text-muted d-flex align-items-center gap-2">
                                    <Clock size={12} /> {new Date(enrichedLead.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Threaded Items */}
                        {sortedReports.length > 0 ? sortedReports.map((report, idx) => {
                            const photos = report.media?.filter((m: any) => (m.file_type || '').toUpperCase().includes('IMAGE')) || [];
                            const videos = report.media?.filter((m: any) => (m.file_type || '').toUpperCase().includes('VIDEO')) || [];
                            const docs = report.media?.filter((m: any) => (m.file_type || '').toUpperCase().includes('DOCUMENT') || (m.file_type || '').toUpperCase().includes('PDF')) || [];

                            return (
                                <div key={idx} className="d-flex gap-3 mb-5 position-relative">
                                    <div className="d-flex flex-column align-items-center">
                                        <div className={`rounded-circle text-white d-flex align-items-center justify-content-center flex-shrink-0 z-10 border-4 border-white shadow-sm ${report.is_pinned ? 'bg-danger' : 'bg-warning'}`} style={{ width: '40px', height: '40px' }}>
                                            {report.is_pinned ? <Pin size={18} /> : <MessageSquare size={18} />}
                                        </div>
                                        <div className="vr h-100 my-n2 bg-slate-300" style={{ width: '2px' }}></div>
                                    </div>

                                    <div className={`card border-0 shadow-sm w-100 overflow-hidden rounded-4 hover-shadow transition-all ${report.is_pinned ? 'border-primary border-opacity-25' : ''}`} style={{ border: report.is_pinned ? '1px solid currentColor' : 'none' }}>
                                        {/* Status Header - Minimal (Removed blue) */}
                                        <div className={`p-3 px-4 d-flex justify-content-between align-items-center border-bottom bg-white`}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`rounded-circle p-1.5 ${report.is_anonymous ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
                                                    {report.is_anonymous ? <Shield size={12} /> : <CheckCircle size={12} />}
                                                </div>
                                                <div>
                                                    <div className={`fw-black small text-uppercase ls-1 ${report.is_anonymous ? 'text-secondary' : 'text-primary'}`} style={{ fontSize: '10px' }}>
                                                        {report.is_anonymous ? 'Anonymous Intelligence' : 'Confidential Report'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    onClick={() => handleTogglePin(report.id)}
                                                    className={`btn btn-sm p-1 rounded-circle transition-all ${report.is_pinned ? 'bg-danger text-white shadow-sm' : 'bg-white text-muted border shadow-sm'}`}
                                                >
                                                    <Pin size={14} className={report.is_pinned ? '' : 'rotate-45'} />
                                                </button>
                                                <span className="badge bg-white text-muted border font-monospace shadow-sm" style={{ fontSize: '10px' }}>{report.token}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 pt-3 bg-white">
                                            {/* Quality Rating */}
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div className="d-flex align-items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            onClick={() => handleRate(report.id, star)}
                                                            className={`btn btn-link p-0 text-decoration-none transition-all ${star <= (report.intelligence_rating || 0) ? 'text-warning' : 'text-slate-200'}`}
                                                        >
                                                            <Star size={14} fill={star <= (report.intelligence_rating || 0) ? 'currentColor' : 'none'} />
                                                        </button>
                                                    ))}
                                                    <span className="ms-2 x-small fw-bold text-muted text-uppercase" style={{ fontSize: '8px', letterSpacing: '1px' }}>Verify Quality</span>
                                                </div>
                                                <div className="small text-muted d-flex align-items-center gap-2" style={{ fontSize: '10px' }}>
                                                    <Clock size={12} /> {new Date(report.created_at).toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <p className="text-dark mb-4 fw-medium" style={{ lineHeight: '1.7', fontSize: '14.5px' }}>{report.description}</p>

                                            {/* Media Grid - Fixed thumbnails */}
                                            {(photos.length > 0 || videos.length > 0 || docs.length > 0) && (
                                                <div className="mb-4 bg-slate-50 p-3 rounded-4 border border-light shadow-inner">
                                                    <h6 className="x-small fw-black text-muted text-uppercase mb-3 ls-1 opacity-75" style={{ fontSize: '9px' }}>Supporting Evidence ({photos.length + videos.length + docs.length})</h6>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        {photos.map((item: any, i: number) => (
                                                            <div key={i} className="rounded-4 border-2 border-white overflow-hidden bg-white shadow-sm flex-shrink-0" style={{ width: '120px', height: '80px' }}>
                                                                <img
                                                                    src={item.file_path}
                                                                    className="w-100 h-100 object-fit-cover cursor-pointer hover-scale transition-all"
                                                                    onError={(e) => {
                                                                        console.log('Img failed to load:', item.file_path);
                                                                        (e.target as any).src = 'https://placehold.co/400x300?text=Scan+Evidence';
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                        {videos.map((item: any, i: number) => (
                                                            <div key={i} className="rounded-4 border-2 border-white bg-dark d-flex align-items-center justify-content-center text-white cursor-pointer shadow-sm flex-shrink-0" style={{ width: '120px', height: '80px' }}>
                                                                <Video size={24} className="opacity-75" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Enquiry Notes - Conditional based on Tab */}
                                            {(activeTimelineTab === 'notes' || report.internal_notes) && (
                                                <div className="p-3 rounded-4 border border-success border-opacity-10 shadow-sm" style={{ background: 'rgba(25, 135, 84, 0.02)' }}>
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <div className="p-1 rounded bg-success text-white shadow-sm">
                                                            <FileText size={10} />
                                                        </div>
                                                        <h6 className="mb-0 fw-black text-success text-uppercase ls-1" style={{ fontSize: '9px' }}>Green Noting - Case Enquiry</h6>
                                                    </div>
                                                    <textarea
                                                        defaultValue={report.internal_notes || ''}
                                                        onBlur={(e) => handleUpdateNotes(report.id, e.target.value)}
                                                        placeholder="Enter internal verification logs, SHO remarks, or field investigation status..."
                                                        className="form-control form-control-sm bg-transparent border-0 p-0 text-success fw-medium custom-placeholder"
                                                        style={{ fontSize: '13px', minHeight: '80px', boxShadow: 'none', resize: 'none', color: '#14532D' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-5 text-center opacity-50">
                                <Clock size={40} className="mb-3 mx-auto text-muted" />
                                <p className="small text-muted fst-italic">No intelligence reports matching this filter.</p>
                            </div>
                        )}

                        <div className="d-flex justify-content-center py-5">
                            <span className="rounded-circle bg-slate-200" style={{ width: '8px', height: '8px' }}></span>
                        </div>

                    </div>
                </div>

            </div>

            {/* Floating Officer Action Bar */}
            <OfficerActionFloatingBar lead={enrichedLead} />

            <style jsx>{`
                .ls-1 { letter-spacing: 0.1em; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 11px; }
                .hover-shadow:hover { box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.05); }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
                .rotate-45 { transform: rotate(45deg); }
                .custom-placeholder::placeholder { color: rgba(25, 135, 84, 0.4); font-style: italic; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
            `}</style>
        </div>
    );
}
