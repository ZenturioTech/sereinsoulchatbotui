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
    // ... add any other fields stored in user_profile
}