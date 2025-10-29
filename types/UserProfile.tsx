// seri-docker/sereinsoulchatbotui-main/types/UserProfile.tsx
// Define the structure matching the user_profile collection
export interface UserProfile {
    _id: string; // MongoDB default ID
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
    
    // --- NEW: Add summary and notes fields ---
    summary?: string | null;
    notes?: string | null;

    // --- NEW: Add IP and Location fields ---
    ipAddress?: string | null;
    location?: any | null; // Store the full location object from the API
    // ... add any other fields stored in user_profile
}