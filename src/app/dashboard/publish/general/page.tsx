"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Send, Shield, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GeneralIntelligenceForm } from '@/components/forms/GeneralIntelligenceForm';
import { IntelligenceCanvas } from '@/components/canvases/IntelligenceCanvas';
import { COLORS } from '@/lib/theme';

const STEPS = [
    { id: 1, label: 'Report Details' },
    { id: 2, label: 'Supporting Evidence' },
    { id: 3, label: 'Review Submission' },
];

export default function PublishGeneralPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<File[]>([]);
    const [mugshot, setMugshot] = useState<File | null>(null);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Construct Preview Object matching DB Schema
    const previewData = {
        title: `INTEL: ${formData.title || 'Draft Report'}`,
        description: formData.description,
        category_id: formData.category,
        priority: formData.priority?.toUpperCase() || 'MEDIUM',
        token: 'DRAFT-PREVIEW',
        created_at: new Date().toISOString(),
        // If mugshot exists, create URL for preview
        image_url: mugshot ? URL.createObjectURL(mugshot) : null,
        details: {
            ...formData,
            source: formData.is_anonymous ? 'Anonymous Source' : 'Officer (Self)',
        },
        media: files.map((f, i) => ({
            file_path: URL.createObjectURL(f),
            file_type: f.type.includes('video') ? 'VIDEO' : 'IMAGE',
            id: `p-${i}`
        }))
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            const payload = {
                incident_details: {
                    title: `INTEL: ${formData.title || 'Field Report'}`,
                    description: formData.description || 'General intelligence submission.',
                    name: formData.is_anonymous ? 'Anonymous Officer' : 'Officer (Self)',
                    contact: 'OFFICIAL-CHANNEL',
                },
                identity_mode: formData.is_anonymous ? 'ANONYMOUS' : 'OFFICIAL',
                jurisdiction_id: '11111111-1111-1111-1111-111111111111',
                incident_time: formData.observation_time || new Date().toISOString(),
                category_id: formData.category?.toLowerCase() || 'other',
                priority: (formData.priority || 'MEDIUM').toUpperCase(),
                details: formData,
                is_public: formData.is_public || false,
                status: 'SUBMITTED',
                reward_amount: null,
            };

            data.append('payload', JSON.stringify(payload));
            if (mugshot) data.append('evidence', mugshot);
            files.forEach(f => data.append('evidence', f));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const result = await res.json();
                router.push(`/dashboard/case/${result.lead.id}`);
            } else {
                alert('Failed to submit. Please check inputs.');
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
            {/* Header - Primary Theme */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom bg-slate-50">
                <div>
                    <button onClick={() => router.back()} className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none mb-2">
                        <ArrowLeft size={16} /> Back to Hub
                    </button>
                    <h2 className="fw-black mb-0 d-flex align-items-center gap-2" style={{ color: COLORS.navyBlue }}>
                        <Shield size={28} /> General Intelligence Report
                    </h2>
                </div>
                <div className="d-flex bg-white rounded-pill p-1 shadow-sm border">
                    {STEPS.map((s) => (
                        <div key={s.id} className={`px-4 py-2 rounded-pill small fw-bold transition-all ${step === s.id ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}>
                            <span className="opacity-50 me-2">{s.id}.</span> {s.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto bg-slate-50">
                <div className="container py-5" style={{ maxWidth: step === 3 ? '1200px' : '900px' }}>
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {step === 1 && (
                            <GeneralIntelligenceForm
                                formData={formData}
                                onChange={handleFieldChange}
                                onMugshotChange={setMugshot}
                                mugshot={mugshot}
                            />
                        )}

                        {/* STEP 2: EVIDENCE */}
                        {step === 2 && (
                            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                                <h4 className="fw-bold mb-4">Attach Supporting Intelligence</h4>
                                <div className="border-2 border-dashed rounded-4 bg-light p-5 position-relative">
                                    <input type="file" multiple className="position-absolute w-100 h-100 opacity-0 cursor-pointer start-0 top-0" onChange={(e) => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} />
                                    <div className="mb-3 text-muted">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-muted fw-bold mb-1">Drag & Drop or Click to Upload</p>
                                    <p className="x-small text-muted mb-0">Supports: Surveillance Photos, Documents, Audio/Video</p>
                                    {files.length > 0 && <span className="badge bg-primary mt-3">{files.length} files attached</span>}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="row justify-content-center">
                                <div className="col-lg-10">
                                    <div className="mb-4 text-center">
                                        <h3 className="fw-black">Review Submission</h3>
                                        <p className="text-muted">Please verify the intelligence report before official filing.</p>
                                    </div>

                                    {/* Canvas Preview */}
                                    <div className="mb-5 shadow-lg rounded-4 overflow-hidden" style={{ height: '800px' }}>
                                        <IntelligenceCanvas data={previewData} />
                                    </div>

                                    <div className="d-flex gap-3 justify-content-center">
                                        <button onClick={() => setStep(1)} className="btn btn-light btn-lg px-5 fw-bold">
                                            Edit Details
                                        </button>
                                        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-lg px-5 fw-bold shadow-sm d-flex align-items-center gap-2">
                                            {loading ? (
                                                <>Processing...</>
                                            ) : (
                                                <><Send size={18} /> Confirm & Publish Report</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div >

            {/* Footer Navigation */}
            {
                step < 3 && (
                    <div className="p-4 bg-white border-top d-flex justify-content-between">
                        <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn btn-light fw-bold">Back</button>
                        <button onClick={() => setStep(s => s + 1)} className="btn btn-primary fw-bold px-5">
                            {step === 2 ? 'Review Report' : 'Attach Evidence'}
                        </button>
                    </div>
                )
            }
        </div >
    );
}
