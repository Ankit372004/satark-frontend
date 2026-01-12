export const LEAD_CATEGORIES = [
    { id: 'terrorism', label: 'Terrorism' },
    { id: 'kidnapping', label: 'Kidnappings / Missing' },
    { id: 'cyber_crime', label: 'Cyber Crime' }, // was 'cyber'
    { id: 'organized_crime', label: 'Organized Crime' }, // was 'organized'
    { id: 'drug_rackets', label: 'Drug Rackets' }, // was 'drugs'
    { id: 'money_laundering', label: 'Money Laundering' }, // was 'laundering'
    { id: 'corruption', label: 'Corruption' },
    { id: 'parental_kidnappings', label: 'Parental Kidnappings' }, // was 'parental_kidnapping'
    { id: 'human_trafficking', label: 'Human Trafficking' }, // was 'trafficking'
    { id: 'seeking_info', label: 'Seeking Information' }, // was 'info'
    { id: 'other', label: 'Other' }
];

export const PHYSICAL_ATTRIBUTES = {
    sex: ['Male', 'Female', 'Other', 'Unknown'],
    build: ['Small', 'Medium', 'Athletic', 'Heavy', 'Obese'],
    complexion: ['Fair', 'Wheatish', 'Dark', 'Very Dark', 'Albino'],
    hair: ['Black', 'Brown', 'Blonde', 'Gray', 'White', 'Bald', 'Red'],
    eyes: ['Black', 'Brown', 'Blue', 'Green', 'Gray', 'Hazel'],
    race: ['Asian', 'Black', 'White', 'Hispanic', 'Middle Eastern', 'Native American', 'Pacific Islander', 'Mixed', 'Unknown']
};

export const NOTICE_TYPES = [
    { value: 'SUBMITTED', label: 'General Intelligence (Draft)' },
    { value: 'WANTED', label: 'WANTED FUGITIVE (Red Corner)' },
    { value: 'MISSING', label: 'MISSING PERSON (Yellow Corner)' },
    { value: 'ALERT', label: 'PUBLIC SAFETY ALERT' },
    { value: 'INFO_SEEKING', label: 'Seeking Information (Blue Corner)' }
];
