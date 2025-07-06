export interface ClientDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  pob?: string;
  gender: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  country: string;
  city: string;
  province: string;
  postalCode: string;
  declarationAccuracy: boolean;
}

export interface PetDetails {
  petName: string;
  dobOrAdoptionDate: string;
  estimatedAge?: string;
  weight: string;
  gender: '' | 'Male' | 'Female'; // Ensure it can be an empty string initially, or Male/Female
  species: string;
  otherSpecies?: string;
  breed: string;
  otherBreed?: string;
  microchipNumber?: string;
  colorMarkings?: string;
  spayedNeutered: '' | 'Yes' | 'No';
  vaccinationStatus: '' | 'Up-to-date' | 'Not up-to-date' | 'Unknown';
  lifestyle: '' | 'Indoor' | 'Outdoor' | 'Both';
  chronicIllness: '' | 'Yes' | 'No';
  chronicIllnessExplanation?: string;
  surgeryHistory: '' | 'Yes' | 'No';
  surgeryHistoryExplanation?: string;
  recurringConditions: '' | 'Yes' | 'No';
  recurringConditionsExplanation?: string;
  onMedication: '' | 'Yes' | 'No';
  onMedicationExplanation?: string;
  vetName?: string;
  vetClinicName?: string;
  clinicPhoneNumber?: string;
  clinicAddress?: string;
  lastVetVisitDate?: string;
}

export interface IncidentDetails {
  incidentOrSymptomDate: string;
  vetVisitDate: string;
  incidentType: '' | 'Accident' | 'Illness';
  previousRelatedConditions: '' | 'Yes' | 'No';
  reasonForClaim: '' | 'Illness' | 'Injury' | 'Wellness';
  // *** FIX: Add | undefined to optional string properties ***
  accidentDescription?: string | undefined;
  accidentLocation?: string | undefined;
  accidentWitnesses?: string | undefined;
  symptomsDescription?: string | undefined;
  symptomsFirstAppearance?: string | undefined;
  symptomsDuration?: string | undefined;
  affectedBodyPart?: string | undefined; // This was the problematic one
  previousConditionDetails?: string | undefined;
}

export interface VeterinaryClinicTreatmentDetails {
  clinicName: string;
  clinicAddress: string;
  clinicPhoneNumber: string;
  attendingVetName: string;
  treatmentDates: string;
  diagnosis: string;
  treatmentProvided: string;
  prognosis?: string | undefined; // *** FIX: Add | undefined ***
  isEmergency: '' | 'Yes' | 'No';
}

export interface FinancialReimbursementDetails {
  totalVetBillAmount: string;
  itemizedBillAttached: '' | 'Yes' | 'No';
  officialReceiptsAttached: '' | 'Yes' | 'No';
  reimbursementMethod: '' | 'Credit/Debit Card' | 'Bank Transfer' | 'GCash' | 'Cash/Cheque';
  preferredContactForUpdates: '' | 'Email' | 'SMS';
  // *** FIX: Add | undefined to optional string properties ***
  cardNumber?: string | undefined;
  cardName?: string | undefined;
  expiryDate?: string | undefined;
  cvv?: string | undefined;
  bankName?: string | undefined;
  accountNumber?: string | undefined;
  accountName?: string | undefined;
  gcashNumber?: string | undefined;
  gcashName?: string | undefined;
  reimbursementDescription?: string | undefined;
}

export interface DeclarationsAuthorizationDetails {
  declarationTruthfulnessAccepted: boolean;
  medicalRecordsAuthorizationAccepted: boolean;
  dataPrivacyConsentAccepted: boolean;
  policyholderSignatureName: string;
  signatureDate: string;
}

export interface ClaimFormData {
  policyNumber: string;
  client: ClientDetails;
  petDetails: PetDetails;
  incidentDetails: IncidentDetails;
  veterinaryClinicTreatmentDetails: VeterinaryClinicTreatmentDetails;
  financialReimbursementDetails: FinancialReimbursementDetails;
  declarationsAuthorization: DeclarationsAuthorizationDetails;
}