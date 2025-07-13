export interface ClientDetails {
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  pob?: string;
  gender: string;
  allowPhoneCollection: boolean;
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
  gender: '' | 'Male' | 'Female';
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

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  type: 'one-time' | 'annual';
}

export interface ProductOption {
  name: string;
  description: string;
  premiumRange: string;
  coverageRange: string;
  details: string[];
  iconKey: string;
  coverageOptions: string[];
  deductibleOptions: string[];
  reimbursementOptions: string[];
  paymentFreqOptions: string[];
  fullDetails: { [key: string]: string[] };
}

export interface AddOnDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'one-time' | 'annual';
  availableFor: string[];
}


export interface ProductDetails {
  productName: string;
  planType: string;
  coverageAmount: string;
  deductible: string; // Changed to string
  reimbursementRate: string;
  paymentFrequency: string;
  startDate: string;
  coverageLength: string;
  selectedAddOns: SelectedAddOn[];
  donationPercentage: number;
  // Added these fields to ProductDetails to make them accessible for premium calculation
  petAge: number;
  petBreed: string;
  hasPreExistingConditions: boolean;
}

export interface PaymentDetails {
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
}

export interface ApplicationFormData {
  clientDetails: ClientDetails;
  petDetails: PetDetails;
  productDetails: ProductDetails;
  paymentDetails: PaymentDetails;
}