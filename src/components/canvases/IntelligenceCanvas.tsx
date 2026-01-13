import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import {
    FileText, Shield, MapPin, Calendar, Clock, Lock,
    Eye, CheckCircle, HelpCircle, Search, Printer,
    AlertTriangle, Siren, Info
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

interface IntelligenceCanvasProps {
    data: any;
}

export const IntelligenceCanvas: React.FC<IntelligenceCanvasProps> = ({ data }) => {
    const router = useRouter();
    const printRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false, ignoreElements: (element) => element.id === 'no-print-footer' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const ratio = Math.min(pdf.internal.pageSize.getWidth() / canvas.width, pdf.internal.pageSize.getHeight() / canvas.height);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
            pdf.save(`INTEL-${data.token}.pdf`);
        } catch (error) { console.error("PDF Error", error); }
    };

    const details = useMemo(() => {
        try { return typeof data.details === 'string' ? JSON.parse(data.details) : data.details || {}; }
        catch { return {}; }
    }, [data]);

    const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'analysis'>('details');
    const [imgError, setImgError] = useState(false);
    const mediaItems = data.media || [];
    const photoUrl = (!imgError && data.image_url) ? data.image_url :
        (mediaItems.find((m: any) => m.file_type?.toLowerCase().includes('image'))?.file_path || null);

    const isPoliceRequest = data.status === 'INFO_SEEKING';
    const status = data.status || 'SUBMITTED';

    return (
        <div ref={printRef} className="bg-white h-100 d-flex flex-column font-sans text-dark">
            {/* ... (Header remains same, skipping for brevity in replacement, focusing on content) */}

            {/* HEADER - DARK BLUE TO WINE RED GRADIENT */}
            <div className="text-white px-4 py-3 d-flex align-items-center justify-content-between shadow-sm position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #3e0c1b 100%)', // Slate-900 to Wine Red
                    borderBottom: '4px solid #b91c1c' // Red-700
                }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)' }} />

                <div className="d-flex align-items-center gap-3 z-10">
                    <div className="bg-white/10 p-2 rounded-1 border border-white/20">
                        {isPoliceRequest ? <HelpCircle size={24} /> : <Shield size={24} />}
                    </div>
                    <div>
                        <h2 className="mb-0 fw-black text-uppercase ls-1 fs-5">
                            {isPoliceRequest ? 'REQUEST FOR ASSISTANCE' : 'INTELLIGENCE RECORD'}
                        </h2>
                        <span className="badge bg-white/20 text-white border border-white/30 fw-bold font-monospace py-1 mt-1 backdrop-blur-sm">
                            #{data.token || 'UNKNOWN'}
                        </span>
                    </div>
                </div>
                <div className="z-10 d-flex align-items-center gap-3">
                    <span className="badge bg-danger text-white rounded-pill fw-bold text-uppercase px-3 py-2 shadow-sm border border-white/20">
                        {data.priority || 'NORMAL'} PRIORITY
                    </span>
                    <button onClick={handleDownloadPDF} className="btn btn-sm btn-outline-light border-white/30 hover:bg-white/10"><Printer size={16} /></button>
                </div>
            </div>

            {/* CONTEXT STRIP */}
            <div className="bg-slate-100 border-bottom d-flex align-items-center gap-4 px-4 py-2 text-uppercase fw-bold x-small text-secondary fw-bold ls-1">
                <div className="d-flex align-items-center gap-1 text-dark">
                    <Calendar size={14} className="text-secondary" />
                    {details.incident_date ? new Date(details.incident_date).toLocaleDateString() : new Date(data.created_at).toLocaleDateString()}
                </div>
                <div className="d-flex align-items-center gap-1 text-dark">
                    <Clock size={14} className="text-secondary" />
                    {details.incident_time || new Date(data.created_at).toLocaleTimeString()}
                </div>
                <div className="d-flex align-items-center gap-1 text-dark">
                    <MapPin size={14} className="text-secondary" />
                    {details.location || details.incident_location || 'Location Not Specified'}
                </div>
                <div className="ms-auto d-flex align-items-center gap-1 text-primary">
                    <Lock size={14} />
                    {data.is_public ? 'PUBLIC RECORD' : 'CONFIDENTIAL / OFFICIAL USE ONLY'}
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex-grow-1 overflow-y-auto bg-slate-50 p-4 has-cool-scrollbar">
                <div className="row g-4 h-100">
                    {/* LEFT: VISUAL / QUICK INFO */}
                    <div className="col-lg-4">
                        <div className="bg-white p-3 border rounded shadow-sm h-100 d-flex flex-column">
                            <div className="ratio ratio-4x3 bg-slate-900 border mb-3 position-relative overflow-hidden rounded-1">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        className="object-fit-cover w-100 h-100 opacity-90"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center text-white/30 flex-column h-100 w-100">
                                        <div className="border border-white/20 rounded-circle p-3 mb-2">
                                            <Search size={32} />
                                        </div>
                                        <span className="x-small text-uppercase fw-bold ls-1">No Visual Evidence</span>
                                    </div>
                                )}
                                <div className="position-absolute bottom-0 w-100 bg-gradient-to-t from-black/80 to-transparent p-3 pt-5">
                                    <div className="text-white fw-bold text-uppercase x-small ls-1">
                                        {details.category || 'General Intel'}
                                    </div>
                                </div>
                            </div>

                            <h5 className="fw-black text-dark text-uppercase mb-2 lh-sm border-bottom pb-2">
                                {data.title}
                            </h5>

                            {/* Reward Box if applicable */}
                            {(data.reward_amount || details.reward_amount) && (
                                <div className="bg-warning bg-opacity-10 border border-warning rounded-2 p-3 text-center mb-3 position-relative overflow-hidden">
                                    <div className="x-small text-uppercase text-dark fw-bold mb-1 d-flex align-items-center justify-content-center gap-1">
                                        <Shield size={14} className="text-warning-emphasis" /> CASH REWARD
                                    </div>
                                    <div className="fw-black text-danger-emphasis lh-1 font-monospace fs-4">
                                        {data.reward_amount ? (data.reward_amount.startsWith('₹') ? '' : '₹') + data.reward_amount : details.reward_amount}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto">
                                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                    <h6 className="fw-bold text-uppercase x-small mb-2 text-slate-500">Source Reliability</h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                                        </div>
                                        <span className="x-small fw-bold text-dark">B-2</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <div className="bg-white p-1 d-inline-block rounded border shadow-sm">
                                        <QRCode
                                            size={80}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={`https://satark.delhipolice.gov.in/intel/${data.token || data.id}`}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <div className="x-small text-muted mt-1 fw-bold">SCAN REF</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DETAILED TABS */}
                    <div className="col-lg-8">
                        <div className="bg-white border rounded shadow-sm h-100 d-flex flex-column">
                            {/* TABS */}
                            <div className="d-flex border-bottom bg-slate-50">
                                {['details', 'evidence', 'analysis'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`flex-grow-1 py-3 px-3 fw-bold text-uppercase x-small ls-1 border-0 border-end transition-all ${activeTab === tab ? 'bg-white text-primary border-bottom-0 shadow-sm' : 'bg-transparent text-muted hover-bg-slate-100'
                                            }`}
                                        style={{ borderBottom: activeTab === tab ? '3px solid white' : '1px solid #e2e8f0' }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* TAB CONTENT */}
                            <div className="p-4 flex-grow-1 overflow-y-auto has-cool-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'details' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <h6 className="fw-bold text-secondary text-uppercase x-small ls-1 mb-2">Incident Narrative</h6>
                                            <p className="text-dark lead fs-6 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                                                {details.narrative || details.description || data.description || "No narrative provided."}
                                            </p>

                                            {(details.suspect_details || details.vehicle_details) && (
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-slate-50 border rounded h-100">
                                                            <h6 className="fw-bold text-secondary text-uppercase x-small ls-1 mb-2">Subject / Suspect</h6>
                                                            <p className="mb-0 small fw-medium text-dark">{details.suspect_details || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-slate-50 border rounded h-100">
                                                            <h6 className="fw-bold text-secondary text-uppercase x-small ls-1 mb-2">Vehicle Info</h6>
                                                            <p className="mb-0 small fw-medium text-dark">{details.vehicle_details || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                    {activeTab === 'evidence' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div className="text-center py-5 text-muted bg-light border border-dashed rounded-3">
                                                <FileText size={48} className="mb-2 opacity-50" />
                                                <p className="mb-0 fw-bold">Additional Media Attachments</p>
                                                <small>Photos, Videos, and Documents attached to this record.</small>
                                            </div>
                                        </motion.div>
                                    )}
                                    {activeTab === 'analysis' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div className="alert alert-warning border-warning d-flex align-items-center gap-3">
                                                <AlertTriangle size={20} />
                                                <div>
                                                    <div className="fw-bold text-uppercase x-small">Analyst Note</div>
                                                    <div className="small">Pending final review by sector supervisor.</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div id="no-print-footer" className="p-3 bg-white border-top shadow d-flex justify-content-center">
                <button
                    onClick={() => router.push(`/report?ref=${data.id}`)}
                    className="btn btn-dark btn-lg rounded-pill px-5 fw-bold text-uppercase shadow-sm d-flex align-items-center gap-2"
                >
                    {isPoliceRequest ? <CheckCircle size={20} /> : <Info size={20} />}
                    {isPoliceRequest ? 'Provide Information' : 'Add Follow-up'}
                </button>
            </div>
        </div>
    );
};
