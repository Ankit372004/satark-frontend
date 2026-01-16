export const DELHI_POLICE_HIERARCHY = {
    "TERRITORIAL": [
        "Central District",
        "North District",
        "North-West District",
        "Rohini District",
        "Outer District",
        "Outer-North District",
        "East District",
        "North-East District",
        "Shahdara District",
        "South District",
        "South-East District",
        "South-West District",
        "West District",
        "Dwarka District",
        "New Delhi District"
    ],
    "SPECIALIZED": [
        "IGI Airport Police",
        "Railway Police",
        "Metro Rail Police",
        "Crime Branch",
        "Special Cell",
        "Economic Offences Wing (EOW)",
        "Special Police Unit for Women an Children (SPUWAC)",
        "Cyber Crime Unit / IFSO",
        "Special Task Force (STF)",
        "Vigilance",
        "Security Unit",
        "Traffic Police",
        "Special Branch (Intelligence)",
        "Special Unit for North East Region (SPUNER)"
    ],
    "ADMINISTRATIVE": [
        "Police Headquarters (PHQ)",
        "Operations & Communication",
        "Police Control Room (PCR)",
        "Delhi Armed Police (DAP)",
        "Licensing Branch",
        "Training Division",
        "Provisioning & Logistics",
        "Legal Cell",
        "Welfare Unit",
        "Recruitment Cell",
        "Anti-Riot Cell",
        "Finger Print Bureau",
        "Missing Persons Squad"
    ]
} as const;

export type DivisionType = keyof typeof DELHI_POLICE_HIERARCHY;

// Mock function to simulate fetching stations based on district
export const getStationsForDistrict = (district: string): string[] => {
    // In a real app, this would fetch from an API or large JSON
    const common = ["Civil Lines", "Model Town", "Kotwali", "Parliament Street", "Connaught Place", "Vasant Vihar", "Hauz Khas", "Saket", "Kalkaji", "Lajpat Nagar", "Preet Vihar", "Mayur Vihar"];

    // Deterministic pseudo-random stations for demo purposes allowing "Auto Fetch" effect
    if (district.includes("Traffic")) return ["Traffic Circle HQ", "Challan Branch", "Accident Investigation Unit"];
    if (district.includes("Crime")) return ["Inter-State Cell", "Anti-Extortion Cell", "SOS Unit", "Narcotics Cell"];
    if (district.includes("Special Cell")) return ["Counter Intelligence", "Northern Range", "Southern Range", "New Delhi Range"];
    if (district.includes("Airport")) return ["IGIA Terminal 3", "IGIA Terminal 1", "Cargo Complex"];

    // Return a subset of common stations + District HQ
    return [`${district.split(' ')[0]} Head Quarters`, "Cyber Cell", ...common.slice(0, 4)];
};
