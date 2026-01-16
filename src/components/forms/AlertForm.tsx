"use client";

import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { ALERT_FIELDS } from '@/lib/noticeFields';

interface AlertFormProps {
    formData: any;
    onChange: (field: string, value: any) => void;
}

export const AlertForm: React.FC<AlertFormProps> = ({ formData, onChange }) => {
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
                        rows={5}
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

    return (
        <div className="d-flex flex-column gap-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-warning-subtle">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom border-warning text-warning-emphasis">
                    <AlertTriangle size={20} />
                    Public Safety Alert Details
                </h5>
                <div className="alert alert-warning mb-4">
                    <strong>Note:</strong> Public alerts are critical notifications that will be distributed across multiple channels.
                    Ensure all information is accurate and verified.
                </div>
                <div className="row g-3">
                    {ALERT_FIELDS.alertDetails.map((field) => (
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
        </div>
    );
};
