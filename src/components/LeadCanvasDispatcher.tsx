import React from 'react';
import { WantedPersonCanvas } from './canvases/WantedPersonCanvas';
import { MissingPersonCanvas } from './canvases/MissingPersonCanvas';
import { AlertCanvas } from './canvases/AlertCanvas';
import { IntelligenceCanvas } from './canvases/IntelligenceCanvas';

interface LeadCanvasDispatcherProps {
    lead: any;
    className?: string;
}

export const LeadCanvasDispatcher: React.FC<LeadCanvasDispatcherProps> = ({ lead, className }) => {
    if (!lead) return null;

    const renderCanvas = () => {
        // Normalize status check
        const status = lead.status ? lead.status.toUpperCase() : 'SUBMITTED';

        // Explicit routing with clear business logic
        switch (status) {
            // Criminal notices
            case 'WANTED':
                return <WantedPersonCanvas data={lead} />;

            // Missing person alerts
            case 'MISSING':
                return <MissingPersonCanvas data={lead} />;

            // Public safety alerts
            case 'ALERT':
                return <AlertCanvas data={lead} />;

            // Intelligence gathering (police-initiated requests)
            case 'INFO_SEEKING':
                return <IntelligenceCanvas data={lead} />;

            // Citizen-submitted intelligence reports (all workflow states)
            case 'SUBMITTED':   // Initial submission
            case 'REVIEWED':    // Under review
            case 'ACTIONED':    // Action being taken
            case 'CLOSED':      // Closed cases
            case 'REJECTED':    // Rejected submissions
                return <IntelligenceCanvas data={lead} />;

            // Fallback for any unknown/future statuses
            default:
                console.warn(`Unknown lead status: ${status}, routing to IntelligenceCanvas`);
                return <IntelligenceCanvas data={lead} />;
        }
    };

    return (
        <div className={`h-100 ${className || ''}`}>
            {renderCanvas()}
        </div>
    );
};
