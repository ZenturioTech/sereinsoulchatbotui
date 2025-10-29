// seri-docker/sereinsoulchatbotui-main/types/UserProfile.tsx

// --- NEW: Define structure for history entry ---
export interface EditHistoryEntry {
    field: string; // e.g., 'summary', 'notes'
    timestamp: string; // ISO date string
    admin: string; // Admin's phone number
}
// ------------------------------------------

export interface UserProfile {
    _id: string;
    phoneNumber: string;
    name?: string | null;
    age?: number | null;
    gender?: string | null;
    lastUpdatedAt?: string;
    educationalQualification?: string | null;
    occupation?: string | null;
    religion?: string | null;
    maritalStatus?: string | null;
    familyStructure?: string | null;
    livingArrangement?: string | null;
    familyBonding?: string | null;
    summary?: string | null;
    notes?: string | null;
    ipAddress?: string | null;
    location?: any | null;

    // --- NEW: Add editHistory array ---
    editHistory?: EditHistoryEntry[];
    // ----------------------------------
}