// sparkpack/src/types/formData.ts

// Import shared types from applicationFormData.ts
import { ClientDetails, PetDetails } from './applicationFormData';

// Claim-specific interfaces
export interface IncidentDetails {
  incidentOrSymptomDate: string;
  vetVisitDate: string;
  incidentType: '' | 'Accident' | 'Illness';
  previousRelatedConditions: '' | 'Yes' | 'No';
  reasonForClaim: '' | 'Illness' | 'Injury' | 'Wellness';
  accidentDescription?: string;
  accidentLocation?: string;
  accidentWitnesses?: string;
  symptomsDescription?: string;
  symptomsFirstAppearance?: string;
  symptomsDuration?: string;
  affectedBodyPart?: string;
  previousConditionDetails?: string;
}

export interface VeterinaryClinicTreatmentDetails {
  clinicName: string;
  clinicAddress: string;
  clinicPhoneNumber: string;
  attendingVetName: string;
  treatmentDates: string;
  diagnosis: string;
  treatmentProvided: string;
  prognosis?: string;
  isEmergency: '' | 'Yes' | 'No';
}

export interface FinancialReimbursementDetails {
  totalVetBillAmount: string;
  itemizedBillAttached: '' | 'Yes' | 'No';
  officialReceiptsAttached: '' | 'Yes' | 'No';
  reimbursementMethod: '' | 'Credit/Debit Card' | 'Bank Transfer' | 'GCash' | 'Cash/Cheque';
  preferredContactForUpdates: '' | 'Email' | 'SMS';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  gcashNumber?: string;
  gcashName?: string;
  reimbursementDescription?: string;
}

export interface DeclarationsAuthorizationDetails {
  declarationTruthfulnessAccepted: boolean;
  medicalRecordsAuthorizationAccepted: boolean;
  dataPrivacyConsentAccepted: boolean;
  policyholderSignatureName: string;
  signatureDate: string;
}

// ClaimFormData now uses imported ClientDetails and PetDetails
export interface ClaimFormData {
  policyNumber: string;
  client: ClientDetails; // Imported from applicationFormData
  petDetails: PetDetails; // Imported from applicationFormData
  incidentDetails: IncidentDetails;
  veterinaryClinicTreatmentDetails: VeterinaryClinicTreatmentDetails;
  financialReimbursementDetails: FinancialReimbursementDetails;
  declarationsAuthorization: DeclarationsAuthorizationDetails;
}

// NOTE: ApplicationFormData and its direct sub-interfaces (ClientDetails, PetDetails, ProductDetails, PaymentDetails)
// are now exclusively defined in sparkpack/src/types/applicationFormData.ts to prevent type conflicts.
// This file (formData.ts) should only contain types specific to claims or other distinct forms.