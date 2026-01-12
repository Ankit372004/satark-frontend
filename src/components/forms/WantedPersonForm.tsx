"use client";

import React, { useState } from 'react';
import { User, FileText, AlertTriangle, Camera, Shield, MapPin, Scroll, Award } from 'lucide-react';
import { WANTED_PERSON_FIELDS } from '@/lib/noticeFields';

interface WantedPersonFormProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    onMugshotChange: (file: File | null) => void;
    mugshot: File | null;
}

export const WantedPersonForm: React.FC<WantedPersonFormProps> = ({
    formData,
    onChange,
    onMugshotChange,
    mugshot,
}) => {
    const [tagInputs, setTagInputs] = useState<{ [key: string]: string }>({});

    const renderField = (field: any) => {
        const value = formData[field.name] || (field.type === 'tags' ? [] : field.type === 'checkbox' ? false : '');

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
                        rows={field.rows || 4}
                        required={field.required}
                        placeholder={field.placeholder}
                    />
                );
            case 'checkbox':
                return (
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={value === true}
                            onChange={(e) => onChange(field.name, e.target.checked)}
                            style={{ width: '3em', height: '1.5em' }}
                        />
                    </div>
                );
            case 'tags':
                return (
                    <div>
                        <div className="d-flex gap-2 flex-wrap mb-2">
                            {(value as string[]).map((tag, idx) => (
                                <span key={idx} className="badge bg-primary d-flex align-items-center gap-1 py-2 px-3">
                                    {tag}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        style={{ fontSize: '10px' }}
                                        onClick={() => {
                                            const newTags = [...value];
                                            newTags.splice(idx, 1);
                                            onChange(field.name, newTags);
                                        }}
                                    />
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="form-control border-0 shadow-sm"
                            value={tagInputs[field.name] || ''}
                            onChange={(e) => setTagInputs({ ...tagInputs, [field.name]: e.target.value })}
                            placeholder={field.placeholder}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && tagInputs[field.name]?.trim()) {
                                    e.preventDefault();
                                    onChange(field.name, [...value, tagInputs[field.name].trim()]);
                                    setTagInputs({ ...tagInputs, [field.name]: '' });
                                }
                            }}
                        />
                    </div>
                );
            case 'date':
                return (
                    <input
                        type="date"
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
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    const renderSection = (title: string, fields: any[], icon: any, variant?: 'danger') => {
        const Icon = icon;
        return (
            <div
                className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${variant === 'danger' ? 'bg-danger-subtle' : ''
                    }`}
            >
                <h5
                    className={`fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom ${variant === 'danger' ? 'text-danger border-danger' : ''
                        }`}
                >
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
                    Suspect Mugshot / Photo
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
                                    alt="Wanted person"
                                />
                            ) : (
                                <div className="text-center">
                                    <div className="bg-white p-3 rounded-circle shadow-sm mb-3 d-inline-block">
                                        <Camera size={32} className="text-muted" />
                                    </div>
                                    <span className="d-block small fw-bold">Upload Mugshot</span>
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
                        <div className="alert alert-danger mb-0">
                            <h6 className="fw-bold mb-2">Important</h6>
                            <ul className="small mb-0 ps-3">
                                <li>Upload the most recent and clear photograph available</li>
                                <li>Front-facing mugshot preferred</li>
                                <li>Image will be displayed on public wanted poster</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Details */}
            {renderSection('Personal Details', WANTED_PERSON_FIELDS.personalDetails, User)}

            {/* Physical Details */}
            {renderSection('Physical Attributes', WANTED_PERSON_FIELDS.physicalDetails, FileText)}

            {/* Crime Details */}
            {renderSection('Crime \u0026 Warning Information', WANTED_PERSON_FIELDS.crimeDetails, AlertTriangle, 'danger')}

            {/* Identifying Marks */}
            {renderSection('Identifying Marks & Tattoos', WANTED_PERSON_FIELDS.identifyingMarks, FileText)}

            {/* Warrant Details */}
            {renderSection('Warrant Information', WANTED_PERSON_FIELDS.warrantDetails, Scroll)}

            {/* Operational Info */}
            {renderSection('Operational Warnings', WANTED_PERSON_FIELDS.operationalInfo, Shield, 'danger')}

            {/* Reward Information */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-warning-subtle">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom border-warning text-dark">
                    <Award size={20} />
                    Reward & Bounty
                </h5>
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-uppercase text-muted">Cash Bounty Amount (₹)</label>
                        <input
                            type="text"
                            className="form-control border-0 shadow-sm"
                            placeholder="e.g. ₹50,000"
                            value={formData.reward_amount || ''}
                            onChange={(e) => onChange('reward_amount', e.target.value)}
                        />
                        <div className="form-text small text-dark opacity-75">
                            Enter the approved reward amount for information leading to arrest. Leave blank if not applicable.
                        </div>
                    </div>
                </div>
            </div>

            {/* Known Ties */}
            {renderSection('Known Ties & Last Seen', WANTED_PERSON_FIELDS.knownTies, MapPin)}

            {/* Background */}
            {renderSection('Background & Intelligence Remarks', WANTED_PERSON_FIELDS.backgroundRemarks, FileText)}
        </div>
    );
};
