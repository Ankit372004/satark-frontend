"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Send, CheckCircle2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertForm } from '@/components/forms/AlertForm';

const STEPS = [
    { id: 1, label: 'Alert Details' },
    { id: 2, label: 'Evidence & Media' },
    { id: 3, label: 'Distribution & Publish' },
];

export default function PublishAlertPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<File[]>([]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            const payload = {
                incident_details: {
                    title: `ALERT: ${formData.title || 'Safety Warning'}`,
                    description: formData.description || 'Urgent public safety notification.',
                    name: 'Officer (Self)',
                    contact: 'OFFICIAL-CHANNEL',
                },
                identity_mode: 'OFFICIAL',
                jurisdiction_id: '11111111-1111-1111-1111-111111111111',
                incident_time: new Date().toISOString(),
                notice_type: 'public_alert',
                category_id: formData.category || 'other',
                priority: formData.severity === 'Critical' ? 'CRITICAL' : 'HIGH',
                details: formData,
                is_public: true,
                status: 'ALERT',
                reward_amount: null,
            };

            data.append('payload', JSON.stringify(payload));
            files.forEach(f => data.append('evidence', f));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const result = await res.json();
                router.push(`/dashboard/case/${result.lead.id}`);
            } else {
                alert('Failed to broadcast. Please check inputs.');
            }
        } catch (e) {
            console.error(e);
            alert('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full d-flex flex-column bg-white">
            {/* Header - Orange Theme for Alert */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom bg-orange-subtle text-orange-emphasis">
                <div>
                    <button onClick={() => router.back()} className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none mb-2">
                        <ArrowLeft size={16} /> Back to Hub
                    </button>
                    <h2 className="fw-black mb-0 d-flex align-items-center gap-2 text-warning-emphasis">
                        <AlertTriangle size={28} /> Broadcast Public Alert
                    </h2>
                </div>
                <div className="d-flex bg-white rounded-pill p-1 shadow-sm">
                    {STEPS.map((s) => (
                        <div key={s.id} className={`px-4 py-2 rounded-pill small fw-bold transition-all ${step === s.id ? 'bg-warning text-dark shadow-sm' : 'text-muted'}`}>
                            <span className="opacity-50 me-2">{s.id}.</span> {s.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto bg-slate-50">
                <div className="container py-5" style={{ maxWidth: '800px' }}>
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

                        {/* STEP 1: FORM */}
                        {step === 1 && (
                            <AlertForm
                                formData={formData}
                                onChange={handleFieldChange}
                            />
                        )}

                        {/* STEP 2: EVIDENCE */}
                        {step === 2 && (
                            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                                <h4 className="fw-bold mb-4">Upload Supporting Evidence</h4>
                                <div className="border-2 border-dashed rounded-4 bg-light p-5 position-relative">
                                    <input type="file" multiple className="position-absolute w-100 h-100 opacity-0 cursor-pointer start-0 top-0" onChange={(e) => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} />
                                    <div className="mb-3 text-muted">
                                        <div className="d-flex justify-content-center gap-3 mb-2">
                                            <div className="bg-white p-2 rounded-circle shadow-sm"><FileText size={20} /></div>
                                            <div className="bg-white p-2 rounded-circle shadow-sm"><AlertTriangle size={20} /></div>
                                        </div>
                                    </div>
                                    <p className="text-muted fw-bold mb-1">Drag & Drop or Click to Upload</p>
                                    <p className="x-small text-muted mb-0">Supports: Maps, Photos, PDF Docs, Footage</p>
                                    {files.length > 0 && <span className="badge bg-warning text-dark mt-3">{files.length} files attached</span>}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CONFIRM */}
                        {step === 3 && (
                            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                                <div className="mb-4 text-warning">
                                    <AlertTriangle size={48} />
                                </div>
                                <h3 className="fw-black mb-3">Ready to Broadcast?</h3>
                                <p className="text-muted mb-5">
                                    This alert will be immediately pushed to public notification channels, map feeds, and registered users in the affected zone. This action cannot be silently undone.
                                </p>

                                <div className="card bg-slate-50 border p-4 text-start mb-5">
                                    <h5 className="fw-bold mb-2">{formData.title || 'Untitled Alert'}</h5>
                                    <p className="text-muted mb-0">{formData.description || 'No content provided.'}</p>
                                    <div className="mt-3 d-flex gap-2">
                                        <span className="badge bg-danger">Priority: {formData.severity || 'Normal'}</span>
                                        <span className="badge bg-dark">Public Broadcast</span>
                                        {files.length > 0 && <span className="badge bg-secondary">{files.length} Attachments</span>}
                                    </div>
                                </div>

                                <button onClick={handleSubmit} disabled={loading} className="btn btn-danger btn-lg w-100 fw-bold shadow">
                                    {loading ? 'Broadcasting...' : <><Send size={18} className="me-2" /> Confirm & Broadcast Now</>}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Footer Navigation */}
            {step < 3 && (
                <div className="p-4 bg-white border-top d-flex justify-content-between">
                    <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn btn-light fw-bold">Back</button>
                    <button onClick={() => setStep(s => s + 1)} className="btn btn-warning fw-bold px-5 text-dark">
                        {step === 2 ? 'Review & Publish' : 'Add Evidence'}
                    </button>
                </div>
            )}
        </div>
    );
}
