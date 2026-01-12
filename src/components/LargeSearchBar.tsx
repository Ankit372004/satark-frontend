
import React from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '@/lib/theme';

interface LargeSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const LargeSearchBar: React.FC<LargeSearchBarProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="w-100 mb-4 px-2">
            <div
                className="d-flex align-items-center bg-white shadow-sm p-2 w-100"
                style={{
                    borderRadius: '50px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                <div className="ps-3 pe-2 text-muted">
                    <Search size={22} color={COLORS.navyBlue} />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "Search intelligence, cases, names, or IDs..."}
                    className="form-control border-0 shadow-none bg-transparent"
                    style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: COLORS.navyBlue
                    }}
                />
                <button
                    className="btn rounded-pill px-4 fw-bold text-white d-none d-sm-block"
                    style={{ background: COLORS.navyBlue }}
                >
                    Search
                </button>
            </div>
        </div>
    );
};
