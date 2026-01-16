"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Clock,
    History,
    MoreHorizontal,
    FileText,
    Download,
    Inbox,
    Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from 'next/navigation';

import { COLORS } from '@/lib/theme';
import { LEAD_CATEGORIES } from '@/lib/constants';

export default function InboxPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [activeTab, setActiveTab] = useState("All"); // New State for Tabs
    const router = useRouter();

    useEffect(() => {
        // Fetch leads (Mock or Real)
        const fetchLeads = async () => {
            const token = localStorage.getItem('token');
            try {
                // Switching to INTERNAL API for Officer Dashboard
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/internal-leads?limit=50`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass token for internal access
                        'Content-Type': 'application/json'
                    }
                });
                if (res.status === 401 || res.status === 403) {
                    // Handle unauthorized or forbidden (token invalid/expired)
                    localStorage.removeItem('token'); // Clear invalid token
                    window.location.href = '/login';
                    return;
                }
                const data = await res.json();
                setLeads(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = (lead.token?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (lead.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || lead.category_id === selectedCategory;

        // Tab Filtering Logic
        let matchesTab = true;
        if (activeTab === 'Wanted') matchesTab = lead.status === 'WANTED';
        else if (activeTab === 'Missing') matchesTab = lead.status === 'MISSING';
        else if (activeTab === 'Alerts') matchesTab = lead.status === 'ALERT';
        else if (activeTab === 'Intel') matchesTab = ['SUBMITTED', 'INFO_SEEKING', 'GENERAL'].includes(lead.status);

        return matchesSearch && matchesCategory && matchesTab;
    });

    const tabs = [
        { id: 'All', label: 'All Intel' },
        { id: 'Wanted', label: 'Wanted' },
        { id: 'Missing', label: 'Missing' },
        { id: 'Alerts', label: 'Alerts' },
        { id: 'Intel', label: 'Appeals & Intel' },
    ];

    return (
        <div className="pb-5 relative">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: COLORS.navyBlue }}>Intelligence Inbox</h2>
                    <p className="text-muted small mb-0">Manage and action incoming public intelligence reports.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-white border shadow-sm d-flex align-items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Pending Review', value: leads.filter(l => l.status === 'SUBMITTED').length, icon: Clock, color: '#3B82F6' },
                    { label: 'Critical Priority', value: leads.filter(l => l.priority === 'CRITICAL').length, icon: AlertTriangle, color: COLORS.wineRed },
                    { label: 'Actioned Today', value: leads.filter(l => l.status === 'ACTIONED' || l.status === 'RESOLVED').length, icon: CheckCircle2, color: '#10B981' }
                ].map((stat, i) => (
                    <div key={i} className="col-md-4">
                        <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border-start border-4" style={{ borderColor: stat.color }}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="small fw-bold text-muted text-uppercase mb-1">{stat.label}</p>
                                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                                </div>
                                <div className="p-3 rounded-4 bg-opacity-10" style={{ background: stat.color }}>
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TAB NAVIGATION */}
            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === tab.id
                            ? 'bg-dark text-white shadow-lg'
                            : 'bg-white text-muted border hover-scale'
                            }`}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-3">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-6">
                            <div className="input-group border rounded-3 overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                                <span className="input-group-text border-0 bg-transparent ps-3"><Search size={18} className="text-muted" /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none ps-2"
                                    placeholder="Search by token or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select border rounded-3 shadow-none"
                                style={{ borderColor: '#E2E8F0' }}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All Categories">All Categories</option>
                                {LEAD_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2">
                                <Filter size={18} /> More Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: COLORS.navyBlue }} role="status"></div>
                    <p className="mt-3 text-muted">Scanning Intelligence Database...</p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th className="ps-4 py-3 text-muted small text-uppercase fw-bold">Token / ID</th>
                                    <th className="py-3 text-muted small text-uppercase fw-bold">Category</th>
                                    <th className="py-3 text-muted small text-uppercase fw-bold">Priority</th>
                                    <th className="py-3 text-muted small text-uppercase fw-bold">Intelligence Summary</th>
                                    <th className="py-3 text-muted small text-uppercase fw-bold">Status</th>
                                    <th className="py-3 text-muted small text-uppercase fw-bold">Timestamp</th>
                                    <th className="py-3 text-center text-muted small text-uppercase fw-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead: any) => (
                                    <tr key={lead.id} className="transition-all" style={{ cursor: 'pointer' }} onClick={() => router.push(`/dashboard/case/${lead.id}`)}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="p-2 rounded bg-light">
                                                    <FileText size={16} className="text-muted" />
                                                </div>
                                                <span className="fw-bold font-monospace text-primary">{lead.token}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge rounded-pill bg-light text-dark border px-3">
                                                {LEAD_CATEGORIES.find(c => c.id === lead.category_id)?.label || lead.category_id || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge rounded-pill fw-bold px-3 py-2 ${lead.priority === 'CRITICAL' ? 'bg-danger bg-opacity-10 text-danger' :
                                                    lead.priority === 'HIGH' ? 'bg-warning bg-opacity-10 text-warning' :
                                                        'bg-secondary bg-opacity-10 text-secondary'
                                                    }`}
                                            >
                                                {lead.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '300px' }}>
                                                <p className="fw-bold mb-0 text-dark text-truncate" style={{ fontSize: '14px' }}>{lead.title}</p>
                                                <small className="text-muted text-truncate d-block" style={{ fontSize: '11px' }}>{lead.description || 'No description provided'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        background: lead.status === 'SUBMITTED' ? '#3B82F6' : '#10B981' // Green for actioned, Blue for submitted
                                                    }}
                                                />
                                                <span className="small fw-bold text-dark">{lead.status}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(lead.created_at).toLocaleDateString()}<br />
                                            {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="text-center px-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="d-flex justify-content-center gap-1">
                                                <a
                                                    href={`/dashboard/case/${lead.id}`}
                                                    className="btn btn-sm px-3 fw-bold rounded-pill text-white"
                                                    style={{ background: COLORS.navyBlue, fontSize: '12px' }}
                                                >
                                                    Review
                                                </a>
                                                <button className="btn btn-sm btn-light border-0 rounded-circle p-2">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5">
                                            <div className="opacity-50">
                                                <Inbox size={48} className="mb-3" />
                                                <p className="fw-bold mb-0">No active intelligence reports found.</p>
                                                <small className="text-muted">New reports will appear here in real-time.</small>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style jsx>{`
                .hover-scale:hover { transform: scale(1.05); }
            `}</style>
        </div>
    );
}
