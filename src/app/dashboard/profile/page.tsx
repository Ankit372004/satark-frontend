"use client";

import React from 'react';
import { User, Shield, Award, MapPin, Phone, Mail, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { COLORS } from '@/lib/theme';

export default function ProfilePage() {
    // Mock User Data for UI (In real app, fetch from /api/me)
    const user = {
        name: "Insp. Vikram Singh",
        rank: "Inspector",
        badgeId: "DL-N-2024-8892",
        unit: "Cyber Cell, North District",
        email: "vikram.singh@delhipolice.gov.in",
        phone: "+91 98765 43210",
        joined: "2018",
        status: "ACTIVE_DUTY",
        stats: {
            casesSolved: 142,
            activeInvestigations: 8,
            commendations: 12
        }
    };

    return (
        <div className="container-fluid p-0">
            {/* Header / ID Card Section */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="p-4 text-white d-flex align-items-end" style={{
                            background: `linear-gradient(135deg, ${COLORS.navyBlue} 0%, ${COLORS.deepBlue} 100%)`,
                            height: '180px'
                        }}>
                            <div className="d-flex align-items-end gap-3 translate-y-50" style={{ transform: 'translateY(30px)' }}>
                                <div className="rounded-circle border-4 border-white shadow bg-secondary d-flex align-items-center justify-content-center"
                                    style={{ width: '120px', height: '120px', background: '#e2e8f0' }}>
                                    <User size={60} className="text-secondary opacity-50" />
                                </div>
                                <div className="mb-4">
                                    <h2 className="fw-bold mb-0">{user.name}</h2>
                                    <div className="d-flex align-items-center gap-2 opacity-75">
                                        <span className="badge bg-white text-primary border fw-bold">{user.rank}</span>
                                        <span className="small text-white opacity-75">{user.badgeId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-5 mt-3">
                            <div className="row g-4 mt-2">
                                <div className="col-md-6">
                                    <h6 className="text-uppercase text-muted fw-bold small ls-1">Unit Assignment</h6>
                                    <div className="d-flex align-items-center gap-2 fw-medium text-dark">
                                        <Shield size={18} className="text-primary" /> {user.unit}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-uppercase text-muted fw-bold small ls-1">Contact Secure Line</h6>
                                    <div className="d-flex flex-column gap-1">
                                        <div className="d-flex align-items-center gap-2 text-dark">
                                            <Mail size={16} className="text-muted" /> {user.email}
                                        </div>
                                        <div className="d-flex align-items-center gap-2 text-dark">
                                            <Phone size={16} className="text-muted" /> {user.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div className="card-body p-4">
                            <h6 className="text-uppercase text-muted fw-bold small mb-4 ls-1">Service Record Stats</h6>
                            <div className="d-grid gap-3">
                                <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <span className="fw-medium text-muted">Cases Solved</span>
                                    </div>
                                    <span className="h4 mb-0 fw-bold text-dark">{user.stats.casesSolved}</span>
                                </div>
                                <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning-emphasis">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <span className="fw-medium text-muted">Active Duty</span>
                                    </div>
                                    <span className="h4 mb-0 fw-bold text-dark">{user.stats.activeInvestigations}</span>
                                </div>
                                <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                                            <Award size={20} />
                                        </div>
                                        <span className="fw-medium text-muted">Commendations</span>
                                    </div>
                                    <span className="h4 mb-0 fw-bold text-dark">{user.stats.commendations}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Log */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                        <Clock size={20} className="text-muted" /> Recent Audit Log
                    </h5>
                </div>
                <div className="list-group list-group-flush">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="list-group-item p-4 d-flex align-items-start gap-3">
                            <div className="mt-1 p-1 rounded-circle bg-slate-100 text-muted">
                                <FileText size={16} />
                            </div>
                            <div>
                                <h6 className="mb-1 fw-bold text-dark">Updated Case File #WNT-2024-00{i}</h6>
                                <p className="mb-1 text-muted small">Added surveillance notes for potential sighting in Sector 4.</p>
                                <small className="text-muted opacity-75">2 hours ago • IP: 192.168.1.45</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </div>
    );
}
