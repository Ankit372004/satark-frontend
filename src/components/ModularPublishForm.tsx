"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Upload, CheckCircle2, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/lib/theme';
import { NoticeTypeSidebar } from '@/components/NoticeTypeSidebar';
import { MissingPersonForm } from '@/components/forms/MissingPersonForm';
import { WantedPersonForm } from '@/components/forms/WantedPersonForm';
import { AlertForm } from '@/components/forms/AlertForm';
import { SeekingInfoForm } from '@/components/forms/SeekingInfoForm';
import { GeneralIntelligenceForm } from '@/components/forms/GeneralIntelligenceForm';
import { LeadCanvasDispatcher } from '@/components/LeadCanvasDispatcher';

const STEPS = [
    { id: 1, label: 'Notice Type \u0026 Form' },
    { id: 2, label: 'Media \u0026 Evidence' },
    { id: 3, label: 'Review \u0026 Publish' },
];

export const ModularPublishForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [noticeType, setNoticeType] = useState('MISSING');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<File[]>([]);
    const [mugshot, setMugshot] = useState<File | null>(null);

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleMugshotChange = (file: File | null) => {
        setMugshot(file);
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
                    title: formData.name || formData.title || 'Untitled',
                    description: formData.description || formData.crime_description || formData.incident_description || '',
                    name: 'Officer (Self)',
                    contact: 'OFFICIAL-CHANNEL',
                },
                identity_mode: 'NAMED',
                jurisdiction_id: '11111111-1111-1111-1111-111111111111',
                incident_time: formData.incident_date || formData.reporting_date || new Date().toISOString(),
                category_id: 'kidnapping',
                priority: 'HIGH',
                details: formData,
                is_public: true,
                status: noticeType,
                reward_amount: formData.reward_amount || null,
            };

            data.append('payload', JSON.stringify(payload));

            files.forEach((file) => {
                data.append('evidence', file);
            });

            if (mugshot) {
                data.append('evidence', mugshot);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                body: data,
            });

            const result = await res.json();

            if (res.ok) {
                router.push(`/dashboard/case/${result.lead.id}`);
            } else {
                alert('Failed to publish. Please try again.');
            }
        } catch (e) {
            console.error(e);
            alert('Network error. Please check connection.');
        } finally {
            setLoading(false);
        }
    };

    const renderFormModule = () => {
        switch (noticeType) {
            case 'MISSING':
                return (
                    <MissingPersonForm
                        formData={formData}
                        onChange={handleFieldChange}
                        onMugshotChange={handleMugshotChange}
                        mugshot={mugshot}
                    />
                );
            case 'WANTED':
                return (
                    <WantedPersonForm
                        formData={formData}
                        onChange={handleFieldChange}
                        onMugshotChange={handleMugshotChange}
                        mugshot={mugshot}
                    />
                );
            case 'ALERT':
                return <AlertForm formData={formData} onChange={handleFieldChange} />;
            case 'INFO_SEEKING':
                return <SeekingInfoForm formData={formData} onChange={handleFieldChange} />;
            case 'SUBMITTED':
            default:
                return (
                    <GeneralIntelligenceForm
                        formData={formData}
                        onChange={handleFieldChange}
                        onMugshotChange={handleMugshotChange}
                        mugshot={mugshot}
                    />
                );
        }
    };

    // Mock preview lead
    const previewLead = {
        id: 'preview',
        title: formData.name || formData.title || formData.subject_name || 'Preview',
        description: formData.description || formData.crime_description || formData.incident_description || 'No description',
        status: noticeType,
        priority: formData.priority || 'HIGH',
        details: formData,
        location_data: { address: formData.missing_from || formData.location || 'Delhi' },
        created_at: new Date().toISOString(),
        token: 'DRAFT',
        image_url: mugshot ? URL.createObjectURL(mugshot) : (noticeType === 'SUBMITTED' ? '/delhi-police-logo.png' : undefined),
        media: [
            ...files.map((f, i) => ({
                file_path: URL.createObjectURL(f),
                file_type: f.type.includes('video') ? 'VIDEO' : 'IMAGE',
                id: `preview-${i}`,
            })),
            ...(mugshot ? [{ file_path: URL.createObjectURL(mugshot), file_type: 'IMAGE', id: 'mugshot' }] : []),
        ],
        reward_amount: formData.reward_amount,
    };

    return (
        <div className="h-100 d-flex flex-column">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 px-4 pt-4">
                <div>
                    <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: COLORS.navyBlue }}>
                        <Shield size={28} /> Publish Intelligence Dossier
                    </h2>
                    <p className="text-muted small mb-0">Modular notice creation system</p>
                </div>
                <button onClick={() => router.back()} className="btn btn-white border shadow-sm d-flex align-items-center gap-2 fw-bold">
                    <ArrowLeft size={16} /> Cancel
                </button>
            </div>

            {/* Progress */}
            <div className="px-4 py-3 border-bottom bg-light">
                <div className="d-flex justify-content-between position-relative mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="position-absolute w-100 top-50 start-0 translate-middle-y" style={{ height: '2px', background: '#E2E8F0', zIndex: 0 }} />
                    <div
                        className="position-absolute top-50 start-0 translate-middle-y"
                        style={{
                            height: '2px',
                            background: COLORS.navyBlue,
                            width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                            zIndex: 0,
                            transition: 'width 0.3s ease',
                        }}
                    />
                    {STEPS.map((s) => (
                        <div key={s.id} className="d-flex flex-column align-items-center gap-2" style={{ zIndex: 1 }}>
                            <div
                                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold border border-2 ${step >= s.id ? 'text-white' : 'bg-white text-muted'
                                    }`}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    background: step >= s.id ? COLORS.navyBlue : '#fff',
                                    borderColor: step >= s.id ? COLORS.navyBlue : '#E2E8F0',
                                }}
                            >
                                {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                            </div>
                            <span className={`small fw-bold ${step >= s.id ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '10px' }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex overflow-hidden">
                {/* Sidebar - Only on Step 1 */}
                {step === 1 && <NoticeTypeSidebar selectedType={noticeType} onTypeChange={setNoticeType} />}

                {/* Form Content */}
                <div className="flex-grow-1 overflow-auto p-4">
                    <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto" style={{ maxWidth: '900px' }}>
                        {step === 1 && renderFormModule()}

                        {step === 2 && (
                            <div className="card border-0 shadow-sm rounded-4 p-5">
                                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <Upload size={24} /> Evidence \u0026 Media Assets
                                </h4>
                                <div
                                    className="border-2 border-dashed rounded-4 bg-light p-5 text-center position-relative"
                                    style={{ minHeight: '300px', cursor: 'pointer' }}
                                >
                                    <input type="file" multiple className="position-absolute w-100 h-100 opacity-0" onChange={handleFileChange} style={{ cursor: 'pointer' }} />
                                    <Upload size={48} className="text-muted mb-3" />
                                    <h5 className="fw-bold">Drag \u0026 Drop Files Here</h5>
                                    <p className="text-muted">or click to browse</p>
                                    {(files.length > 0 || mugshot) && (
                                        <div className="mt-4">
                                            <p className="small fw-bold text-muted">Selected: {files.length + (mugshot ? 1 : 0)} file(s)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="d-flex flex-column gap-3">
                                <div className="alert alert-info d-flex align-items-center gap-2">
                                    <Eye size={20} />
                                    <div>
                                        <strong>Final Review:</strong> Please verify all information before publishing.
                                    </div>
                                </div>
                                <div className="border rounded-4 overflow-hidden bg-white shadow" style={{ minHeight: '600px' }}>
                                    <LeadCanvasDispatcher lead={previewLead} className="h-100" />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-top d-flex justify-content-between">
                <button onClick={() => setStep((prev) => Math.max(prev - 1, 1))} disabled={step === 1} className="btn btn-lg btn-light d-flex align-items-center gap-2">
                    <ChevronLeft size={20} /> Back
                </button>
                <div>
                    {step < 3 ? (
                        <button onClick={() => setStep((prev) => prev + 1)} className="btn btn-lg text-white d-flex align-items-center gap-2" style={{ background: COLORS.navyBlue }}>
                            Continue <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading} className="btn btn-lg btn-success d-flex align-items-center gap-2">
                            {loading ? 'Publishing...' : <><CheckCircle2 size={20} /> Publish Dossier</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
