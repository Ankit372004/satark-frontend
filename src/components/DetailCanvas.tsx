import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Calendar, AlertTriangle, Shield, EyeOff,
    Award, Clock, ImageIcon, Video,
    Info, AlertCircle, FileText, PlayCircle, Music, Download
} from 'lucide-react';
import Link from 'next/link';
import { COLORS, GRADIENTS } from '@/lib/theme';

// Specialized Canvas Dispatcher
import { LeadCanvasDispatcher } from './LeadCanvasDispatcher';

interface DetailCanvasProps {
    leadId: string | number | null;
    onClose: () => void;
}

export const DetailCanvas: React.FC<DetailCanvasProps> = ({ leadId, onClose }) => {
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!leadId) {
            setLead(null);
            return;
        }

        // Prevent body scroll when canvas is open
        document.body.style.overflow = 'hidden';

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads/${leadId}`);
                if (!res.ok) throw new Error('Intelligence file restricted or not found.');
                const data = await res.json();

                // Helper: safely parse details if string
                if (typeof data.details === 'string') {
                    try {
                        data.details = JSON.parse(data.details);
                    } catch (e) {
                        // ignore
                    }
                }
                // Helper: safely parse location_data if string
                if (typeof data.location_data === 'string') {
                    try {
                        data.location_data = JSON.parse(data.location_data);
                    } catch (e) {
                        // ignore
                    }
                }

                setLead(data);
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();

        // Cleanup: restore body scroll when canvas closes
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [leadId]);

    // Dispatcher Logic
    const renderSpecificCanvas = () => {
        return <LeadCanvasDispatcher lead={lead} className="h-100" />;
    };

    return (
        <AnimatePresence>
            {leadId && (
                <div key="canvas-root">
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,80,0.3)', backdropFilter: 'blur(12px)', zIndex: 9998 }}
                    />

                    {/* Canvas Drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed right-0 top-0 h-100 bg-white shadow-2xl border-start overflow-hidden d-flex flex-column"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            height: '100vh',
                            width: 'min(90vw, 700px)',
                            minWidth: 'min(100vw, 450px)',
                            maxWidth: '700px',
                            zIndex: 9999,
                            backgroundColor: '#fff',
                            borderTopLeftRadius: '24px',
                            borderBottomLeftRadius: '24px',
                            boxShadow: '-15px 0 40px rgba(0,0,0,0.15)'
                        }}
                    >
                        {loading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Shield size={48} className="text-primary opacity-20" />
                                </motion.div>
                                <p className="mt-4 text-muted fw-bold">Retrieving Intelligence File...</p>
                            </div>
                        ) : error ? (
                            <div className="p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                                <AlertCircle size={64} className="text-danger mb-4 opacity-50" />
                                <h4 className="fw-bold">Restriction Alert</h4>
                                <p className="text-muted mb-4">{error}</p>
                                <button onClick={onClose} className="btn btn-dark rounded-pill px-5">Close File</button>
                            </div>
                        ) : lead ? (
                            <div className="h-100 position-relative">
                                {/* Close Button Overlay */}
                                <div className="position-absolute top-0 end-0 p-3 z-50">
                                    <button onClick={onClose} className="btn btn-dark rounded-circle shadow-lg border border-white p-2 hover-rotate" style={{ width: '40px', height: '40px' }} title="Close Case File">
                                        <X size={20} className="text-white" />
                                    </button>
                                </div>
                                <LeadCanvasDispatcher lead={lead} className="h-100" />
                            </div>
                        ) : null}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
