// Client Details Interface
export interface ClientDetails {
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  pob: string;
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
  dobOrAdoptionDate?: string;
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
  lastVetVisitDate?: string;
}

// Overall Application Form Data Interface
export interface ApplicationFormData {
  client: ClientDetails;
  pet: PetDetails;
}