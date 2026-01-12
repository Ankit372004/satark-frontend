export interface WantedPerson {
    id: string | number;
    name: string;
    alias: string;
    location: string;
    priority: string;
    reward: string;
    image?: string;
    image_url?: string;
    description: string;
    risk: 'EXTREME' | 'HIGH' | 'MODERATE' | 'MEDIUM' | 'CRITICAL';
    featured?: boolean;
    // Physical Description
    dob?: string;
    pob?: string; // Place of Birth
    hair?: string;
    eyes?: string;
    height?: string;
    weight?: string;
    sex?: string;
    race?: string;
    nationality?: string;
    scars?: string;
    // Additional Details
    remarks?: string;
    caution?: string;
    field_office?: string;
    media?: any[];
}
