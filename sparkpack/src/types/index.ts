export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserCreateInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  Country?: string;
  City?: string;
  Pronvince?: string;
  PostalCode?: number;
}

export interface PetCreateInput {
  name: string;
  species: 'DOG' | 'CAT' | 'OTHER';
  breed?: string;
  dateOfBirth?: Date;
  gender?: string;
  weight?: number;
  medicalConditions?: string[];
}

export interface ApplicationCreateInput {
  petId: string;
  policyNumber: string;
  planType: 'MEDICAL_CARE_INSURANCE' | 'LEGACY_INSURANCE' | 'MEDICARE_AND_LEGACY_INSURANCE' | 'SINGLE_PRODUCT';
  premiumAmount: number;
  deductible: number;
  coverageLimit?: number;
  startDate: Date;
  endDate?: Date;
}

export interface ClaimCreateInput {
  applicationId: string;
  claimNumber: string;
  incidentDate: Date;
  claimAmount: number;
  description?: string;
  veterinarianName?: string;
  veterinarianContact?: string;
  documents?: string[];
}
