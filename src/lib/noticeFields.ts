export const WANTED_PERSON_FIELDS = {
    personalDetails: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'alias', label: 'Alias / Nickname', type: 'text', placeholder: 'e.g., "Vicky Don, VK"' },
        { name: 'dob', label: 'Date of Birth', type: 'text', placeholder: 'DD/MM/YYYY or Age' },
        { name: 'pob', label: 'Place of Birth', type: 'text' },
        { name: 'place_of_birth', label: 'Full Place of Birth', type: 'text', placeholder: 'City, State, Country' },
        { name: 'nationality', label: 'Nationality', type: 'text' },
        { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'race', label: 'Race / Ethnicity', type: 'select', options: ['Asian (South Asian)', 'Asian (East Asian)', 'Black', 'White', 'Hispanic', 'Middle Eastern', 'Mixed', 'Other'] },
    ],
    physicalDetails: [
        { name: 'height', label: 'Height', type: 'text', placeholder: "e.g., 5'11\" or 180 cm" },
        { name: 'weight', label: 'Weight', type: 'text', placeholder: 'e.g., 85 kg or 187 lbs' },
        { name: 'build', label: 'Build', type: 'select', options: ['Slim', 'Medium', 'Athletic', 'Muscular', 'Heavy', 'Obese'] },
        { name: 'complexion', label: 'Complexion', type: 'select', options: ['Fair', 'Wheatish', 'Dusky', 'Dark'] },
        { name: 'eyes', label: 'Eyes', type: 'text' },
        { name: 'hair', label: 'Hair', type: 'text' },
    ],
    identifyingMarks: [
        { name: 'scars', label: 'Scars (Brief)', type: 'text', placeholder: 'e.g., Scar on left cheek' },
        { name: 'scars_marks', label: 'Detailed Scars & Marks', type: 'textarea', rows: 3, placeholder: 'Detailed description of all visible scars, marks, or deformities' },
        { name: 'tattoo_descriptions', label: 'Tattoo Descriptions', type: 'tags', placeholder: 'Enter tattoo description and press Enter. e.g., "Skull tattoo on right forearm"' },
    ],
    crimeDetails: [
        {
            name: 'category',
            label: 'Crime Category',
            type: 'select',
            required: true,
            options: [
                { value: 'terrorism', label: 'Terrorism' },
                { value: 'kidnapping', label: 'Kidnapping / Abduction' },
                { value: 'cyber', label: 'Cyber Crime' },
                { value: 'organized', label: 'Organized Crime' },
                { value: 'drugs', label: 'Narcotics / Drugs' },
                { value: 'laundering', label: 'Money Laundering' },
                { value: 'corruption', label: 'Corruption' },
                { value: 'trafficking', label: 'Human Trafficking' },
                { value: 'other', label: 'Other/General' }
            ]
        },
        { name: 'charges', label: 'Criminal Charges', type: 'tags', required: true, placeholder: 'Enter each charge and press Enter' },
        { name: 'crime_date', label: 'Crime Date', type: 'text', placeholder: 'DD/MM/YYYY' },
        { name: 'crime_location', label: 'Crime Location', type: 'textarea', rows: 2, placeholder: 'Full address and description of crime scene' },
        { name: 'crime_description', label: 'Crime Narrative', type: 'textarea', required: true, rows: 5 },
    ],
    warrantDetails: [
        { name: 'warrant_date', label: 'Warrant Issue Date', type: 'text', placeholder: 'DD/MM/YYYY' },
        { name: 'warrant_court', label: 'Issuing Court', type: 'text', placeholder: 'e.g., Tis Hazari District Court' },
        { name: 'warrant_number', label: 'Warrant Number', type: 'text', placeholder: 'e.g., WRT/234/2023/TH' },
        { name: 'unlawful_flight_date', label: 'Unlawful Flight Date (if applicable)', type: 'text', placeholder: 'DD/MM/YYYY' },
    ],
    operationalInfo: [
        { name: 'field_office', label: 'Responsible Field Office', type: 'text', placeholder: 'e.g., Crime Branch - Karol Bagh' },
        { name: 'armed_and_dangerous', label: 'Armed and Dangerous', type: 'checkbox' },
        { name: 'special_cautions', label: 'Special Cautions / Warnings', type: 'textarea', rows: 3, placeholder: 'Detailed operational warnings for law enforcement' },
        { name: 'caution', label: 'Brief Caution (Public Display)', type: 'textarea', rows: 2, placeholder: 'Public-facing warning, e.g., "ARMED AND DANGEROUS"' },
    ],
    knownTies: [
        { name: 'ties_locations', label: 'Known Ties / Locations', type: 'tags', placeholder: 'Enter location and press Enter, e.g., "Dubai, UAE"' },
        { name: 'last_seen_date', label: 'Last Seen Date', type: 'text', placeholder: 'DD/MM/YYYY' },
        { name: 'last_seen_location', label: 'Last Seen Location', type: 'textarea', rows: 2, placeholder: 'Detailed description of last sighting' },
    ],
    backgroundRemarks: [
        { name: 'remarks', label: 'Background & Intelligence Remarks', type: 'textarea', rows: 5, placeholder: 'Gang affiliations, criminal history, behavioral patterns, known associates, etc.' },
        { name: 'risk', label: 'Overall Risk Level', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] },
    ]
};

