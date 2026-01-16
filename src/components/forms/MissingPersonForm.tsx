"use client";

import React from 'react';
import { User, FileText, MapPin, Camera, Clock, Shield, Award } from 'lucide-react';
import { MISSING_PERSON_FIELDS } from '@/lib/noticeFields';

interface MissingPersonFormProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    onMugshotChange: (file: File | null) => void;
    mugshot: File | null;
}

export const MissingPersonForm: React.FC<MissingPersonFormProps> = ({
    formData,
    onChange,
    onMugshotChange,
    mugshot,
}) => {
    const renderField = (field: any) => {
        const value = formData[field.name] || '';

        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-select border-0 shadow-sm"
                        required={field.required}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((opt: any) => {
                            const label = typeof opt === 'object' ? opt.label : opt;
                            const val = typeof opt === 'object' ? opt.value : opt;
                            return (
                                <option key={val} value={val}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm"
                        rows={field.rows || 3}
                        required={field.required}
                    />
                );
            case 'date':
            case 'datetime-local':
            case 'number':
                return (
                    <input
                        type={field.type}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm"
                        required={field.required}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm"
                        required={field.required}
                        placeholder={field.defaultValue}
                    />
                );
        }
    };

    const renderSection = (title: string, fields: any[], icon: any) => {
        const Icon = icon;
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom">
                    <Icon size={20} />
                    {title}
                </h5>
                <div className="row g-3">
                    {fields.map((field) => (
                        <div key={field.name} className={`col-md-${field.type === 'textarea' ? '12' : '6'}`}>
                            <label className="form-label small fw-bold text-uppercase text-muted">
                                {field.label}
                                {field.required && <span className="text-danger ms-1">*</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="d-flex flex-column gap-4">
            {/* Photo Upload Section */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom">
                    <Camera size={20} />
                    Missing Person Image
                </h5>
                <div className="row">
                    <div className="col-md-4">
                        <div
                            className="aspect-ratio-box bg-light rounded-4 border border-2 border-dashed d-flex flex-column align-items-center justify-content-center text-muted position-relative overflow-hidden"
                            style={{ height: '300px', cursor: 'pointer' }}
                        >
                            {mugshot ? (
                                <img
                                    src={URL.createObjectURL(mugshot)}
                                    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                                    alt="Missing person"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="bg-white p-3 rounded-circle shadow-sm mb-3 d-inline-block">
                                        <Camera size={32} className="text-muted" />
                                    </div>
                                    <span className="d-block small fw-bold">Upload Photo</span>
                                    <span className="d-block small text-muted mt-1">Click to browse</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                onChange={(e) => onMugshotChange(e.target.files?.[0] || null)}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="alert alert-warning mb-0">
                            <h6 className="fw-bold mb-2">Photo Guidelines</h6>
                            <ul className="small mb-0 ps-3">
                                <li>Clear, recent photograph preferred</li>
                                <li>Front-facing, well-lit image</li>
                                <li>Supported formats: JPG, PNG</li>
                                <li>Maximum file size: 5MB</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Details */}
            {renderSection('Personal Details', MISSING_PERSON_FIELDS.personalDetails, User)}

            {/* Physical Details */}
            {renderSection('Physical Details', MISSING_PERSON_FIELDS.physicalDetails, FileText)}

            {/* Dress Details */}
            {renderSection('Dress Description', MISSING_PERSON_FIELDS.dressDetails, FileText)}

            {/* Incident Details */}
            {renderSection('Incident Details', MISSING_PERSON_FIELDS.incidentDetails, MapPin)}

            {/* Last Seen Details */}
            {renderSection('Disappearance & Last Seen Details', MISSING_PERSON_FIELDS.lastSeenDetails, Clock)}

            {/* Reward Information */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-warning-subtle">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom border-warning text-dark">
                    <Award size={20} />
                    Reward Information
                </h5>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-uppercase text-muted">Reward Amount (₹)</label>
                        <input
                            type="text"
                            className="form-control border-0 shadow-sm"
                            placeholder="e.g. ₹25,000"
                            value={formData.reward_amount || ''}
                            onChange={(e) => onChange('reward_amount', e.target.value)}
                        />
                        <div className="form-text small text-dark opacity-75">
                            Enter approved reward for information leading to recovery.
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            {renderSection('Guardian / Contact Information', MISSING_PERSON_FIELDS.contactInfo, Shield)}

            {/* Jurisdiction Details */}
            {renderSection('Jurisdiction \u0026 FIR Details', MISSING_PERSON_FIELDS.jurisdictionDetails, MapPin)}

            {/* Additional Details */}
            {renderSection('Additional Information', MISSING_PERSON_FIELDS.additionalDetails, FileText)}
        </div>
    );
};
