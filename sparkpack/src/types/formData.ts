// Client Details Interface
export interface ClientDetails {
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  pob: string; // Place of Birth
  gender: string;
  allowPhoneCollection: boolean;
  phoneNumber?: string;
  email: string;
  streetAddress: string;
  country: string;
  city: string;
  province: string;
  postalCode: string;
  declarationAccuracy: boolean;
}

// Pet Details Interface
export interface PetDetails {
  petName: string;
  dobOrAdoptionDate: string;
  estimatedAge: string;
  gender: string;
  species: string;
  otherSpecies?: string;
  breed: string;
  otherBreed?: string;
  microchipNumber?: string;
  colorMarkings: string;
  spayedNeutered: string;
  vaccinationStatus: string;
  lifestyle: string;
  chronicIllness: string;
  chronicIllnessExplanation?: string;
  surgeryHistory: string;
  surgeryHistoryExplanation?: string;
  recurringConditions: string;
  recurringConditionsExplanation?: string;
  onMedication: string;
  onMedicationExplanation?: string;
  vetName: string;
  vetClinicName: string;
  clinicPhoneNumber: string;
  clinicAddress: string;
  lastVetVisitDate: string;
}

// Product Details Interface
export interface ProductDetails {
  productName: string; 
  coverageType: string; 
  coverageAmount: string; 
  deductible: string; 
  reimbursementRate: string; 
  paymentFrequency: string; 
  startDate: string; 
  coverageLength: string; 
}

// Define the overall ApplicationFormData interface to include all steps
export interface ApplicationFormData {
  client: ClientDetails;
  pet: PetDetails;
  product: ProductDetails;
}