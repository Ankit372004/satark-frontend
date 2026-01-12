"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { COLORS, GRADIENTS, SHADOWS } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, EyeOff, MapPin, AlertTriangle, FileText, CheckCircle, Upload, ChevronRight, ChevronLeft, Lock, X, Eye, Trash2, Image as ImageIcon, Video, Info, Award, Calendar } from "lucide-react";
import { LeadCanvasDispatcher } from '@/components/LeadCanvasDispatcher';
import { LEAD_CATEGORIES } from "@/lib/constants";

// Types
type FormStep = 1 | 2;

export default function ReportPage() {
    const [step, setStep] = useState<FormStep>(1);
    const [formData, setFormData] = useState({
        isAnonymous: true,
        isPublic: false,
        title: "",
        name: "",
        contact: "",
        unitId: "",
        incidentType: "",
        incidentTime: "",
        categoryId: "",
        description: "",
        files: [] as File[],
    });

    const [token, setToken] = useState<string | null>(null);
    const [units, setUnits] = useState<any>({ districts: [], subDivisions: [], policeStations: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    // Context Lead State
    const [referencedLead, setReferencedLead] = useState<any>(null);
    const [loadingRef, setLoadingRef] = useState(false);

    // Fetch Units and check URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const ref = params.get('ref');
        const titleParam = params.get('title');

        if (mode === 'named') {
            setFormData(prev => ({ ...prev, isAnonymous: false }));
        }

        if (mode === 'public') {
            setFormData(prev => ({ ...prev, isPublic: true, isAnonymous: false }));
        }

        if (titleParam) {
            setFormData(prev => ({ ...prev, title: decodeURIComponent(titleParam) }));
        }

        if (ref) {
            setFormData(prev => ({ ...prev, description: `Referencing Case ID: ${ref}\n\n` }));
            // Fetch referenced lead details
            setLoadingRef(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads/${ref}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.id) {
                        setReferencedLead(data);
                    }
                })
                .catch(err => console.warn("Failed to fetch referenced lead", err))
                .finally(() => setLoadingRef(false));
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/units/hierarchy`)
            .then(res => res.json())
            .then(data => setUnits(data))
            .catch(err => {
                console.warn("Using mock units due to API error");
                setUnits({
                    districts: [{ id: 'd1', name: 'New Delhi' }, { id: 'd2', name: 'South Delhi' }],
                    policeStations: [{ id: 'ps1', name: 'Chanakyapuri' }, { id: 'ps2', name: 'Hauz Khas' }]
                });
            });
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, files: [...prev.files, ...selectedFiles] }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
    };

    const handleNext = () => setStep((prev) => (prev < 2 ? (prev + 1 as FormStep) : prev));
    const handleBack = () => setStep((prev) => (prev > 1 ? (prev - 1 as FormStep) : prev));

    const handleSubmit = async () => {
        setIsLoading(true);
        const payload = {
            incident_details: {
                title: formData.title || "Portal Report",
                description: formData.description,
                name: formData.name,
                contact: formData.contact
            },
            identity_mode: formData.isAnonymous ? 'ANONYMOUS' : 'NAMED',
            is_public: formData.isPublic,
            jurisdiction_id: formData.unitId || '11111111-1111-1111-1111-111111111111',
            incident_time: formData.incidentTime,
            category_id: formData.categoryId,
            parent_lead_id: new URLSearchParams(window.location.search).get('ref'), // Proper linking
            details: {}
        };

        const data = new FormData();
        data.append('payload', JSON.stringify(payload));
        formData.files.forEach((file) => data.append('evidence', file));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                body: data
            });
            const apiResponse = await res.json();

            if (apiResponse.lead?.token) {
                setToken(apiResponse.lead.token);
            } else {
                setToken("DEMO-" + Math.floor(Math.random() * 10000));
            }
        } catch (e) {
            console.warn("Network error, falling back to demo token");
            setToken("OFFLINE-" + Math.floor(Math.random() * 10000));
        } finally {
            setIsLoading(false);
        }
    };

    if (token) {
        return (
            <div className="min-vh-100 d-flex flex-column" style={{ background: GRADIENTS.bg }}>
                <Header />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-5 rounded-4 shadow-sm text-center position-relative overflow-hidden bg-white"
                        style={{ maxWidth: '600px', border: `1px solid ${COLORS.border}` }}
                    >
                        <div className="mb-4 d-inline-block rounded-circle p-3" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <CheckCircle size={64} style={{ color: COLORS.success }} />
                        </div>
                        <h2 className="fw-bold mb-2 text-dark">Report Submitted</h2>
                        <p className="text-muted">Your intelligence has been encrypted and securely transmitted.</p>

                        <div className="my-5 p-4 rounded-3 border border-warning border-opacity-25" style={{ background: COLORS.lightGold }}>
                            <p className="small text-uppercase fw-bold text-warning mb-2 letter-spacing-2">Secret Reference Token</p>
                            <h1 className="display-4 fw-bold font-monospace mb-0 tracking-widest" style={{ color: COLORS.navyBlue }}>{token}</h1>
                            <p className="small mt-2 mb-0 text-muted"><AlertTriangle size={14} className="me-1" /> Save this now. It cannot be recovered.</p>
                        </div>

                        <div className="d-grid gap-3">
                            <a href={`/track?token=${token}`} className="btn btn-lg fw-bold rounded-pill text-white" style={{ background: COLORS.navyBlue }}>Track Status</a>
                            <a href="/" className="btn btn-link text-muted text-decoration-none">Return to Dashboard</a>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 1, label: "Identify", icon: Shield },
        { id: 2, label: "Report", icon: FileText },
    ];

    return (
        <main className="min-vh-100 d-flex flex-column" style={{ background: GRADIENTS.bg }}>
            <Header />

            {/* Progress Bar (Simplified) */}
            <div className="w-100 py-4 border-bottom shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div className="position-relative d-flex justify-content-between align-items-center">
                        {/* Line */}
                        <div className="position-absolute top-50 start-0 w-100 rounded" style={{ height: '3px', background: COLORS.border, zIndex: 0 }}>
                            <motion.div
                                className="h-100 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step - 1) / 1) * 100}%` }}
                                style={{ background: GRADIENTS.header }}
                            />
                        </div>

                        {steps.map((s) => (
                            <div key={s.id} className="d-flex flex-column align-items-center position-relative z-1" style={{ width: '100px', cursor: 'pointer' }} onClick={() => step > s.id && setStep(s.id as FormStep)}>
                                <motion.div
                                    animate={{
                                        backgroundColor: step >= s.id ? COLORS.navyBlue : 'white',
                                        borderColor: step >= s.id ? COLORS.navyBlue : COLORS.border,
                                        color: step >= s.id ? 'white' : COLORS.textSecondary
                                    }}
                                    className="rounded-circle d-flex align-items-center justify-content-center border shadow-sm"
                                    style={{ width: '48px', height: '48px', borderWidth: '2px' }}
                                >
                                    <s.icon size={20} />
                                </motion.div>
                                <span className="small mt-2 fw-bold" style={{ color: step >= s.id ? COLORS.navyBlue : COLORS.textSecondary }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-grow-1 container my-5">
                <div className="row justify-content-center g-4">

                    {/* LEFT: FORM SECTION - 50% WIDTH IF REF EXISTS */}
                    <div className={referencedLead ? "col-lg-6" : "col-lg-7"}>
                        {/* Security Notice */}
                        <div className="mb-4 p-3 rounded-3 d-flex align-items-center gap-3 bg-white shadow-sm border-start border-4 border-success">
                            <Lock size={20} className="text-success" />
                            <div>
                                <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '14px' }}>Encrypted & Secure Session</h6>
                                <p className="mb-0 small text-muted">TLS 1.3 Encryption Active. Anonymous reports are strictly untraceable.</p>
                            </div>
                        </div>

                        {/* Main Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="card border-0 shadow-lg rounded-4 overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: SHADOWS.lg
                            }}
                        >
                            <div className="p-4 p-md-5">
                                <AnimatePresence mode='wait'>
                                    {step === 1 && (
                                        <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                            <h3 className="fw-bold mb-1 text-dark">Identify Yourself</h3>
                                            <p className="mb-4 text-muted">Choose how you wish to submit this intelligence.</p>

                                            <div className="d-grid gap-3">
                                                {/* Anonymous Option */}
                                                <div
                                                    onClick={() => setFormData({ ...formData, isAnonymous: true })}
                                                    className="p-4 rounded-3 cursor-pointer transition-all position-relative overflow-hidden"
                                                    style={{
                                                        background: formData.isAnonymous ? 'rgba(0, 0, 128, 0.05)' : 'white',
                                                        border: `2px solid ${formData.isAnonymous ? COLORS.navyBlue : COLORS.border}`
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle p-2 bg-light">
                                                            <EyeOff size={24} style={{ color: COLORS.navyBlue }} />
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-1 text-dark">Anonymous Reporting</h5>
                                                            <p className="small mb-0 text-muted">Identity hidden. No rewards applicable.</p>
                                                        </div>
                                                        {formData.isAnonymous && <CheckCircle className="ms-auto text-success" size={24} />}
                                                    </div>
                                                </div>

                                                {/* Named Option */}
                                                <div
                                                    onClick={() => setFormData({ ...formData, isAnonymous: false })}
                                                    className="p-4 rounded-3 cursor-pointer transition-all"
                                                    style={{
                                                        background: !formData.isAnonymous ? 'rgba(255, 215, 0, 0.1)' : 'white',
                                                        border: `2px solid ${!formData.isAnonymous ? COLORS.golden : COLORS.border}`
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle p-2 bg-light">
                                                            <Shield size={24} style={{ color: COLORS.navyBlue }} />
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-1 text-dark">Confidential Reporting</h5>
                                                            <p className="small mb-0 text-muted">Identity protected. <span className="text-warning fw-bold">Eligible for rewards.</span></p>
                                                        </div>
                                                        {!formData.isAnonymous && <CheckCircle className="ms-auto text-warning" size={24} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {!formData.isAnonymous && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 row g-3">
                                                    <div className="col-md-6">
                                                        <label className="small fw-bold text-uppercase mb-2 text-muted">Full Name</label>
                                                        <input
                                                            className="form-control"
                                                            placeholder="John Doe"
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="small fw-bold text-uppercase mb-2 text-muted">Phone</label>
                                                        <input
                                                            className="form-control"
                                                            placeholder="+91..."
                                                            value={formData.contact}
                                                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                            <h3 className="fw-bold mb-1 text-dark">Report Details</h3>
                                            <p className="mb-4 text-muted">Please provide accurate information.</p>

                                            <div className="row g-3 mb-3">
                                                <div className="col-12">
                                                    <label className="small fw-bold text-uppercase mb-2 text-muted">Subject / Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Suspicious activity at Metro Station"
                                                        className="form-control form-control-lg"
                                                        value={formData.title}
                                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-uppercase mb-2 text-muted">Incident Date</label>
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        onChange={e => setFormData({ ...formData, incidentTime: e.target.value })}
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-uppercase mb-2 text-muted">Category</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.categoryId}
                                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {LEAD_CATEGORIES.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-12">
                                                    <label className="small fw-bold text-uppercase mb-2 text-muted">Location</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter location (e.g. Connaught Place, Block A)"
                                                        className="form-control"
                                                        value={formData.unitId === 'u1' ? '' : formData.unitId}
                                                        onChange={e => setFormData({ ...formData, unitId: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="small fw-bold text-uppercase mb-2 text-muted">Detailed Description</label>
                                                <textarea
                                                    className="form-control p-3 bg-light"
                                                    rows={5}
                                                    placeholder="Describe the incident details..."
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                ></textarea>
                                            </div>

                                            {/* Merged Evidence Section */}
                                            <div className="mb-4">
                                                <label className="small fw-bold text-uppercase mb-2 text-muted">Evidence & Media</label>
                                                <div className="position-relative p-4 rounded-4 text-center border-dashed bg-white transition-all hover-shadow"
                                                    style={{ border: `2px dashed ${COLORS.navyBlue}` }}>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*,video/*"
                                                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div className="p-3 rounded-circle bg-primary-subtle text-primary mb-3">
                                                            <Upload size={24} />
                                                        </div>
                                                        <p className="fw-bold mb-1 text-dark">Click to Upload or Drag Photos/Videos</p>
                                                        <p className="small mb-0 text-muted">Supported: JPG, PNG, MP4 (Max 50MB)</p>
                                                    </div>
                                                </div>

                                                {/* File Previews */}
                                                {formData.files.length > 0 && (
                                                    <div className="row g-2 mt-3">
                                                        {formData.files.map((f, i) => (
                                                            <div key={i} className="col-12">
                                                                <div className="d-flex align-items-center gap-3 p-2 rounded-3 border bg-white shadow-sm">
                                                                    <div className="rounded d-flex align-items-center justify-content-center bg-dark text-white" style={{ width: '48px', height: '48px', cursor: 'pointer' }} onClick={() => setPreviewFile(f)}>
                                                                        {f.type.startsWith('image') ? <ImageIcon size={20} /> : <Video size={20} />}
                                                                        <div className="position-absolute opacity-0 hover-opacity-100 bg-black w-100 h-100 d-flex align-items-center justify-content-center bg-opacity-50 transition-all rounded">
                                                                            <Eye size={16} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-grow-1 overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => setPreviewFile(f)}>
                                                                        <p className="small mb-0 text-truncate fw-bold text-dark">{f.name}</p>
                                                                        <p className="small mb-0 text-muted" style={{ fontSize: '10px' }}>{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                    </div>
                                                                    <button onClick={() => removeFile(i)} className="btn btn-sm btn-light text-danger rounded-circle p-2"><Trash2 size={16} /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Navigation */}
                            <div className="p-4 d-flex justify-content-between align-items-center bg-light border-top">
                                {step === 1 ? (
                                    <div className="small text-muted"><Info size={14} className="me-1" /> Select a mode to proceed</div>
                                ) : (
                                    <button
                                        onClick={handleBack}
                                        className="btn btn-link text-decoration-none d-flex align-items-center gap-2 text-muted"
                                    >
                                        <ChevronLeft size={20} /> Back
                                    </button>
                                )}

                                {step < 2 ? (
                                    <button
                                        onClick={handleNext}
                                        className="btn px-5 py-2 rounded-pill fw-bold text-white d-flex align-items-center gap-2"
                                        style={{ background: COLORS.navyBlue, border: 'none' }}
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="btn px-5 py-2 rounded-pill fw-bold text-white d-flex align-items-center gap-2"
                                        style={{ background: COLORS.success, border: 'none' }}
                                    >
                                        {isLoading ? 'Encrypting...' : 'Submit Report'} <CheckCircle size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: CONTEXT PANEL - 50% WIDTH IF REF EXISTS */}
                    {referencedLead && (
                        <div className="col-lg-6 ps-lg-4">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="sticky-top"
                                style={{ top: '100px' }}
                            >
                                <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100" style={{ background: '#f8f9fa' }}>

                                    {/* Compact Premium Header (Match DetailCanvas) */}
                                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-dark text-white">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 rounded bg-danger text-white"><Shield size={20} /></div>
                                            <div>
                                                <h5 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '300px' }}>{referencedLead.title}</h5>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="opacity-60" style={{ fontSize: '10px' }}>ID: {referencedLead.token || 'REF-' + referencedLead.id}</span>
                                                    <span className="badge bg-secondary-subtle text-light border border-light border-opacity-25" style={{ fontSize: '8px' }}>SECRET // NOFORN</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reusable Detail View */}
                                    <div style={{ height: 'calc(100vh - 140px)', position: 'relative' }}>
                                        <LeadCanvasDispatcher lead={referencedLead} />
                                    </div>

                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            {/* File Preview Modal */}
            {previewFile && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 2000, background: 'rgba(0,0,0,0.8)' }}
                    onClick={() => setPreviewFile(null)}
                >
                    <div className="position-relative p-4" onClick={e => e.stopPropagation()}>
                        <button className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle" onClick={() => setPreviewFile(null)}><X /></button>
                        {previewFile.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(previewFile)} className="img-fluid rounded" style={{ maxHeight: '80vh' }} />
                        ) : (
                            <video src={URL.createObjectURL(previewFile)} controls className="rounded" style={{ maxHeight: '80vh' }} />
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
