// API Configuration - Single Source of Truth
// All API endpoints and constants should be imported from this file

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Lead endpoints
    leads: `${API_BASE_URL}/api/leads`,
    publicLeads: `${API_BASE_URL}/api/leads/public-leads`,
    publicLeadDetail: (id: string) => `${API_BASE_URL}/api/leads/public-leads/${id}`,
    voteLead: (id: string) => `${API_BASE_URL}/api/leads/public-leads/${id}/vote`,
    trackLead: (token: string) => `${API_BASE_URL}/api/leads/track/${token}`,
    leadDetail: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
    forwardLead: (id: string) => `${API_BASE_URL}/api/leads/${id}/forward`,
    updateLeadStatus: (id: string) => `${API_BASE_URL}/api/leads/${id}/status`,
    assignLead: (id: string) => `${API_BASE_URL}/api/leads/${id}/assign`,
    submitATR: (id: string) => `${API_BASE_URL}/api/leads/${id}/atr`,
    pinLead: (id: string) => `${API_BASE_URL}/api/leads/${id}/pin`,
    rateLead: (id: string) => `${API_BASE_URL}/api/leads/${id}/rate`,
    updateNotes: (id: string) => `${API_BASE_URL}/api/leads/${id}/notes`,

    // Auth endpoints
    login: `${API_BASE_URL}/api/auth/login`,

    // Unit endpoints
    unitHierarchy: `${API_BASE_URL}/api/units/hierarchy`,
} as const;

// Valid status values (must match database constraint)
export const LEAD_STATUS = {
    SUBMITTED: 'SUBMITTED',
    REVIEWED: 'REVIEWED',
    ACTIONED: 'ACTIONED',
    CLOSED: 'CLOSED',
    REJECTED: 'REJECTED',
    WANTED: 'WANTED',
    MISSING: 'MISSING',
    ALERT: 'ALERT',
    INFO_SEEKING: 'INFO_SEEKING',
} as const;

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

// Valid priority values (must match database constraint)
export const LEAD_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
} as const;

export type LeadPriority = typeof LEAD_PRIORITY[keyof typeof LEAD_PRIORITY];

// Reward status values
export const REWARD_STATUS = {
    NONE: 'NONE',
    ACTIVE: 'ACTIVE',
    RECOMMENDED: 'RECOMMENDED',
    APPROVED: 'APPROVED',
    CLAIMED: 'CLAIMED',
} as const;

export type RewardStatus = typeof REWARD_STATUS[keyof typeof REWARD_STATUS];

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });
    return queryParams.toString();
};

// Helper function for API calls with error handling
export const apiCall = async <T = any>(
    url: string,
    options?: RequestInit
): Promise<{ data?: T; error?: string }> => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || `HTTP ${response.status}: ${response.statusText}` };
        }

        return { data };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Network error' };
    }
};

export default API_ENDPOINTS;
