import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import {
    FileText, Shield, MapPin, Calendar, Clock, Lock,
    Eye, CheckCircle, Search, Printer, Siren, AlertTriangle, Scale, Target,
    Image as ImageIcon, Video, File, X, Info, Award, Flag, User, FileWarning
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

interface WantedPersonCanvasProps {
    data: any;
}

export const WantedPersonCanvas: React.FC<WantedPersonCanvasProps> = ({ data }) => {
    const router = useRouter();
    const printRef = React.useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'evidence'>('details');

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false, ignoreElements: (el) => el.id === 'no-print-footer' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const ratio = Math.min(pdf.internal.pageSize.getWidth() / canvas.width, pdf.internal.pageSize.getHeight() / canvas.height);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
            pdf.save(`FUGITIVE-${data.token}.pdf`);
        } catch (error) { console.error("PDF Error", error); }
    };

    const details = useMemo(() => {
        try { return typeof data.details === 'string' ? JSON.parse(data.details) : data.details || {}; }
        catch { return {}; }
    }, [data]);

    const mediaItems = data.media || [];
    const [imgError, setImgError] = useState(false);

    // Use data.image_url if available and not errored, otherwise try to find first image in media (case insensitive), otherwise null
    const photoUrl = (!imgError && data.image_url) ? data.image_url :
        (mediaItems.find((m: any) => m.file_type?.toLowerCase().includes('image'))?.file_path || null);

    const DetailItem = ({ label, value, fullWidth = false, className = "" }: { label: string, value: string | undefined, fullWidth?: boolean, className?: string }) => (
        <div className={`${fullWidth ? 'col-12' : 'col-6 col-md-4'} mb-3 ${className}`}>
            <div className="text-uppercase x-small text-secondary fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{label}</div>
            <div className="fw-bold text-dark border-bottom pb-1" style={{ minHeight: '24px' }}>{value || <span className="text-muted fw-normal fst-italic">--</span>}</div>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="d-flex align-items-center gap-2 mb-3 mt-4 border-bottom border-2 border-dark pb-2">
            <div className="bg-dark text-white p-1 rounded-1">
                <Icon size={16} />
            </div>
            <h6 className="mb-0 fw-black text-uppercase ls-1">{title}</h6>
        </div>
    );

    return (
        <div ref={printRef} className="bg-white vh-100 d-flex flex-column font-sans text-dark overflow-hidden position-relative has-cool-scrollbar">

            {/* 1. HEADER - RED BRANDING */}
            <div className="bg-danger pt-3 pb-0 shadow-sm position-relative print-header">
                {/* Close Button */}
                <button className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-3 z-20 p-1" id="no-print-footer" style={{ width: '32px', height: '32px' }} onClick={() => router.back()}>
                    <X size={20} />
                </button>

                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3 position-relative px-4">
                        {/* Left: Organization */}
                        <div className="text-white d-none d-md-block">
                            <div className="d-flex align-items-center gap-2">
                                <Siren size={32} className="text-warning" />
                                <div>
                                    <div className="fw-bold text-uppercase lh-1 small opacity-75">ISSUED BY</div>
                                    <div className="fw-black text-uppercase h5 mb-0">DELHI POLICE</div>
                                </div>
                            </div>
                        </div>

                        {/* Center Title */}
                        <div className="text-center text-white flex-grow-1">
                            <h1 className="mb-0 fw-black text-uppercase ls-3 lh-1 display-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>FUGITIVE</h1>
                            <div className="fw-bold text-uppercase ls-3 small text-warning badge bg-black bg-opacity-25 mt-1 px-3 py-1 rounded-pill border border-white border-opacity-25">OFFICIAL DOSSIER</div>
                        </div>

                        {/* Right: Date */}
                        <div className="text-end text-white d-none d-md-block">
                            <div className="opacity-75 small text-uppercase">Notice Date</div>
                            <div className="fw-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="d-flex justify-content-center gap-1 mt-2">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`btn px-5 py-2 fw-bold text-uppercase ls-1 rounded-top-2 rounded-bottom-0 border-0 d-flex align-items-center gap-2 transition-all ${activeTab === 'details' ? 'bg-white text-danger shadow-sm pt-3' : 'bg-black bg-opacity-20 text-white text-opacity-70 hover:bg-opacity-30'}`}
                        >
                            <FileText size={16} /> FUGITIVE DETAILS
                        </button>
                        <button
                            onClick={() => setActiveTab('evidence')}
                            className={`btn px-5 py-2 fw-bold text-uppercase ls-1 rounded-top-2 rounded-bottom-0 border-0 d-flex align-items-center gap-2 transition-all ${activeTab === 'evidence' ? 'bg-white text-danger shadow-sm pt-3' : 'bg-black bg-opacity-20 text-white text-opacity-70 hover:bg-opacity-30'}`}
                        >
                            <ImageIcon size={16} /> MUGSHOTS & EVIDENCE
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. ALERT BAR */}
            {(details.armed_and_dangerous || details.brief_caution) && (
                <div className="bg-black text-white text-center py-2 fw-bold text-uppercase ls-1 d-flex align-items-center justify-content-center gap-3 border-top border-bottom border-secondary shadow-sm z-10">
                    <AlertTriangle size={20} className="text-danger fill-danger" />
                    <span className="text-danger fw-black ls-2 pulse-animation">
                        {details.brief_caution || "ARMED AND DANGEROUS"}
                    </span>
                    <AlertTriangle size={20} className="text-danger fill-danger" />
                </div>
            )}

            {/* 3. CONTENT AREA */}
            <div className="flex-grow-1 overflow-y-auto p-0 bg-slate-100">
                <div className="container bg-white shadow min-h-100 p-0" style={{ maxWidth: '1000px' }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'details' ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="row g-0"
                            >
                                {/* LEFT COLUMN: VISUAL IDENTIFICATION */}
                                <div className="col-lg-4 bg-light border-end border-secondary-subtle p-0 d-flex flex-column">
                                    {/* Mugshot Area */}
                                    <div className="p-3 bg-white border-bottom shadow-sm">
                                        <div className="ratio ratio-3x4 bg-gray-200 overflow-hidden rounded-1 border border-secondary position-relative">
                                            {photoUrl ? (
                                                <img
                                                    src={photoUrl}
                                                    className="object-fit-cover w-100 h-100 filter-contrast"
                                                    alt="Suspect"
                                                    onError={() => setImgError(true)}
                                                />
                                            ) : (
                                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                                    <User size={64} className="opacity-25 mb-2" />
                                                    <span className="fw-bold x-small text-uppercase">NO PHOTO</span>
                                                </div>
                                            )}
                                            {/* Watermark/Stamp */}
                                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 opacity-50 border border-2 border-danger text-danger px-2 py-1 fw-black text-uppercase fs-5" style={{ transform: 'rotate(-10deg)', mixBlendMode: 'multiply' }}>
                                                WANTED
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary Identity Stats */}
                                    <div className="p-4 flex-grow-1 d-flex flex-column">
                                        <div className="text-center mb-1">
                                            <span className="badge bg-danger text-white text-uppercase ls-2 small fw-bold px-2 py-1">Suspect</span>
                                        </div>
                                        <h2 className="fw-black text-uppercase text-dark lh-1 mb-1 text-center">{details.name || "UNKNOWN SUBJECT"}</h2>

                                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                            {details.alias && (
                                                <span className="badge bg-secondary bg-opacity-10 text-dark border border-secondary border-opacity-25 fst-italic">AKA: {details.alias}</span>
                                            )}
                                        </div>

                                        {/* Vertical Bio List */}
                                        <div className="bg-white rounded-2 border shadow-sm mb-4 overflow-hidden">
                                            {[
                                                { label: 'Height', value: details.height },
                                                { label: 'Weight', value: details.weight },
                                                { label: 'Sex', value: details.sex || details.gender },
                                                { label: 'Hair', value: details.hair },
                                                { label: 'Eyes', value: details.eyes },
                                                { label: 'DOB', value: details.dob ? details.dob.split('-')[0] : null },
                                            ].map((stat, i) => (
                                                <div key={i} className={`d-flex align-items-center justify-content-between px-3 py-2 ${i !== 5 ? 'border-bottom' : ''}`}>
                                                    <span className="x-small text-uppercase text-muted fw-bold">{stat.label}</span>
                                                    <span className="fw-bold text-dark font-monospace">{stat.value || '--'}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reward Box */}
                                        {details.bounty_amount && (
                                            <div className="bg-warning bg-opacity-10 border border-warning rounded-2 p-3 text-center mb-4 position-relative overflow-hidden">
                                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-warning opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' }}></div>
                                                <div className="position-relative z-10">
                                                    <div className="x-small text-uppercase text-dark fw-bold mb-1 d-flex align-items-center justify-content-center gap-1">
                                                        <Award size={14} className="text-warning-emphasis" /> CASH REWARD
                                                    </div>
                                                    <div className="display-6 fw-black text-danger-emphasis lh-1 font-monospace">
                                                        {details.bounty_amount.startsWith('₹') ? '' : '₹'}{details.bounty_amount}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Distinguishing Marks Highlight */}
                                        {details.scars_marks && (
                                            <div className="mb-4 text-center">
                                                <div className="x-small text-uppercase text-muted fw-bold mb-1">Distinguishing Marks</div>
                                                <div className="fw-medium text-danger">{details.scars_marks}</div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-3 text-center">
                                            {/* QR Code */}
                                            <div className="bg-white p-2 d-inline-block rounded border shadow-sm mb-3">
                                                <div style={{ height: "auto", margin: "0 auto", maxWidth: 100, width: "100%" }}>
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} alt="Scan for info" className="w-100" />
                                                </div>
                                            </div>

                                            {/* Visual Confirmation - Secondary Image */}
                                            {photoUrl && (
                                                <div className="mb-2">
                                                    <div className="x-small text-uppercase fw-bold text-muted mb-1">Visual ID</div>
                                                    <div className="ratio ratio-1x1 d-inline-block rounded-circle overflow-hidden border border-2 border-white shadow-sm" style={{ width: '64px' }}>
                                                        <img src={photoUrl} className="object-fit-cover w-100 h-100" alt="Visual ID" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="x-small text-uppercase fw-bold text-muted">Scan to Share</div>
                                        </div>
                                    </div>


                                </div>


                                {/* RIGHT COLUMN: DETAILED DOSSIER */}
                                <div className="col-lg-8 p-4 px-md-5">

                                    {/* Personal Details */}
                                    <SectionHeader icon={Info} title="Personal Details" />
                                    <div className="row">
                                        <DetailItem label="Full Name" value={details.name} />
                                        <DetailItem label="Aliases / Nicknames" value={details.alias} />
                                        <DetailItem label="Date of Birth" value={details.dob} />
                                        <DetailItem label="Place of Birth" value={details.place_of_birth} />
                                        <DetailItem label="Nationality" value={details.nationality} />
                                        <DetailItem label="Race / Ethnicity" value={details.race_ethnicity} />
                                    </div>

                                    {/* Physical Attributes */}
                                    <SectionHeader icon={User} title="Physical Attributes" />
                                    <div className="row">
                                        <DetailItem label="Hair" value={details.hair} />
                                        <DetailItem label="Eyes" value={details.eyes} />
                                        <DetailItem label="Complexion" value={details.complexion} />
                                        <DetailItem label="Build" value={details.build} />
                                        <DetailItem label="Scars & Marks" value={details.scars_marks} fullWidth />
                                        {details.tattoos && <DetailItem label="Tattoos" value={details.tattoos} fullWidth />}
                                    </div>

                                    {/* Crime & Warnings */}
                                    <SectionHeader icon={FileWarning} title="Crime & Warning Information" />
                                    <div className="row">
                                        <DetailItem label="Crime Category" value={details.crime_category} />
                                        <DetailItem label="Crime Date" value={details.crime_date} />
                                        <DetailItem label="Crime Location" value={details.crime_location} fullWidth />
                                        <div className="col-12 mb-3">
                                            <div className="text-uppercase x-small text-secondary fw-bold mb-1">CRIMINAL CHARGES</div>
                                            <div className="bg-light p-2 rounded border border-secondary-subtle fw-medium text-dark">
                                                {Array.isArray(details.charges) ? (
                                                    <ul className="mb-0 ps-3">
                                                        {details.charges.map((charge: string, i: number) => <li key={i}>{charge}</li>)}
                                                    </ul>
                                                ) : (details.charges || "Charges pending")}
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="text-uppercase x-small text-secondary fw-bold mb-1">CRIME NARRATIVE</div>
                                            <p className="text-dark small fw-medium text-justify mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                {details.crime_narrative || details.description || "No narrative provided."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Warrant Info */}
                                    {(details.warrant_number || details.issuing_court) && (
                                        <>
                                            <SectionHeader icon={Scale} title="Warrant Information" />
                                            <div className="row">
                                                <DetailItem label="Warrant Number" value={details.warrant_number} />
                                                <DetailItem label="Date Issued" value={details.warrant_date} />
                                                <DetailItem label="Issuing Court" value={details.issuing_court} fullWidth />
                                                {details.unlawful_flight_date && <DetailItem label="Unlawful Flight Date" value={details.unlawful_flight_date} />}
                                            </div>
                                        </>
                                    )}

                                    {/* Operational Warnings */}
                                    <SectionHeader icon={Siren} title="Operational Warnings" />
                                    <div className="alert alert-danger border-danger d-flex gap-3 align-items-start mb-3">
                                        <AlertTriangle size={24} className="flex-shrink-0 mt-1" />
                                        <div>
                                            {details.armed_and_dangerous && <div className="fw-bold text-uppercase mb-1">⚠ SUBJECT IS ARMED AND DANGEROUS</div>}
                                            <div className="small opacity-90">
                                                {details.operational_warnings || "Exercise extreme caution. Do not attempt to apprehend alone."}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <DetailItem label="Responsible Field Office" value={details.field_office} fullWidth={true} />
                                    </div>

                                    {/* Known Ties */}
                                    <SectionHeader icon={MapPin} title="Known Ties & Last Seen" />
                                    <div className="row">
                                        <DetailItem label="Last Seen Date" value={details.last_seen_date} />
                                        <DetailItem label="Last Seen Location" value={details.last_seen_location} />
                                        <DetailItem label="Known Ties / Locations" value={details.known_ties} fullWidth />
                                    </div>

                                    {/* Intelligence Remarks */}
                                    {details.background_remarks && (
                                        <>
                                            <SectionHeader icon={FileText} title="Background & Intelligence" />
                                            <div className="bg-light p-3 rounded border border-dashed border-secondary">
                                                <p className="small mb-0 text-dark">{details.background_remarks}</p>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="evidence"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-4 bg-light min-h-100"
                            >
                                <div className="row g-4">
                                    {/* Add Mugshot as first item in evidence for print checks */}
                                    {photoUrl && (
                                        <div className="col-md-4 col-sm-6">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-header bg-white fw-bold small text-uppercase py-2">Primary Mugshot</div>
                                                <div className="ratio ratio-1x1 bg-slate-200">
                                                    <img src={photoUrl} className="object-fit-contain p-2" alt="Mugshot" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {mediaItems.map((item: any, i: number) => (
                                        <div key={i} className="col-md-4 col-sm-6">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="ratio ratio-16x9 bg-dark rounded-top overflow-hidden">
                                                    {item.file_type?.includes('image') ? (
                                                        <img src={item.file_path} className="object-fit-cover opacity-90 hover-opacity-100 transition-all" />
                                                    ) : item.file_type?.includes('video') ? (
                                                        <video src={item.file_path} controls className="w-100 h-100" />
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-center text-white">
                                                            <File size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="card-body p-2 bg-white">
                                                    <div className="small fw-bold text-truncate">{item.file_name || `Evidence #${i + 1}`}</div>
                                                    <div className="x-small text-muted text-uppercase">{item.file_type}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {((!mediaItems || mediaItems.length === 0) && !photoUrl) && (
                                        <div className="col-12 py-5 text-center text-muted">
                                            <Search size={48} className="mb-3 opacity-25" />
                                            <h5>No Media Available</h5>
                                            <p>No photos or evidence files are currently attached to this dossier.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 4. FOOTER */}
            <div id="no-print-footer" className="p-3 bg-white border-top shadow-lg d-flex justify-content-between align-items-center position-relative z-30">
                <button onClick={handleDownloadPDF} className="btn btn-outline-dark fw-bold text-uppercase d-flex align-items-center gap-2">
                    <Printer size={18} /> Print Dossier
                </button>
                <div className="text-end small text-muted d-none d-md-block">
                    <div>Confidential - Law Enforcement Use Only</div>
                    <div className="x-small opacity-75">ID: {data.token || data.id}</div>
                </div>
                <button
                    onClick={() => router.push(`/report?ref=${data.id}`)}
                    className="btn btn-danger fw-bold text-uppercase d-flex align-items-center gap-2 shadow-sm"
                >
                    <Flag size={18} /> Report Sighting
                </button>
            </div>

            <style jsx global>{`
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .ls-3 { letter-spacing: 3px; }
                .filter-contrast { filter: contrast(1.1) brightness(1.05); }
                .pulse-animation { animation: pulse-red 2s infinite; }
                @keyframes pulse-red {
                    0% { text-shadow: 0 0 0 rgba(220, 38, 38, 0); }
                    50% { text-shadow: 0 0 10px rgba(220, 38, 38, 0.5); }
                    100% { text-shadow: 0 0 0 rgba(220, 38, 38, 0); }
                }
                .has-cool-scrollbar::-webkit-scrollbar { width: 8px; }
                .has-cool-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .has-cool-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .has-cool-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div >
    );
};
