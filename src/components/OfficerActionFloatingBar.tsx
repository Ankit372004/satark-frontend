"use client";

import React, { useState } from 'react';
import {
    Send, Shield, ShieldCheck, Siren, FileSignature,
    X, CheckCircle2, AlertTriangle, Lock, EyeOff, Trophy, Gift,
    Menu, MoreHorizontal, Pin, MessageSquarePlus, ChevronUp
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

interface OfficerActionFloatingBarProps {
    lead: any; // Full lead object
}

export const OfficerActionFloatingBar: React.FC<OfficerActionFloatingBarProps> = ({ lead }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [shareStatus, setShareStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

    // Claim Modal State
    const [informantToken, setInformantToken] = useState('');
    const [claimRemarks, setClaimRemarks] = useState('');
    const [claimStatus, setClaimStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

    // Action Feedback States
    const [activeAction, setActiveAction] = useState<string | null>(null);

    // Restricted Email Validation Logic
    const validateEmail = (email: string) => {
        const govRegex = /^[a-zA-Z0-9._%+-]+@(gov\.in|nic\.in|delhipolice\.gov\.in)$/;
        return govRegex.test(email);
    };

    const handleShareSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('UNAUTHORIZED DOMAIN: Only gov.in, nic.in, or delhipolice.gov.in emails are permitted.');
            return;
        }
        setEmailError('');
        setShareStatus('SENDING');
        await new Promise(r => setTimeout(r, 1500));
        setShareStatus('SENT');
        setTimeout(() => {
            setShowShareModal(false);
            setShareStatus('IDLE');
            setEmail('');
        }, 2000);
    };

    const handleUnpublish = async () => {
        if (!confirm("Are you sure you want to UNPUBLISH this dossier? It will be hidden from the public.")) return;
        setActiveAction('UNPUBLISH');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${lead.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'UNPUBLISH' })
            });
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Failed to unpublish");
            setActiveAction(null);
        }
    };

    const handleClaimSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClaimStatus('SUBMITTING');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/${lead.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'ACTIONED',
                    reward_action: 'CLAIM',
                    reward_data: { token: informantToken, remarks: claimRemarks }
                })
            });
            if (res.ok) {
                setClaimStatus('SUCCESS');
                setTimeout(() => {
                    setShowClaimModal(false);
                    setClaimStatus('IDLE');
                    window.location.reload();
                }, 1500);
            } else {
                alert("Failed to process claim");
                setClaimStatus('IDLE');
            }
        } catch (e) {
            console.error(e);
            alert("Network error");
            setClaimStatus('IDLE');
        }
    };

    const triggerAction = (action: string) => {
        setActiveAction(action);
        setTimeout(() => setActiveAction(null), 3000);
    };

    const hasActiveReward = lead?.reward_amount && lead?.reward_status === 'ACTIVE';

    if (!lead) return null;

    return (
        <>
            {/* TACTICAL COMMAND DOCK */}
            <div className="fixed-bottom p-4 d-flex justify-content-center pointer-events-none" style={{ zIndex: 1050 }}>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="d-flex align-items-end gap-3"
                    style={{ pointerEvents: 'auto' }}
                >
                    {/* LEFT WING: INTELLIGENCE OPS */}
                    <div className="bg-white bg-opacity-90 backdrop-blur-md border shadow-lg rounded-4 p-2 d-flex gap-2 align-items-center"
                        style={{ borderRadius: '24px', border: `1px solid rgba(255,255,255,0.4)` }}>

                        <TooltipButton icon={<ShieldCheck size={20} />} label="Verify" onClick={() => triggerAction('VERIFY')} active={activeAction === 'VERIFY'} color="text-primary" />
                        <div className="vr bg-slate-200 mx-1" style={{ height: '20px' }}></div>
                        <TooltipButton icon={<MessageSquarePlus size={20} />} label="Add Note" onClick={() => { }} color="text-slate-600" />
                        <TooltipButton icon={<Pin size={20} />} label="Pin Case" onClick={() => { }} color="text-slate-600" />
                    </div>

                    {/* CENTER COMMAND: TACTICAL ACTIONS */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-xl border border-white shadow-2xl p-2 px-3 d-flex gap-3 align-items-center mb-2"
                        style={{
                            borderRadius: '28px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                            transform: 'scale(1.02)'
                        }}>

                        <button
                            onClick={() => triggerAction('DEPLOY')}
                            className={`btn btn-lg fw-black d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm transition-all hover-scale ${activeAction === 'DEPLOY' ? 'bg-danger text-white' : 'bg-danger text-white'}`}
                            style={{
                                background: activeAction === 'DEPLOY' ? '#DC2626' : `linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)`,
                                border: 'none',
                                fontSize: '14px',
                                letterSpacing: '0.5px'
                            }}
                        >
                            <Siren size={20} className={activeAction === 'DEPLOY' ? 'animate-pulse' : ''} />
                            {activeAction === 'DEPLOY' ? 'UNITS DEPLOYED' : 'DEPLOY UNIT'}
                        </button>

                        <button
                            onClick={() => triggerAction('WARRANT')}
                            className="btn btn-lg fw-bold d-flex align-items-center gap-2 rounded-pill px-4 bg-slate-100 text-slate-700 hover-bg-slate-200 transition-all hover-scale"
                            style={{ fontSize: '14px', border: '1px solid rgba(0,0,0,0.05)' }}
                        >
                            <FileSignature size={20} />
                            Request Warrant
                        </button>
                    </div>

                    {/* RIGHT WING: ADMIN & REWARDS */}
                    <div className="bg-white bg-opacity-90 backdrop-blur-md border shadow-lg rounded-4 p-2 d-flex gap-2 align-items-center"
                        style={{ borderRadius: '24px', border: `1px solid rgba(255,255,255,0.4)` }}>

                        {hasActiveReward ? (
                            <TooltipButton
                                icon={<Gift size={20} />}
                                label="Resolve & Claim"
                                onClick={() => setShowClaimModal(true)}
                                color="text-emerald-600"
                                bg="bg-emerald-50"
                            />
                        ) : (
                            <TooltipButton icon={<CheckCircle2 size={20} />} label="Mark Resolved" onClick={() => { }} color="text-emerald-600" />
                        )}

                        <div className="vr bg-slate-200 mx-1" style={{ height: '20px' }}></div>

                        <TooltipButton
                            icon={<Send size={20} />}
                            label="Secure Share"
                            onClick={() => setShowShareModal(true)}
                            color="text-white"
                            bg="bg-navy-blue"
                            style={{ background: COLORS.navyBlue }}
                        />

                        {lead.is_public && (
                            <TooltipButton icon={<EyeOff size={20} />} label="Unpublish" onClick={handleUnpublish} color="text-danger" />
                        )}
                    </div>
                </motion.div>
            </div>

            {/* MODALS (Keep existing logic) */}
            <AnimatePresence>
                {showShareModal && (
                    <Modal onClose={() => setShowShareModal(false)}>
                        <div className="p-4 bg-light border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2" style={{ color: COLORS.navyBlue }}><Lock size={20} /> Official Encrypted Transfer</h5>
                            <button onClick={() => setShowShareModal(false)} className="btn btn-sm btn-light rounded-circle p-2"><X size={20} /></button>
                        </div>
                        <div className="p-4">
                            {shareStatus === 'SENT' ? (
                                <div className="text-center py-5"><CheckCircle2 size={64} className="mx-auto text-success mb-3" /><h4 className="fw-bold text-success">Case File Transferred</h4></div>
                            ) : (
                                <form onSubmit={handleShareSubmit}>
                                    <div className="alert alert-warning d-flex gap-3 align-items-center border-0 bg-warning bg-opacity-10 text-warning-emphasis"><AlertTriangle size={24} /><div className="small fw-bold">SECURITY PROTOCOL ACTIVE<br />External domains prohibited.</div></div>
                                    <div className="mb-4"><input type="email" className="form-control form-control-lg fw-bold" placeholder="officer@delhipolice.gov.in" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></div>
                                    <button type="submit" className="btn btn-lg w-100 fw-bold text-white" disabled={shareStatus === 'SENDING' || !email} style={{ background: COLORS.navyBlue }}>{shareStatus === 'SENDING' ? 'Encrypting...' : 'Send Secure Link'}</button>
                                </form>
                            )}
                        </div>
                    </Modal>
                )}
                {showClaimModal && (
                    <Modal onClose={() => setShowClaimModal(false)}>
                        <div className="p-4 bg-emerald-50 border-bottom border-success border-opacity-25 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-success"><Trophy size={20} /> Process Reward Claim</h5>
                            <button onClick={() => setShowClaimModal(false)} className="btn btn-sm btn-light rounded-circle p-2"><X size={20} /></button>
                        </div>
                        <div className="p-4">
                            {claimStatus === 'SUCCESS' ? (
                                <div className="text-center py-5"><div className="mb-3 text-success"><CheckCircle2 size={64} className="mx-auto" /></div><h4 className="fw-bold text-success">Claim Processed</h4></div>
                            ) : (
                                <form onSubmit={handleClaimSubmit}>
                                    <div className="mb-4 text-center">
                                        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-success bg-opacity-10 text-success mb-3"><span className="fw-bold fs-3">{lead.reward_amount}</span></div>
                                        <p className="small text-muted mb-0">Authorized Cash Reward.</p>
                                    </div>
                                    <div className="mb-3"><input type="text" className="form-control fw-bold" placeholder="Informant Token (Optional)" value={informantToken} onChange={(e) => setInformantToken(e.target.value)} /></div>
                                    <div className="mb-4"><textarea className="form-control" rows={3} required placeholder="Resolution Remarks..." value={claimRemarks} onChange={(e) => setClaimRemarks(e.target.value)} /></div>
                                    <button type="submit" className="btn btn-lg w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2" disabled={claimStatus === 'SUBMITTING'} style={{ background: '#059669' }}>{claimStatus === 'SUBMITTING' ? 'Processing...' : 'Confirm Resolution & Claim'}</button>
                                </form>
                            )}
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            <style jsx>{`
                .hover-scale:hover { transform: scale(1.05); }
                .hover-bg-slate-200:hover { background-color: #E2E8F0; }
                .fw-black { font-weight: 900; }
            `}</style>
        </>
    );
};

// Helper Components
const TooltipButton = ({ icon, label, onClick, active, color, bg, style }: any) => (
    <div className="position-relative group" style={{ cursor: 'pointer' }}>
        <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`btn p-3 rounded-circle d-flex align-items-center justify-content-center border-0 shadow-sm transition-all ${color} ${bg || 'bg-transparent hover-bg-slate-50'}`}
            style={{ width: '48px', height: '48px', ...style }}
        >
            {icon}
        </motion.button>
        {/* Tooltip */}
        <div className="position-absolute start-50 translate-middle-x bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover-opacity-100 transition-opacity pointer-events-none"
            style={{ bottom: '100%', marginBottom: '8px', whiteSpace: 'nowrap', fontSize: '10px' }}>
            {label}
        </div>
        <style jsx>{`
            .group:hover .group-hover-opacity-100 { opacity: 1 !important; transform: translateX(-50%) translateY(-5px); }
            .group-hover-opacity-100 { transform: translateX(-50%); transition: all 0.2s ease; }
        `}</style>
    </div>
);

const Modal = ({ children, onClose }: any) => (
    <div className="fixed inset-0 z-[1060] d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="position-absolute w-100 h-100 bg-black bg-opacity-50 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-4 shadow-2xl overflow-hidden position-relative m-4" style={{ width: '100%', maxWidth: '500px' }}>
            {children}
        </motion.div>
    </div>
);
