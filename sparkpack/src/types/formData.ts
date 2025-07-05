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

// Interface for a single selected add-on
export interface SelectedAddOn {
  id: string; // Unique identifier for the add-on
  name: string;
  price: number;
  type: 'one-time' | 'annual';
}

// Product Details Interface - UPDATED
export interface ProductDetails {
  productName: string;
  coverageType: string; // Could be 'Basic', 'Premium', etc., or just derived
  coverageAmount: string; // e.g., '₱20,000'
  deductible: string;     // e.g., '₱1,000'
  reimbursementRate: string; // e.g., '80%'
  paymentFrequency: string; // 'Annually' or 'Monthly'
  startDate: string;      //YYYY-MM-DD
  coverageLength: string; // e.g., '1 Year'
  selectedAddOns: SelectedAddOn[]; // NEW: Array to store selected add-ons
  donationPercentage: number; // NEW: 0, 1, 2, 3, 5 (as a percentage, e.g., 2 for 2%)
}

// Interface for Add-on Definitions (used internally in ProductDetailsStep.tsx)
export interface AddOnDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'one-time' | 'annual'; // Is it a one-time charge or adds to annual premium?
  availableFor: string[]; // Which base products can this add-on be selected for?
}

// This interface is specific to the productOptions array in ProductDetailsStep
export interface ProductOption {
  name: string;
  description: string;
  premiumRange: string;
  coverageRange: string;
  details: string[]; 
  iconKey: string;
  coverageOptions?: string[];
  deductibleOptions?: string[];
  reimbursementOptions?: string[];
  paymentFreqOptions?: string[];
  fullDetails: {
    [key: string]: string[]; // For accordion content, e.g., 'Key Benefits': ['...']
  };
}

// Define the overall ApplicationFormData interface to include all steps
export interface ApplicationFormData {
  client: ClientDetails;
  pet: PetDetails;
  product: ProductDetails;
}