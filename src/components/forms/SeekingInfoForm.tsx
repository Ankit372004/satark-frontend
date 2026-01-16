"use client";

import React from 'react';
import { Info, FileText } from 'lucide-react';
import { SEEKING_INFO_FIELDS } from '@/lib/noticeFields';

interface SeekingInfoFormProps {
    formData: any;
    onChange: (field: string, value: any) => void;
}

export const SeekingInfoForm: React.FC<SeekingInfoFormProps> = ({ formData, onChange }) => {
    const renderField = (field: any) => {
        const value = formData[field.name] || '';

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm"
                        rows={4}
                        required={field.required}
                    />
                );
            case 'datetime-local':
                return (
                    <input
                        type="datetime-local"
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
            <div className="alert alert-info">
                <strong>Blue Corner Notice:</strong> Use this form when seeking information about an incident or person.
                Provide as much detail as possible to help the public assist in the investigation.
            </div>

            {renderSection('Incident Information', SEEKING_INFO_FIELDS.incidentDetails, FileText)}
            {renderSection('Information Sought \u0026 Contact', SEEKING_INFO_FIELDS.seekingInfo, Info)}
        </div>
    );
};
