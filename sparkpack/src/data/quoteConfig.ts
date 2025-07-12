type AgeMultipliers = { [key: number]: number };
type BreedMultipliers = { [key: string]: number };
type PetTypeMultipliers = { [key: string]: number };
type BasePremiums = { [key: string]: number };
type DeductibleMapping = { [key: string]: string };
type ReimbursementMapping = { [key: string]: string };
type AccidentalDeathBenefitMapping = { [key: string]: string };
type BurialCremationAssistanceMapping = { [key: string]: string };


export const medicalCareQuoteConfig = {
  packageName: "Medical Care",
  basePremiums: {
    'basic-care-essential': 500,
    'basic-care-plus': 650,
    'basic-care-premium': 800,
  } as BasePremiums,
  deductibleMapping: {
    'basic-care-essential': '1,500',
    'basic-care-plus': '1,000',
    'basic-care-premium': '750',
  } as DeductibleMapping,
  reimbursementMapping: {
    'basic-care-essential': '70%',
    'basic-care-plus': '75%',
    'basic-care-premium': '80%',
  } as ReimbursementMapping,
  ageMultipliers: {
    0: 1.0,
    1: 1.05,
    2: 1.10,
    3: 1.15,
    4: 1.20,
    5: 1.25,
    6: 1.30,
    7: 1.35,
    8: 1.40,
    9: 1.45,
    10: 1.50,
    11: 1.55,
    12: 1.60,
  } as AgeMultipliers,
  breedMultipliers: {
    'Aspin': 1.0,
    'Puspin': 0.95,
    'Labrador Retriever': 1.1,
    'German Shepherd': 1.2,
    'Golden Retriever': 1.15,
    'French Bulldog': 1.3,
    'Poodle': 1.05,
    'Shih Tzu': 1.1,
    'Persian': 1.0,
    'Siamese': 0.98,
    'Pug': 1.25,
    'Beagle': 1.05,
    'Other Dog': 1.1,
    'Other Cat': 1.0,
  } as BreedMultipliers,
  petTypeMultipliers: {
    'dog': 1.0,
    'cat': 0.85,
  } as PetTypeMultipliers,
};

export const legacyInsuranceQuoteConfig = {
  packageName: "Legacy Insurance",
  basePremiums: {
    'legacy-standard': 260,
    'legacy-enhanced': 400,
  } as BasePremiums,
  accidentalDeathBenefit: {
    'legacy-standard': '₱12,000',
    'legacy-enhanced': '₱18,000',
  } as AccidentalDeathBenefitMapping,
  burialCremationAssistance: {
    'legacy-standard': '₱9,000',
    'legacy-enhanced': '₱12,000',
  } as BurialCremationAssistanceMapping,
  ageMultipliers: {
    0: 1.0,
    1: 1.0,
    2: 1.0,
    3: 1.05,
    4: 1.1,
    5: 1.15,
    6: 1.2,
    7: 1.25,
    8: 1.3,
    9: 1.4,
    10: 1.5,
    11: 1.6,
    12: 1.7,
    13: 1.8,
    14: 1.9,
    15: 2.0,
  } as AgeMultipliers,
  breedMultipliers: {
    'Aspin': 1.0,
    'Puspin': 0.98,
    'Labrador Retriever': 1.05,
    'German Shepherd': 1.1,
    'Golden Retriever': 1.08,
    'French Bulldog': 1.15,
    'Poodle': 1.03,
    'Shih Tzu': 1.07,
    'Persian': 0.99,
    'Siamese': 0.97,
    'Pug': 1.12,
    'Beagle': 1.04,
    'Other Dog': 1.08,
    'Other Cat': 0.99,
  } as BreedMultipliers,
  petTypeMultipliers: {
    'dog': 1.0,
    'cat': 0.90,
  } as PetTypeMultipliers,
};

export const medicareLegacyQuoteConfig = {
  packageName: "Medical Care & Legacy",
  basePremiums: {
    'complete-care': 1200, // Monthly premium for Tier 1
    'ultimate-care': 1800,  // Monthly premium for Tier 2
  } as BasePremiums,
  reimbursementMapping: {
    'complete-care': '80%',
    'ultimate-care': '90%',
  } as ReimbursementMapping,
  annualCoverageLimitMapping: {
    'complete-care': '₱60,000',
    'ultimate-care': '₱100,000',
  },
  deductibleMapping: {
    'complete-care': '1,500',
    'ultimate-care': '1,000',
  } as DeductibleMapping,
  accidentalDeathBenefit: {
    'complete-care': '₱20,000',
    'ultimate-care': '₱30,000',
  } as AccidentalDeathBenefitMapping,
  burialCremationAssistance: {
    'complete-care': '₱15,000',
    'ultimate-care': '₱20,000',
  } as BurialCremationAssistanceMapping,
  // Multipliers for age and breed (can be unique, or shared with Medical Care config if similar risk profiles apply)
  ageMultipliers: {
    0: 1.0,
    1: 1.07,
    2: 1.12,
    3: 1.18,
    4: 1.25,
    5: 1.32,
    6: 1.40,
    7: 1.48,
    8: 1.56,
    9: 1.65,
    10: 1.75,
    11: 1.85,
    12: 1.95,
  } as AgeMultipliers, // Can be adjusted as needed
  breedMultipliers: {
    'Aspin': 1.0,
    'Puspin': 0.93, // Cats often slightly lower
    'Labrador Retriever': 1.15,
    'German Shepherd': 1.25,
    'Golden Retriever': 1.2,
    'French Bulldog': 1.4, // Higher risk, higher combined premium
    'Poodle': 1.08,
    'Shih Tzu': 1.15,
    'Persian': 1.05,
    'Siamese': 1.0,
    'Pug': 1.3,
    'Beagle': 1.1,
    'Other Dog': 1.18,
    'Other Cat': 1.02,
  } as BreedMultipliers,
  petTypeMultipliers: {
    'dog': 1.0,
    'cat': 0.88,
  } as PetTypeMultipliers,
};


// Common breeds list for the calculator's dropdown (kept consistent for now)
export const commonBreeds = [
    'Aspin', 'Puspin', 'Labrador Retriever', 'German Shepherd', 'Golden Retriever',
    'French Bulldog', 'Poodle', 'Shih Tzu', 'Persian', 'Siamese', 'Pug', 'Beagle',
    'Other Dog', 'Other Cat' // Include generic options
];