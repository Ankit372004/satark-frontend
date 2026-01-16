"use client";

import React, { useState } from 'react';
import { Settings, Bell, Lock, Users, Radio, Save, Map } from 'lucide-react';
import { COLORS } from '@/lib/theme';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifications: true,
        secureMode: true,
        autoArchive: false,
        jurisdiction: 'North District'
    });

    return (
        <div className="container-fluid p-0" style={{ maxWidth: '1000px' }}>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Unit Configuration</h4>
                <p className="text-muted">Manage operational parameters for your assigned unit.</p>
            </div>

            <div className="row g-4">
                {/* General Settings */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-header bg-white p-4 border-bottom">
                            <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <Settings size={18} className="text-primary" /> Operational Preferences
                            </h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {/* Toggle Item */}
                                <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <div className="p-2 rounded bg-light text-dark h-100"><Bell size={20} /></div>
                                        <div>
                                            <h6 className="mb-1 fw-bold">Critical Alert Notifications</h6>
                                            <p className="mb-0 small text-muted">Receive high-priority SMS alerts for Red Corner notices.</p>
                                        </div>
                                    </div>
                                    <div className="form-check form-switch custom-switch">
                                        <input className="form-check-input" type="checkbox" checked={settings.notifications} onChange={() => setSettings({ ...settings, notifications: !settings.notifications })} style={{ width: '3em', height: '1.5em' }} />
                                    </div>
                                </div>

                                {/* Toggle Item */}
                                <div className="list-group-item p-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <div className="p-2 rounded bg-light text-dark h-100"><Lock size={20} /></div>
                                        <div>
                                            <h6 className="mb-1 fw-bold">Strict Protocol Mode</h6>
                                            <p className="mb-0 small text-muted">Enforce 2FA for all document exports and transfers.</p>
                                        </div>
                                    </div>
                                    <div className="form-check form-switch custom-switch">
                                        <input className="form-check-input" type="checkbox" checked={settings.secureMode} onChange={() => setSettings({ ...settings, secureMode: !settings.secureMode })} style={{ width: '3em', height: '1.5em' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jurisdiction Map Placeholder */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white p-4 border-bottom">
                            <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <Map size={18} className="text-primary" /> Jurisdiction Area
                            </h6>
                        </div>
                        <div className="card-body p-4 text-center bg-light" style={{ minHeight: '200px' }}>
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 opacity-50">
                                <Map size={48} className="mb-3" />
                                <h6 className="fw-bold">Interactive Map Unavailable</h6>
                                <p className="small mb-0">Contact System Administrator to update geofencing coordinates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 bg-navy-gradient text-white overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.deepBlue})` }}>
                        <div className="card-body p-4 position-relative">
                            <h5 className="fw-bold mb-3">Unit Status</h5>
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <span className="badge bg-success border border-white border-opacity-25">ONLINE</span>
                                <span className="small opacity-75">v2.4.0 (Stable)</span>
                            </div>

                            <hr className="border-secondary opacity-25" />

                            <div className="mb-4">
                                <label className="small fw-bold opacity-75 text-uppercase mb-2">Team Size</label>
                                <div className="d-flex align-items-center gap-2">
                                    <Users size={18} />
                                    <span className="h4 mb-0 fw-bold">12 Officers</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="small fw-bold opacity-75 text-uppercase mb-2">Primary Zone</label>
                                <div className="d-flex align-items-center gap-2">
                                    <Radio size={18} className="text-danger" />
                                    <span className="fw-bold">{settings.jurisdiction}</span>
                                </div>
                            </div>

                            <button className="btn btn-white w-100 fw-bold text-primary mt-2">
                                <Save size={16} className="me-2" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-switch .form-check-input:checked {
                    background-color: ${COLORS.success};
                    border-color: ${COLORS.success};
                }
            `}</style>
        </div>
    );
}
