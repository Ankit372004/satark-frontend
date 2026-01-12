"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Upload, CheckCircle2, Eye, ChevronRight, UserX, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MissingPersonForm } from '@/components/forms/MissingPersonForm';
import { MissingPersonCanvas } from '@/components/canvases/MissingPersonCanvas';

const STEPS = [
    { id: 1, label: 'Missing Person Details' },
    { id: 2, label: 'Recent Photos' },
    { id: 3, label: 'Verify Flyer' },
];

export default function PublishMissingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<File[]>([]);
    const [mugshot, setMugshot] = useState<File | null>(null);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            const payload = {
                incident_details: {
                    title: `MISSING: ${formData.name || 'Unknown Person'}`,
                    description: `Missing since ${formData.missing_date}. Last seen at ${formData.missing_from}. ${formData.remarks || ''}`,
                    name: 'Officer (Self)',
                    contact: 'OFFICIAL-CHANNEL',
                },
                identity_mode: 'NAMED',
                jurisdiction_id: '11111111-1111-1111-1111-111111111111',
                incident_time: formData.missing_date || new Date().toISOString(),
                notice_type: 'missing_person',
                category_id: formData.category || 'kidnapping',
                priority: 'HIGH',
                details: formData,
                is_public: true,
                status: 'MISSING',
                reward_amount: formData.reward_amount,
            };

            data.append('payload', JSON.stringify(payload));
            files.forEach(f => data.append('evidence', f));
            if (mugshot) data.append('evidence', mugshot);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const result = await res.json();
                router.push(`/dashboard/case/${result.lead.id}`);
            } else {
                alert('Failed to publish. Please check inputs.');
            }
        } catch (e) {
            console.error(e);
            alert('Network error.');
        } finally {
            setLoading(false);
        }
    };

    // Preview Data
    const previewData = {
        title: `MISSING: ${formData.name || 'Unknown'}`,
        status: 'MISSING',
        priority: 'HIGH',
        details: formData,
        token: 'PREVIEW',
        image_url: mugshot ? URL.createObjectURL(mugshot) : '/delhi-police-logo.png',
        media: files.map((f, i) => ({
            file_path: URL.createObjectURL(f),
            file_type: f.type.includes('video') ? 'VIDEO' : 'IMAGE',
            id: `p-${i}`
        }))
    };

    return (
        <div className="h-full d-flex flex-column bg-white">
            {/* Header - Yellow Theme */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom bg-warning-subtle">
                <div>
                    <button onClick={() => router.back()} className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none mb-2">
                        <ArrowLeft size={16} /> Back to Hub
                    </button>
                    <h2 className="fw-black mb-0 d-flex align-items-center gap-2 text-dark">
                        <UserX size={28} /> Report Missing Person
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
                <div className="container py-5" style={{ maxWidth: step === 3 ? '1200px' : '900px' }}>
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

                        {/* STEP 1: FORM */}
                        {step === 1 && (
                            <MissingPersonForm
                                formData={formData}
                                onChange={handleFieldChange}
                                onMugshotChange={setMugshot}
                                mugshot={mugshot}
                            />
                        )}

                        {/* STEP 2: EVIDENCE */}
                        {step === 2 && (
                            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                                <h4 className="fw-bold mb-4">Additional Photos or CCTV</h4>
                                <div className="border-2 border-dashed rounded-4 bg-light p-5 position-relative">
                                    <input type="file" multiple className="position-absolute w-100 h-100 opacity-0 cursor-pointer start-0 top-0" onChange={handleFileChange} />
                                    <Upload size={48} className="text-muted mb-3" />
                                    <p className="text-muted fw-bold">Upload candid photos, CCTV footage, or ID cards</p>
                                    {files.length > 0 && <span className="badge bg-primary">{files.length} files selected</span>}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PREVIEW */}
                        {step === 3 && (
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="alert alert-warning border-warning">
                                        <AlertTriangle size={20} className="mb-2 text-dark" />
                                        <h6 className="fw-bold text-dark">Flyer Preview</h6>
                                        <p className="small mb-0 text-dark">Verify all details. This flyer will be distributed immediately upon publishing.</p>
                                    </div>
                                    <button onClick={handleSubmit} disabled={loading} className="btn btn-dark btn-lg w-100 fw-bold shadow-sm">
                                        {loading ? 'Processing...' : 'Generate Alert'}
                                    </button>
                                </div>
                                <div className="col-md-8" style={{ height: '800px' }}>
                                    <MissingPersonCanvas data={previewData} />
                                </div>
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
                        Next Step <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
