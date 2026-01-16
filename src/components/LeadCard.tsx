import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Share2, BadgeAlert, ArrowUpCircle, Award, AlertTriangle, EyeOff } from 'lucide-react';

import { COLORS } from '@/lib/theme';

interface Lead {
    id: number;
    title: string;
    location: string;
    time: string;
    type: string;
    description: string;
    status: 'WANTED' | 'MISSING' | 'ALERT' | 'SEEKING_INFO' | 'INFO_SEEKING' | 'GENERAL' | string;
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    reward?: string | null;
    image_url?: string;
    votes?: number;
    responseCount?: number;
    isPinned?: boolean;
}

interface LeadCardProps {
    lead: Lead;
    onClick: (lead: Lead) => void;
    onReportAnonymously?: (lead: Lead) => void;
    onProvideNamedTip?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick, onReportAnonymously, onProvideNamedTip }) => {
    const [votes, setVotes] = React.useState(lead.votes || 0);
    const [hasVoted, setHasVoted] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);

    const refId = lead.id.toString();

    const handleVote = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasVoted) return; // For now, only allow one-way upvote for simplicity

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads/${lead.id}/vote`, {
                method: 'POST'
            });
            if (res.ok) {
                const data = await res.json();
                setVotes(data.upvotes);
                setHasVoted(true);
            }
        } catch (err) {
            console.error("Vote failed:", err);
            // Fallback for demo
            setVotes(v => v + 1);
            setHasVoted(true);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(`${window.location.origin}/track?token=SAMPLE-${refId}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.warn("Clipboard access denied", err);
        }
    };

    const handleAnonymousReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onReportAnonymously) onReportAnonymously(lead);
    };

    const handleNamedTip = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onProvideNamedTip) onProvideNamedTip(lead);
    };

    const renderDescription = (text: string) => {
        return text.split(/(\s+)/).map((part, i) =>
            part.startsWith('#') ? (
                <span key={i} className="fw-bold" style={{ color: COLORS.navyBlue }}>{part}</span>
            ) : part
        );
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'CRITICAL': return COLORS.wineRed;
            case 'HIGH': return '#FF6B00';
            case 'MEDIUM': return '#FFA500';
            default: return '#6C757D';
        }
    };

    return (
        <motion.div
            className="card mb-3 border-0 overflow-hidden cursor-pointer"
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => onClick(lead)}
            style={{
                cursor: 'pointer',
                borderRadius: '16px',
                background: lead.isPinned
                    ? (lead.priority === 'CRITICAL' ? COLORS.wineRed : COLORS.navyBlue)
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: lead.isPinned ? '0 15px 35px rgba(0, 0, 80, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: lead.isPinned ? `2px solid ${COLORS.golden}` : '1px solid rgba(255, 255, 255, 0.3)',
                borderLeft: lead.isPinned ? `6px solid ${COLORS.golden}` : (lead.priority === 'CRITICAL' ? `4px solid ${COLORS.wineRed}` : '1px solid rgba(0, 0, 0, 0.05)')
            }}
        >
            <div className="row g-0">
                {/* Vote Column */}
                <div
                    className="col-1 d-flex flex-column align-items-center py-3"
                    style={{
                        background: lead.isPinned ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                        borderRight: lead.isPinned ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E9ECEF'
                    }}
                >
                    <button
                        onClick={handleVote}
                        className="btn btn-link p-0"
                        style={{
                            transition: 'all 0.2s',
                            color: hasVoted ? COLORS.wineRed : '#6C757D'
                        }}
                    >
                        <ArrowUpCircle size={28} fill={hasVoted ? COLORS.wineRed : "none"} />
                    </button>
                    <span
                        className="fw-bold my-1"
                        style={{
                            color: lead.isPinned ? 'white' : (hasVoted ? COLORS.wineRed : '#212529'),
                            fontSize: '16px'
                        }}
                    >
                        {votes}
                    </span>
                </div>

                {/* Content Column */}
                <div className="col-11">
                    <div className="card-body p-4">
                        {/* Header Metadata with Priority and Reward */}
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2 small flex-wrap">
                                {/* Priority Badge */}
                                {lead.priority && (
                                    <span
                                        className="badge rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                                        style={{
                                            background: getPriorityColor(lead.priority),
                                            color: 'white',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {lead.priority === 'CRITICAL' && <AlertTriangle size={12} />}
                                        {lead.priority}
                                    </span>
                                )}

                                {/* Universal Status Pill with Friendly Labels */}
                                <span
                                    className="badge rounded-pill px-3 py-1 fw-bold"
                                    style={{
                                        background: (() => {
                                            switch (lead.status) {
                                                case 'WANTED': return COLORS.wineRed;
                                                case 'MISSING': return COLORS.golden;
                                                case 'ALERT': return '#FF4500'; // OrangeRed
                                                case 'SEEKING_INFO':
                                                case 'INFO_SEEKING': return '#0D6EFD'; // Blue
                                                default: return COLORS.navyBlue;
                                            }
                                        })(),
                                        color: lead.status === 'MISSING' ? COLORS.navyBlue : 'white',
                                        fontSize: '10px',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {(() => {
                                        switch (lead.status) {
                                            case 'WANTED': return 'WANTED PERSON';
                                            case 'MISSING': return 'MISSING PERSON';
                                            case 'ALERT': return 'PUBLIC SAFETY ALERT';
                                            case 'SEEKING_INFO':
                                            case 'INFO_SEEKING': return 'APPEAL (GENERAL INTEL)';
                                            default: return lead.status.replace('_', ' '); // Fallback
                                        }
                                    })()}
                                </span>

                                {/* Category Pill (if exists) */}
                                {(lead as any).category_id && (
                                    <span
                                        className="badge rounded-pill px-3 py-1 fw-bold border"
                                        style={{
                                            background: 'transparent',
                                            color: COLORS.textSecondary,
                                            fontSize: '10px',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {(lead as any).category_id.replace('_', ' ').toUpperCase()}
                                    </span>
                                )}

                                <span className="text-muted">•</span>
                                <span className="d-flex align-items-center gap-1" style={{ color: lead.isPinned ? 'white' : COLORS.textSecondary }}>
                                    <MapPin size={14} /> {lead.location}
                                </span >
                                <span className="text-muted">•</span>
                                <span className="d-flex align-items-center gap-1" style={{ color: lead.isPinned ? 'white' : COLORS.textSecondary }}>
                                    <Clock size={14} /> {lead.time || 'recent'}
                                </span>
                            </div>

                            {/* Reward Badge (Moved to Image Overlay) */}
                        </div>

                        {/* Title & Preview */}
                        <div className="d-flex justify-content-between gap-3">
                            <div className="flex-grow-1">
                                <h5
                                    className="card-title fw-bold mb-3"
                                    style={{
                                        color: lead.isPinned ? 'white' : COLORS.navyBlue,
                                        fontSize: '20px',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {lead.isPinned && (
                                        <span className={lead.priority === 'CRITICAL' ? "text-white me-2" : "text-warning me-2"}>
                                            ★ PINNED dossier:
                                        </span>
                                    )}
                                    {lead.title}
                                </h5>
                                <p
                                    className="card-text text-muted mb-0"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        fontSize: '15px',
                                        lineHeight: '1.6',
                                        color: lead.isPinned
                                            ? (lead.priority === 'CRITICAL' ? 'white' : 'rgba(255,255,255,0.9)')
                                            : COLORS.textSecondary
                                    }}
                                >
                                    {lead.description.split(/(\s+)/).map((part, i) =>
                                        part.startsWith('#') ? (
                                            <span
                                                key={`hash-${i}`}
                                                className="fw-bold"
                                                style={{
                                                    color: lead.isPinned
                                                        ? (lead.priority === 'CRITICAL' ? 'white' : COLORS.golden)
                                                        : COLORS.navyBlue
                                                }}
                                            >
                                                {part}
                                            </span>
                                        ) : (
                                            <React.Fragment key={`text-${i}`}>{part}</React.Fragment>
                                        )
                                    )}
                                </p>
                            </div>
                            {/* Thumbnail */}
                            {lead.image_url && (
                                <div
                                    className="rounded overflow-hidden flex-shrink-0 position-relative" // Added position-relative
                                    style={{
                                        width: '120px',
                                        height: '90px',
                                        border: `2px solid ${COLORS.golden}`,
                                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                                    }}
                                >
                                    <img
                                        src={lead.image_url}
                                        alt="Thumbnail"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {/* Overlay Reward Badge */}
                                    {lead.reward && (
                                        <div
                                            className="position-absolute bottom-0 start-0 w-100 text-center py-1 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-1"
                                            style={{
                                                background: COLORS.wineRed, // Red Background
                                                color: 'white', // White Text
                                                fontSize: '10px',
                                                letterSpacing: '0.5px',
                                                backdropFilter: 'blur(2px)',
                                                borderTop: `1px solid ${COLORS.golden}`
                                            }}
                                        >
                                            <Award size={10} /> {lead.reward}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="d-flex align-items-center gap-2 mt-4 pt-3 border-top flex-wrap" style={{ borderTop: lead.isPinned ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E9ECEF' }}>
                            <button
                                onClick={handleShare}
                                className="btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3"
                                style={{
                                    background: isCopied ? COLORS.golden : (lead.isPinned ? 'rgba(255,255,255,0.1)' : '#F8F9FA'),
                                    color: isCopied ? COLORS.navyBlue : (lead.isPinned ? 'white' : '#6C757D'),
                                    border: lead.isPinned ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E9ECEF',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <Share2 size={14} /> {isCopied ? 'Link Copied!' : 'Share'}
                            </button>

                            <button
                                onClick={handleAnonymousReport}
                                className="btn btn-sm d-flex align-items-center gap-2 px-3 rounded"
                                style={{
                                    background: lead.isPinned ? COLORS.golden : COLORS.navyBlue,
                                    color: lead.isPinned ? COLORS.navyBlue : 'white',
                                    border: 'none',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <EyeOff size={14} /> Report Anonymously
                            </button>

                            <button
                                onClick={handleNamedTip}
                                className="btn btn-sm d-flex align-items-center gap-2 px-3 rounded"
                                style={{
                                    background: 'white',
                                    color: COLORS.navyBlue,
                                    border: `1px solid ${COLORS.navyBlue}`,
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    height: '34px'
                                }}
                            >
                                <Award size={14} /> Provide Named Tip (Reward Eligible)
                            </button>

                            <span
                                className="d-flex align-items-center gap-2 ms-auto"
                                style={{ fontSize: '13px', color: lead.isPinned ? 'white' : COLORS.textSecondary }}
                            >
                                <BadgeAlert size={14} /> {lead.responseCount || 0} People Responded • {lead.votes || 0} Upvotes
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
