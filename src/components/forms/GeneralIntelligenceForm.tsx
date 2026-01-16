// Refactored GeneralIntelligenceForm to match standardized user requirements
import React from 'react';
import { Camera, Shield, MapPin, FileText, AlertTriangle, Clock, User, Car } from 'lucide-react';
import { GENERAL_INTELLIGENCE_FIELDS } from '@/lib/noticeFields';

interface GeneralIntelligenceFormProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    onMugshotChange: (file: File | null) => void;
    mugshot: File | null;
}

export const GeneralIntelligenceForm: React.FC<GeneralIntelligenceFormProps> = ({
    formData,
    onChange,
    onMugshotChange,
    mugshot,
}) => {
    const renderField = (field: any) => {
        const value = formData[field.name] ?? (field.defaultValue ?? '');

        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-select border-0 shadow-sm p-3 bg-light"
                        required={field.required}
                        style={{ fontSize: '0.95rem' }}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm p-3 bg-light"
                        rows={field.rows || 4}
                        required={field.required}
                        placeholder={field.placeholder}
                        style={{ fontSize: '0.95rem', resize: 'none' }}
                    />
                );
            case 'checkbox':
                return (
                    <div className="form-check form-switch d-flex align-items-center gap-3 ps-0">
                        <input
                            type="checkbox"
                            checked={value === true || value === 'true'}
                            onChange={(e) => onChange(field.name, e.target.checked)}
                            className="form-check-input ms-0"
                            style={{ width: '3.5em', height: '1.75em' }}
                        />
                        <span className="text-muted small ms-2">{field.placeholder}</span>
                    </div>
                );
            case 'datetime-local':
                return (
                    <input
                        type="datetime-local"
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm p-3 bg-light"
                        required={field.required}
                        style={{ fontSize: '0.95rem' }}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        className="form-control border-0 shadow-sm p-3 bg-light"
                        required={field.required}
                        placeholder={field.placeholder}
                        style={{ fontSize: '0.95rem' }}
                    />
                );
        }
    };

    const renderSection = (title: string, fields: any[], Icon: any, description?: string) => {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div className="mb-4 border-bottom pb-3">
                    <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#2c3e50' }}>
                        <Icon size={20} className="text-primary" />
                        {title}
                    </h5>
                    {description && <p className="text-muted small mb-0 ms-4 ps-1">{description}</p>}
                </div>

                <div className="row g-4">
                    {fields.map((field) => (
                        <div key={field.name} className={`col-md-${field.fullWidth ? '12' : '6'}`}>
                            <label className="form-label small fw-bold text-uppercase text-secondary ls-1 mb-2">
                                {field.label}
                                {field.required && <span className="text-danger ms-1">*</span>}
                            </label>
                            {renderField(field)}
                            {field.helpText && (
                                <div className="form-text small text-muted mt-2">
                                    <AlertTriangle size={12} className="me-1" /> {field.helpText}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="d-flex flex-column">
            {/* Photo Upload Section */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3 border-bottom">
                    <Camera size={20} className="text-primary" />
                    Intelligence Photo (Optional)
                </h5>
                <div className="row">
                    <div className="col-md-4">
                        <div
                            className="aspect-ratio-box bg-light rounded-4 border border-2 border-dashed d-flex flex-column align-items-center justify-content-center text-muted position-relative overflow-hidden hover-bg-light transition-all"
                            style={{ height: '240px', cursor: 'pointer' }}
                        >
                            {mugshot ? (
                                <img
                                    src={URL.createObjectURL(mugshot)}
                                    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                                    alt="Intelligence photo"
                                />
                            ) : (
                                <div className="text-center d-flex flex-column align-items-center justify-content-center h-100 w-100 p-3">
                                    <img
                                        src="/delhi-police-logo.png"
                                        alt="Delhi Police"
                                        className="mb-3 opacity-25 grayscale"
                                        style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                    />
                                    <div className="bg-white p-2 rounded-circle shadow-sm mb-2">
                                        <Camera size={20} className="text-muted" />
                                    </div>
                                    <span className="d-block small fw-bold text-dark">Upload Photo</span>
                                    <span className="d-block x-small text-muted mt-1">Tap to browse</span>
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
                    <div className="col-md-8 d-flex align-items-center">
                        <div className="alert alert-light border shadow-sm mb-0 w-100">
                            <h6 className="fw-bold mb-2 small text-uppercase text-primary d-flex align-items-center gap-2">
                                <FileText size={14} /> Photo Guidelines
                            </h6>
                            <ul className="small mb-0 ps-3 text-muted">
                                <li className="mb-1">Upload relevant scene photos, suspect images, or evidence.</li>
                                <li className="mb-1">Ensures higher confidence score for your report.</li>
                                <li className="mb-1">Default logo displayed if no photo provided.</li>
                                <li>Supported: JPG, PNG (Max 5MB)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            {renderSection('Basic Information', GENERAL_INTELLIGENCE_FIELDS.basicInfo, Shield)}

            {/* Description & Location */}
            {renderSection('Description & Location', GENERAL_INTELLIGENCE_FIELDS.description, MapPin)}

            {/* Subject Information */}
            {renderSection('Subject Information (Optional)', GENERAL_INTELLIGENCE_FIELDS.subjectInfo, User, "If the intelligence involves a specific person or vehicle.")}

            {/* Publishing Options */}
            {renderSection('Publishing Options', GENERAL_INTELLIGENCE_FIELDS.options, FileText)}
        </div>
    );
};