export const MISSING_PERSON_FIELDS = {
    personalDetails: [
        { name: 'name', label: ' Name', type: 'text', required: true },
        {
            name: 'category',
            label: 'Case Category',
            type: 'select',
            required: true,
            options: [
                { value: 'kidnapping', label: 'Kidnapping / Missing' },
                { value: 'parental_kidnapping', label: 'Parental Kidnapping' },
                { value: 'trafficking', label: 'Human Trafficking' },
                { value: 'other', label: 'Runaway / Other' }
            ]
        },
        { name: 'guardian_name', label: 'Guardian Name', type: 'text' },
        { name: 'guardian_occupation', label: 'Guardian Occupation', type: 'text' },
        { name: 'dob', label: 'Date of Birth', type: 'date' },
        { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
    ],
    // ... rest of fields
    physicalDetails: [
        { name: 'height', label: 'Height', type: 'text', placeholder: "e.g., 5'4\"" },
        { name: 'weight', label: 'Weight', type: 'text', placeholder: 'e.g., 60 kg' },
        { name: 'build', label: 'Build', type: 'select', options: ['Thin', 'Normal', 'Heavy', 'Athletic'] },
        { name: 'complexion', label: 'Complexion', type: 'select', options: ['Fair', 'Wheatish', 'Dark'] },
        { name: 'eyes', label: 'Eyes', type: 'text', placeholder: 'Color, Shape' },
        { name: 'hair', label: 'Hair', type: 'text', placeholder: 'Color, Style' },
    ],
    incidentDetails: [
        { name: 'missing_from', label: 'Missing From (Full Address)', type: 'textarea', required: true, rows: 2 },
        { name: 'missing_date', label: 'Date Missing', type: 'date', required: true },
        { name: 'missing_time', label: 'Time Missing', type: 'text', placeholder: 'e.g., Approx 4 PM' },
    ],
    dressDetails: [
        { name: 'dress_description', label: 'Dress Description', type: 'textarea', rows: 3, placeholder: 'Details of clothing, color, etc.' },
        { name: 'belongings', label: 'Other Belongings', type: 'text', placeholder: 'Bag, watch, jewelry, etc.' },
    ],
    contactInfo: [
        { name: 'guardian_contact', label: 'Guardian Phone', type: 'text', placeholder: 'Mobile Number' },
        { name: 'guardian_address', label: 'Guardian Address', type: 'textarea', rows: 2 },
    ],
    jurisdictionDetails: [
        { name: 'police_station', label: 'Police Station / Unit', type: 'text', required: true },
        { name: 'district', label: 'District', type: 'text' },
        { name: 'fir_number', label: 'FIR / DD No.', type: 'text' },
        { name: 'fir_date', label: 'FIR / DD Date', type: 'date' },
    ],
    additionalDetails: [
        { name: 'physical_deformity', label: 'Physical Deformity / Scars', type: 'textarea', rows: 2 },
        { name: 'remarks', label: 'Additional Remarks', type: 'textarea', rows: 3 },
    ],
    lastSeenDetails: [
        { name: 'last_seen_date', label: 'Last Seen Date', type: 'date' },
        { name: 'last_seen_time', label: 'Last Seen Time', type: 'text' },
        { name: 'last_seen_location', label: 'Last Seen Location', type: 'textarea', rows: 2 },
    ]
};

export const ALERT_FIELDS = {
    alertDetails: [
        { name: 'title', label: 'Alert Title', type: 'text', required: true },
        {
            name: 'category',
            label: 'Alert Category',
            type: 'select',
            required: true,
            options: [
                { value: 'other', label: 'Public Safety (General)' },
                { value: 'terrorism', label: 'Terror Threat' },
                { value: 'organized', label: 'Civil Disturbance' },
                { value: 'cyber', label: 'Cyber Threat' }
            ]
        },
        { name: 'description', label: 'Alert Description', type: 'textarea', required: true },
        { name: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        { name: 'link_url', label: 'Social Media Link (Optional)', type: 'text', placeholder: 'e.g. https://x.com/DelhiPolice/status/...' },
    ]
};

export const SEEKING_INFO_FIELDS = {
    incidentDetails: [
        { name: 'incident_title', label: 'Incident Title', type: 'text', required: true },
        { name: 'incident_description', label: 'Incident Description', type: 'textarea', required: true, rows: 4 },
        { name: 'incident_date', label: 'Incident Date', type: 'date' },
        { name: 'incident_location', label: 'Incident Location', type: 'text' },
    ],
    seekingInfo: [
        { name: 'seeking_description', label: 'What Information is Needed?', type: 'textarea', required: true, rows: 4, placeholder: 'Specific details you are looking for...' },
        { name: 'contact_person', label: 'Primary Contact Person', type: 'text' },
        { name: 'contact_number', label: 'Contact Number / Extension', type: 'text' },
    ]
};

export const GENERAL_INTELLIGENCE_FIELDS = {
    basicInfo: [
        { name: 'title', label: 'Intelligence Title', type: 'text', required: true, placeholder: 'Brief summary of the intelligence' },
        { name: 'category', label: 'Intel Category', type: 'select', options: ['Security', 'Criminal', 'Political', 'Cyber', 'Economic', 'Other'] },
        { name: 'priority', label: 'Confidence Level', type: 'select', options: ['UNVERIFIED', 'LOW', 'MEDIUM', 'HIGH', 'CONFIRMED'] },
    ],
    description: [
        { name: 'description', label: 'Detailed Intelligence Narrative', type: 'textarea', required: true, rows: 6 },
        { name: 'location', label: 'Primary Location of Interest', type: 'text', placeholder: 'Address, coordinates, or landmark' },
        { name: 'observation_time', label: 'Time of Observation', type: 'datetime-local' },
    ],
    subjectInfo: [
        { name: 'subject_name', label: 'Subject Name / Alias', type: 'text', placeholder: 'Name or unknown' },
        { name: 'subject_description', label: 'Subject Description', type: 'textarea', rows: 3, placeholder: 'Physical appearance, clothing, behavior...' },
        { name: 'vehicle_details', label: 'Vehicle Details', type: 'text', placeholder: 'Make, Model, License Plate, Color' },
    ],
    options: [
        { name: 'is_public', label: 'Publish to Public Portal', type: 'checkbox', defaultValue: false },
        { name: 'is_anonymous', label: 'Keep Reporter Anonymous', type: 'checkbox', defaultValue: true },
    ]
};
