// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }

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
  client: {
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    pob: string;
    gender: string;
    phoneNumber: string;
    email: string;
    streetAddress: string;
    country: string;
    city: string;
    province: string;
    postalCode: string;
    declarationAccuracy: boolean;
  };
  pet: {
    petName: string;
    dobOrAdoptionDate?: string;
    estimatedAge?: string;
    gender?: string;
    species: 'DOG' | 'CAT' | 'OTHER';
    otherSpecies?: string;
    breed?: string;
    otherBreed?: string;
    microchipNumber?: string;
    colorMarkings?: string;
    spayedNeutered?: boolean | string;
    vaccinationStatus?: 'UP_TO_DATE' | 'NOT_VACCINATED' | 'PARTIALLY_VACCINATED';
    lifestyle?: string;
    chronicIllness?: string;
    chronicIllnessExplanation?: string;
    surgeryHistory?: string;
    surgeryHistoryExplanation?: string;
    recurringConditions?: string;
    recurringConditionsExplanation?: string;
    onMedication?: string;
    onMedicationExplanation?: string;
    vetName?: string;
    vetClinicName?: string;
    clinicPhoneNumber?: string;
    clinicAddress?: string;
    lastVetVisitDate?: string;
  };
  product: {
    productName: string;
    coverageAmount: string;
    deductible: string;
    reimbursementRate: string;
    paymentFrequency: string;
    startDate: string;
    coverageLength: string;
    selectedAddOns: {
      id: string;
      name: string;
      price: number;
      type: string;
    }[];
    donationPercentage: number;
  };
  payment: {
    paymentMethod: string;
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    gcashNumber?: string;
    gcashName?: string;
    transactionId?: string;
  };
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
