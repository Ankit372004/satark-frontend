
import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import {
    FileText, User, MapPin, Calendar, Clock, Lock,
    Eye, Heart, Search, Printer, AlertCircle, Phone, Info,
    X, ImageIcon, File, Shield, Flag, Video, FileCheck, AlertTriangle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

interface MissingPersonCanvasProps {
    data: any;
}

export const MissingPersonCanvas: React.FC<MissingPersonCanvasProps> = ({ data }) => {
    const router = useRouter();
    const printRef = React.useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'dossier' | 'surveillance' | 'docs'>('dossier');

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                ignoreElements: (element) => element.id === 'no-print-footer'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const ratio = Math.min(pdf.internal.pageSize.getWidth() / canvas.width, pdf.internal.pageSize.getHeight() / canvas.height);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
            pdf.save(`MISSING - ${data.token || 'appeal'}.pdf`);
        } catch (error) { console.error("PDF Error", error); }
    };

    const details = useMemo(() => {
        try { return typeof data.details === 'string' ? JSON.parse(data.details) : data.details || {}; }
        catch { return {}; }
    }, [data]);

    const photoUrl = data.image_url || null;
    const mediaItems = data.media || [];

    const DetailItem = ({ label, value, fullWidth = false, className = "" }: { label: string, value: string | undefined, fullWidth?: boolean, className?: string }) => (
        <div className={`${fullWidth ? 'col-12' : 'col-6'} mb - 3 ${className} `}>
            <div className="text-uppercase x-small text-secondary fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{label}</div>
            <div className="fw-bold text-dark border-bottom border-light-subtle pb-1" style={{ minHeight: '24px', fontSize: '0.95rem' }}>{value || <span className="text-muted fw-normal fst-italic">N/A</span>}</div>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="d-flex align-items-center gap-2 mb-3 mt-4 border-bottom border-black pb-2">
            <Icon size={18} className="text-dark" />
            <h6 className="mb-0 fw-black text-uppercase ls-1">{title}</h6>
        </div>
    );

    return (
        <div ref={printRef} className="bg-slate-100 h-100 d-flex flex-column font-sans text-dark overflow-hidden position-relative has-cool-scrollbar">

            {/* 1. TOP HEADER - YELLOW */}
            <div className="px-4 py-3 d-flex align-items-center justify-content-between position-relative shadow-sm z-20" style={{ backgroundColor: '#FFD700' }}>
                <div className="d-flex align-items-center gap-3">
                    <img src="/assets/delhi-police-logo.png" alt="Logo" style={{ height: '48px' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <div className="lh-1">
                        <h1 className="mb-0 fw-black text-uppercase ls-1 fs-3">MISSING APPEAL</h1>
                        <div className="fw-bold text-uppercase ls-2 x-small opacity-75">BY DELHI POLICE</div>
                    </div>
                </div>
                <button className="btn btn-dark rounded-circle p-1" id="no-print-footer" style={{ width: '32px', height: '32px' }} onClick={() => router.back()}>
                    <X size={20} />
                </button>
            </div>

            {/* 2. NAVIGATION BAR - BLACK */}
            <div className="bg-dark text-white d-flex align-items-center justify-content-center border-bottom border-light shadow-sm z-10 px-2 overflow-x-auto no-scrollbar">
                <div className="d-flex" style={{ minWidth: 'fit-content' }}>
                    <button
                        onClick={() => setActiveTab('dossier')}
                        className={`btn rounded - 0 py - 3 px - 4 d - flex align - items - center gap - 2 fw - bold text - uppercase x - small ls - 1 border - end border - secondary border - opacity - 25 transition - all ${activeTab === 'dossier' ? 'bg-warning text-dark' : 'text-white hover-bg-light-10'} `}
                    >
                        <User size={16} /> OFFICIAL DOSSIER
                    </button>
                    <button
                        onClick={() => setActiveTab('surveillance')}
                        className={`btn rounded - 0 py - 3 px - 4 d - flex align - items - center gap - 2 fw - bold text - uppercase x - small ls - 1 border - end border - secondary border - opacity - 25 transition - all ${activeTab === 'surveillance' ? 'bg-warning text-dark' : 'text-white opacity-75 hover-opacity-100'} `}
                    >
                        <Video size={16} /> CCTV FOOTAGE
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`btn rounded - 0 py - 3 px - 4 d - flex align - items - center gap - 2 fw - bold text - uppercase x - small ls - 1 border - end border - secondary border - opacity - 25 transition - all ${activeTab === 'docs' ? 'bg-warning text-dark' : 'text-white opacity-75 hover-opacity-100'} `}
                    >
                        <FileCheck size={16} /> LEGAL DOCS
                    </button>
                </div>
            </div>

            {/* 3. ALERT BAR - RED */}
            <div className="bg-danger text-white text-center py-2 fw-bold text-uppercase ls-1 d-flex align-items-center justify-content-center gap-2 shadow-sm z-10">
                <AlertTriangle size={18} className="fill-white text-danger" />
                <span>URGENT • MISSING PERSON • {details.district ? `${details.district} DISTRICT` : 'UNKNOWN DISTRICT'}</span>
            </div>

            {/* 4. MAIN CONTENT */}
            <div className="flex-grow-1 overflow-y-auto p-4 bg-slate-100">
                <div className="container bg-white shadow-lg h-100 p-0 overflow-hidden d-flex flex-column" style={{ maxWidth: '1000px', borderRadius: '4px' }}>

                    <AnimatePresence mode="wait">
                        {activeTab === 'dossier' ? (
                            <motion.div
                                key="dossier"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="row g-0 flex-grow-1"
                            >
                                {/* LEFT COLUMN */}
                                <div className="col-lg-5 border-end border-light-subtle p-4 d-flex flex-column align-items-center text-center bg-white">

                                    {/* Photo */}
                                    <div className="p-1 border border-secondary mb-4 w-75 shadow-sm bg-white" style={{ transform: 'rotate(-1deg)' }}>
                                        <div className="ratio ratio-1x1 bg-slate-100 overflow-hidden">
                                            {photoUrl ? (
                                                <img src={photoUrl} className="object-fit-cover w-100 h-100" alt="Missing" />
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center h-100 text-muted flex-column">
                                                    <User size={64} className="opacity-25 mb-2" />
                                                    <span className="fw-bold x-small text-uppercase">NO PHOTO</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h2 className="fw-black text-uppercase lh-1 mb-2 display-6">{details.name || 'UNKNOWN'}</h2>

                                    <div className="bg-danger text-white rounded-pill px-3 py-1 fw-bold text-uppercase x-small mb-4 ls-1">
                                        MISSING SINCE {details.missing_date || 'N/A'}
                                    </div>

                                    {/* Grid Stats */}
                                    <div className="container-fluid px-0 mb-4">
                                        <div className="row g-0 border border-dark">
                                            <div className="col-6 border-end border-bottom border-dark p-2">
                                                <div className="x-small text-uppercase text-muted fw-bold">AGE</div>
                                                <div className="fs-5 fw-black">{details.age || 'N/A'}</div>
                                            </div>
                                            <div className="col-6 border-bottom border-dark p-2">
                                                <div className="x-small text-uppercase text-muted fw-bold">SEX</div>
                                                <div className="fs-5 fw-black">{details.sex || 'N/A'}</div>
                                            </div>
                                            <div className="col-6 border-end border-dark p-2">
                                                <div className="x-small text-uppercase text-muted fw-bold">HEIGHT</div>
                                                <div className="fs-5 fw-black">{details.height || 'N/A'}</div>
                                            </div>
                                            <div className="col-6 p-2">
                                                <div className="x-small text-uppercase text-muted fw-bold">BUILD</div>
                                                <div className="fs-5 fw-black">{details.build || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="mt-auto pt-4 border-top w-100">
                                        <div className="bg-white p-2 d-inline-block border border-dark rounded-0">
                                            <QRCode
                                                value={`https://satark.delhipolice.gov.in/missing/${data.token || data.id}`}
                                                size={100}
                                                fgColor="#000000"
                                                bgColor="#FFFFFF"
                                            />
                                        </div >
                                        <div className="x-small fw-bold text-uppercase mt-2 text-muted">SCAN FOR DIGITAL INFO</div>
                                    </div >

                                </div >

                                {/* RIGHT COLUMN */}
                                < div className="col-lg-7 p-4 bg-white" >

                                    {/* Location Card */}
                                    < div className="card border rounded-0 shadow-none mb-4 bg-light" >
                                        <div className="card-body p-3 d-flex align-items-start gap-3">
                                            <div className="bg-white p-2 border rounded-circle shadow-sm text-danger">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <div className="x-small fw-bold text-uppercase text-muted mb-1">LAST KNOWN LOCATION</div>
                                                <h5 className="fw-bold mb-1 text-dark">{details.missing_from || details.location || 'Unknown Location'}</h5>
                                                <div className="x-small text-muted">
                                                    Confirmed on {details.missing_date || 'Unknown Date'} • {details.missing_time || 'Time N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div >

                                    {/* Physical Description */}
                                    < SectionHeader icon={Info} title="PHYSICAL DESCRIPTION" />
                                    <div className="row mb-4">
                                        <DetailItem label="Complexion" value={details.complexion} />
                                        <DetailItem label="Hair Color" value={details.hair || details.hair_color} />
                                        <DetailItem label="Eye Color" value={details.eyes || details.eye_color} />
                                        <DetailItem label="Face Shape" value={details.face_shape} />
                                        <DetailItem label="Clothing (Last Seen)" value={details.dress_description || details.clothing} fullWidth />
                                    </div>

                                    {/* Marks */}
                                    <div className="mb-4">
                                        <div className="text-uppercase x-small text-danger fw-bold mb-1 border-bottom border-danger-subtle pb-1 w-100">
                                            DISTINGUISHING MARKS / SCARS
                                        </div>
                                        <div className="fw-bold text-dark fs-6 mt-2">
                                            {details.identifying_marks || details.scars_marks || 'None listed'}
                                        </div>
                                    </div>

                                    {/* Investigative Details */}
                                    <SectionHeader icon={FileText} title="INVESTIGATIVE DETAILS" />
                                    <div className="mb-3">
                                        <div className="text-uppercase x-small text-secondary fw-bold mb-1">ITEMS CARRYING</div>
                                        <div className="fw-medium text-dark">{details.items_carried || details.belongings || 'None listed.'}</div>
                                    </div>
                                    {
                                        details.guardian_name && (
                                            <div className="mb-3">
                                                <div className="text-uppercase x-small text-secondary fw-bold mb-1">GUARDIAN / CONTACT</div>
                                                <div className="fw-medium text-dark">
                                                    {details.guardian_name} ({details.relationship_to_guardian}) - {details.guardian_contact}
                                                </div>
                                            </div>
                                        )
                                    }

                                </div >
                            </motion.div >
                        ) : (
                            <motion.div
                                key="other"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="d-flex align-items-center justify-content-center h-100 bg-light flex-column text-muted p-5"
                            >
                                <Video size={48} className="mb-3 opacity-25" />
                                <h5 className="fw-bold text-uppercase">ACCESS RESTRICTED</h5>
                                <p className="text-center small" style={{ maxWidth: '300px' }}>
                                    Additional surveillance footage and legal documents are currently restricted to authorized personnel only.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence >

                </div >
            </div >

            {/* 5. STICKY FOOTER CTA */}
            < div id="no-print-footer" className="p-0 border-top shadow position-sticky bottom-0 z-50" >
                <button
                    onClick={() => router.push(`/report?ref=${data.id}`)}
                    className="btn btn-danger w-100 rounded-0 py-3 fw-black text-uppercase fs-5 d-flex align-items-center justify-content-center gap-2 hover-brightness"
                    style={{ letterSpacing: '1px' }}
                >
                    <Phone size={24} className="fill-white" /> HAVE YOU SEEN THIS PERSON?
                </button>
            </div >

            <style jsx global>{`
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .hover-bg-light-10:hover { background-color: rgba(255,255,255,0.1); }
                .has-cool-scrollbar::-webkit-scrollbar { width: 6px; }
                .has-cool-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            `}</style>
        </div >
    );
};

