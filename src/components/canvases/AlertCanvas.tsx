import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import {
    AlertTriangle, MapPin, Calendar, Clock,
    Share2, Info, Printer
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AlertCanvasProps {
    data: any;
}

export const AlertCanvas: React.FC<AlertCanvasProps> = ({ data }) => {
    const router = useRouter();
    const printRef = React.useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const ratio = Math.min(pdf.internal.pageSize.getWidth() / canvas.width, pdf.internal.pageSize.getHeight() / canvas.height);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
            pdf.save(`ALERT-${data.token}.pdf`);
        } catch (error) { console.error("PDF Error", error); }
    };

    const details = useMemo(() => {
        try { return typeof data.details === 'string' ? JSON.parse(data.details) : data.details || {}; }
        catch { return {}; }
    }, [data]);

    const activeTab = 'details';
    const photoUrl = data.image_url || null;

    return (
        <div ref={printRef} className="bg-white h-100 d-flex flex-column font-sans text-dark overflow-hidden">
            {/* HEADER - ORANGE/BLACK GRADIENT */}
            <div className="text-white px-4 py-3 d-flex align-items-center justify-content-between shadow-sm position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)', // Orange-700 to Orange-900
                    borderBottom: '4px solid #f97316'
                }}>
                <div className="d-flex align-items-center gap-3 z-10">
                    <div className="bg-white/10 p-2 rounded-1 border border-white/20"><AlertTriangle size={24} /></div>
                    <div>
                        <h2 className="mb-0 fw-black text-uppercase ls-1 fs-5">PUBLIC SAFETY ALERT</h2>
                        <span className="badge bg-white text-dark fw-bold font-monospace py-1 mt-1">#{data.token}</span>
                    </div>
                </div>
                <div className="z-10 d-flex align-items-center gap-3">
                    <button onClick={handleDownloadPDF} className="btn btn-sm btn-outline-light"><Printer size={16} /></button>
                </div>
            </div>

            <div className="bg-light border-bottom d-flex align-items-center gap-4 px-4 py-2 text-uppercase fw-bold x-small text-muted">
                <div className="d-flex align-items-center gap-1"><Calendar size={14} /> {new Date(data.created_at).toLocaleDateString()}</div>
                <div className="d-flex align-items-center gap-1"><MapPin size={14} /> {details.location || data.location || 'Citywide'}</div>
            </div>

            {/* CONTENT */}
            <div className="flex-grow-1 overflow-y-auto bg-white p-5 d-flex flex-column align-items-center">
                <div className="container" style={{ maxWidth: '800px' }}>
                    {photoUrl && (
                        <div className="mb-4 rounded-3 overflow-hidden shadow-sm border">
                            <img src={photoUrl} className="w-100" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                        </div>
                    )}

                    <h1 className="display-6 fw-black text-dark mb-4 lh-sm">{data.title}</h1>

                    <div className="p-4 bg-orange-50 border-start border-4 border-orange-500 rounded-end mb-4">
                        <p className="lead fs-5 mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>{data.description}</p>
                    </div>

                    {details.instructions && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-secondary text-uppercase x-small ls-1 mb-2">Instructions</h6>
                            <ul className="list-group list-group-flush fw-medium">
                                {details.instructions.split('.').map((inst: string, i: number) => inst.trim() && (
                                    <li key={i} className="list-group-item px-0 bg-transparent border-0 d-flex gap-2">
                                        <span className="text-orange-600">•</span> {inst}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data.link_url && (
                        <div className="mt-4">
                            <h6 className="fw-bold text-secondary text-uppercase x-small ls-1 mb-2">External Resource</h6>
                            <a href={data.link_url} target="_blank" className="d-block p-3 border rounded bg-light text-decoration-none text-primary fw-bold text-truncate">
                                {data.link_url}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-3 bg-white border-top shadow d-flex justify-content-center">
                <button className="btn btn-dark btn-lg rounded-pill px-5 fw-bold text-uppercase shadow-sm">
                    <Share2 size={20} className="me-2" /> Share Alert
                </button>
            </div>
        </div>
    );
};
