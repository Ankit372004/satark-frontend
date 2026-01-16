"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, UserX, AlertTriangle, FileText, Search, Fingerprint, ArrowRight } from 'lucide-react';
import { COLORS } from '@/lib/theme';

export default function PublishHub() {
    const router = useRouter();

    const MODULES = [
        {
            id: 'wanted',
            title: 'Wanted Person',
            description: 'Publish a fugitive dossier linked to criminal charges.',
            icon: Fingerprint,
            color: 'text-danger',
            bg: 'bg-danger-subtle',
            path: '/dashboard/publish/wanted'
        },
        {
            id: 'missing',
            title: 'Missing Person',
            description: 'Report a missing individual with physical details.',
            icon: UserX,
            color: 'text-warning',
            bg: 'bg-warning-subtle',
            path: '/dashboard/publish/missing'
        },
        {
            id: 'alert',
            title: 'Public Safety Alert',
            description: 'Broadcast urgent safety warnings to the community.',
            icon: AlertTriangle,
            color: 'text-orange', // custom class logic needed or use standard
            bg: 'bg-orange-subtle',
            path: '/dashboard/publish/alert'
        },
        {
            id: 'general',
            title: 'General Intelligence',
            description: 'Submit uncategorized field intelligence reports.',
            icon: FileText,
            color: 'text-primary',
            bg: 'bg-primary-subtle',
            path: '/dashboard/publish/general'
        }
    ];

    return (
        <div className="h-full d-flex flex-column bg-slate-50 overflow-auto p-5">
            <div className="mx-auto w-100" style={{ maxWidth: '1000px' }}>
                <div className="mb-5 text-center">
                    <h1 className="fw-black mb-2 d-flex align-items-center justify-content-center gap-3" style={{ color: COLORS.navyBlue }}>
                        <Shield size={40} />
                        Intelligence Publishing Hub
                    </h1>
                    <p className="text-muted fw-medium fs-5">Select a category to generate a new official police dossier</p>
                </div>

                <div className="row g-4">
                    {MODULES.map((module) => (
                        <div key={module.id} className="col-md-6 col-lg-4">
                            <div
                                onClick={() => router.push(module.path)}
                                className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift cursor-pointer transition-all group"
                            >
                                <div className={`d-inline-flex p-3 rounded-4 mb-4 ${module.bg} ${module.color}`}>
                                    <module.icon size={32} />
                                </div>
                                <h4 className="fw-bold mb-2 group-hover:text-primary transition-colors">{module.title}</h4>
                                <p className="text-muted mb-4 small">{module.description}</p>

                                <div className="mt-auto d-flex align-items-center text-primary fw-bold small text-uppercase ls-1">
                                    Start Draft <ArrowRight size={16} className="ms-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <style jsx>{`
                    .hover-lift:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
                    }
                    .text-orange { color: #f97316; }
                    .bg-orange-subtle { background-color: #ffedd5; }
                    .ls-1 { letter-spacing: 1px; }
                `}</style>
            </div>
        </div>
    );
}
