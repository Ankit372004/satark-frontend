"use client";

import React from 'react';
import { FileText, AlertTriangle, UserX, Info, User } from 'lucide-react';
import { COLORS } from '@/lib/theme';

const NOTICE_TYPE_MENU = [
    { id: 'MISSING', label: 'Missing Person', icon: User, color: '#FFA500' },
    { id: 'WANTED', label: 'Fugitive', icon: UserX, color: '#DC2626' },
    { id: 'ALERT', label: 'Public Alert', icon: AlertTriangle, color: '#EAB308' },
    { id: 'INFO_SEEKING', label: 'Seeking Information', icon: Info, color: '#3B82F6' },
    { id: 'SUBMITTED', label: 'General Intelligence', icon: FileText, color: '#6B7280' },
];

interface NoticeTypeSidebarProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

export const NoticeTypeSidebar: React.FC<NoticeTypeSidebarProps> = ({ selectedType, onTypeChange }) => {
    return (
        <div className="bg-white border-end h-100 d-flex flex-column" style={{ width: '280px' }}>
            <div className="p-4 border-bottom">
                <h5 className="fw-bold mb-1" style={{ color: COLORS.navyBlue }}>Notice Type</h5>
                <p className="small text-muted mb-0">Select the type of intelligence dossier</p>
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
                {NOTICE_TYPE_MENU.map((notice) => {
                    const Icon = notice.icon;
                    const isSelected = selectedType === notice.id;

                    return (
                        <button
                            key={notice.id}
                            onClick={() => onTypeChange(notice.id)}
                            className={`w-100 btn text-start d-flex align-items-center gap-3 mb-2 p-3 rounded-3 border transition-all ${isSelected
                                ? 'border-2 shadow-sm'
                                : 'border-0 bg-light hover-bg-white'
                                }`}
                            style={{
                                background: isSelected ? `${notice.color}15` : undefined,
                                borderColor: isSelected ? notice.color : undefined,
                            }}
                        >
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: isSelected ? notice.color : '#E2E8F0',
                                    color: isSelected ? '#fff' : '#64748B',
                                }}
                            >
                                <Icon size={20} />
                            </div>
                            <div className="flex-grow-1">
                                <div
                                    className="fw-bold small"
                                    style={{ color: isSelected ? notice.color : COLORS.textSecondary }}
                                >
                                    {notice.label}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="p-3 border-top bg-light">
                <div className="alert alert-info small mb-0 d-flex align-items-start gap-2">
                    <Info size={16} className="mt-1 flex-shrink-0" />
                    <div>
                        <strong>Tip:</strong> Each notice type has specific fields optimized for that category.
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .hover-bg-white:hover {
                    background: white !important;
                }
            `}</style>
        </div>
    );
};
