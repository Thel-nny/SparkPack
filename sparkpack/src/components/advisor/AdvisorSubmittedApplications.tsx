'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';
import { Filter, ChevronDown, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Import the ApplicationSummaryModal and ApplicationFormData type
import ApplicationSummaryModal from '@/components/advisor/applications/ApplicationSummaryModal';
import { ApplicationFormData } from '@/types/formData'; // Ensure this path is correct

// Define the type for an individual application (minimal data for table)
interface Application {
  id: string;
  status: 'Submitted' | 'Approved' | 'Denied';
  ensured: string;
  owners: string[];
  product: 'Medical Care Insurance' | 'Legacy Insurance';
  coverageAmount: number; // Stored as a number, formatted for display
  dateStarted: string; // Using string for simplicity, e.g., 'YYYY-MM-DD'
  policyNumber: string; // 'N/A' for in-progress applications
}

// --- MOCK DATA FOR FULL APPLICATION SUMMARY ---
// This is crucial. In a real app, you would fetch this data from your backend
// using the `id` of the clicked application.
const mockFullApplicationData: { [key: string]: ApplicationFormData } = {
  'sub-011': {
    client: { title: 'Mr.', firstName: 'Frodo', middleName: '', lastName: 'Baggins', dob: '1980-01-01', pob: 'Shire', gender: 'Male', phoneNumber: '09171234567', email: 'frodo@example.com', streetAddress: 'Bag End, Hobbiton', city: 'Shire', province: 'Middle-earth', postalCode: '12345', country: 'The World', declarationAccuracy: true, allowPhoneCollection: true }, // Added allowPhoneCollection
    pet: { petName: 'Pippin the Ferret', dobOrAdoptionDate: '2023-03-10', estimatedAge: '2 years', gender: 'Male', species: 'Ferret', otherSpecies: '', breed: 'Domestic Ferret', otherBreed: '', microchipNumber: '123456789012345', colorMarkings: 'Sable', spayedNeutered: 'Yes', vaccinationStatus: 'Up-to-date', lifestyle: 'Active', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Samwise Gamgee', vetClinicName: 'Shire Animal Clinic', clinicPhoneNumber: '09187654321', clinicAddress: 'Green Dragon Road, Hobbiton', lastVetVisitDate: '2024-02-28', weight: '0.5 kg' }, // Added weight
    product: { productName: 'Medical Care Insurance', coverageAmount: '40000', deductible: '2000', reimbursementRate: '80%', paymentFrequency: 'Monthly', startDate: '2024-01-05', coverageLength: '1 Year', selectedAddOns: [{ id: 'wellness', name: 'Wellness Package', price: 5000, type: 'annual' }], donationPercentage: 5, planType: 'Standard' }, // Added planType
    payment: { paymentMethod: 'Credit/Debit Card', cardNumber: '1234567890123456', cardName: 'Frodo Baggins', expiryDate: '12/26', cvv: '123', bankName: '', accountNumber: '', accountName: '', gcashNumber: '', gcashName: '' }
  },
  'sub-012': {
    client: { title: 'Mr.', firstName: 'Bilbo', middleName: '', lastName: 'Baggins', dob: '1960-09-22', pob: 'Shire', gender: 'Male', phoneNumber: '09198765432', email: 'bilbo@example.com', streetAddress: 'Bag End, Hobbiton', city: 'Shire', province: 'Middle-earth', postalCode: '12345', country: 'The World', declarationAccuracy: true, allowPhoneCollection: true }, // Added allowPhoneCollection
    pet: { petName: 'Gandalf the Grey', dobOrAdoptionDate: '2022-01-15', estimatedAge: '3 years', gender: 'Male', species: 'Cat', otherSpecies: '', breed: 'Maine Coon', otherBreed: '', microchipNumber: '987654321098765', colorMarkings: 'Grey', spayedNeutered: 'Yes', vaccinationStatus: 'Up-to-date', lifestyle: 'Indoor', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Elrond', vetClinicName: 'Rivendell Veterinary', clinicPhoneNumber: '09201234567', clinicAddress: 'Rivendell Valley', lastVetVisitDate: '2024-03-01', weight: '6 kg' }, // Added weight
    product: { productName: 'Legacy Insurance', coverageAmount: '150000', deductible: '5000', reimbursementRate: '90%', paymentFrequency: 'Annually', startDate: '2024-01-10', coverageLength: '5 Years', selectedAddOns: [], donationPercentage: 10, planType: 'Premium' }, // Added planType
    payment: { paymentMethod: 'Bank Transfer', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: 'Gringotts Bank', accountNumber: '123456789', accountName: 'Bilbo Baggins' }
  },
  'sub-013': {
    client: { title: 'Mr.', firstName: 'Elrond', middleName: '', lastName: 'Half-elven', dob: '0001-01-01', pob: 'Valinor', gender: 'Male', phoneNumber: '09169876543', email: 'elrond@example.com', streetAddress: 'Last Homely House', city: 'Rivendell', province: 'Eriador', postalCode: 'ELV001', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Legolas Greenleaf', dobOrAdoptionDate: '2021-05-20', estimatedAge: '4 years', gender: 'Male', species: 'Cat', otherSpecies: '', breed: 'Siamese', otherBreed: '', microchipNumber: '246813579024680', colorMarkings: 'Cream Point', spayedNeutered: 'Yes', vaccinationStatus: 'Up-to-date', lifestyle: 'Outdoor', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Glorfindel', vetClinicName: 'Elven Vet Clinic', clinicPhoneNumber: '09170001111', clinicAddress: 'Misty Mountains', lastVetVisitDate: '2024-01-10', weight: '4 kg' },
    product: { productName: 'Medical Care Insurance', coverageAmount: '70000', deductible: '3000', reimbursementRate: '70%', paymentFrequency: 'Quarterly', startDate: '2024-01-15', coverageLength: '2 Years', selectedAddOns: [{ id: 'dental', name: 'Dental Care', price: 3000, type: 'annual' }], donationPercentage: 2, planType: 'Basic' },
    payment: { paymentMethod: 'GCash', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: '', accountNumber: '', accountName: '', gcashNumber: '09175551234', gcashName: 'Elrond H.' }
  },
  'sub-014': {
    client: { title: 'Mr.', firstName: 'Aragorn', middleName: '', lastName: 'Strider', dob: '1987-03-01', pob: 'Gondor', gender: 'Male', phoneNumber: '09171112222', email: 'aragorn@example.com', streetAddress: 'Minas Tirith', city: 'Gondor', province: 'Middle-earth', postalCode: 'GNDR1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Arwen Evenstar', dobOrAdoptionDate: '2020-07-20', estimatedAge: '5 years', gender: 'Female', species: 'Dog', otherSpecies: '', breed: 'German Shepherd', otherBreed: '', microchipNumber: '112233445566778', colorMarkings: 'Black and Tan', spayedNeutered: 'Yes', vaccinationStatus: 'Up-to-date', lifestyle: 'Active', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Faramir', vetClinicName: 'Gondor Pet Clinic', clinicPhoneNumber: '09182223333', clinicAddress: 'Pelennor Fields', lastVetVisitDate: '2024-04-05', weight: '30 kg' },
    product: { productName: 'Legacy Insurance', coverageAmount: '200000', deductible: '10000', reimbursementRate: '85%', paymentFrequency: 'Annually', startDate: '2024-01-20', coverageLength: '10 Years', selectedAddOns: [{ id: 'estate', name: 'Estate Planning Rider', price: 10000, type: 'one-time' }], donationPercentage: 15, planType: 'Executive' },
    payment: { paymentMethod: 'Bank Transfer', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: 'Bank of Gondor', accountNumber: '987654321', accountName: 'Aragorn Elessar' }
  },
  'sub-015': {
    client: { title: 'Mr.', firstName: 'Gimli', middleName: '', lastName: 'Glóinsson', dob: '1950-02-10', pob: 'Lonely Mountain', gender: 'Male', phoneNumber: '09173334444', email: 'gimli@example.com', streetAddress: 'Erebor Dwarf Holds', city: 'Erebor', province: 'Rhûn', postalCode: 'DWRF1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Thorin Oakenshield', dobOrAdoptionDate: '2022-09-01', estimatedAge: '2 years', gender: 'Male', species: 'Dog', otherSpecies: '', breed: 'Bulldog', otherBreed: '', microchipNumber: '998877665544332', colorMarkings: 'Brindle', spayedNeutered: 'Yes', vaccinationStatus: 'Up-to-date', lifestyle: 'Calm', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Balin', vetClinicName: 'Moria Vet Services', clinicPhoneNumber: '09194445555', clinicAddress: 'Moria Gate', lastVetVisitDate: '2024-05-12', weight: '25 kg' },
    product: { productName: 'Medical Care Insurance', coverageAmount: '65000', deductible: '2500', reimbursementRate: '75%', paymentFrequency: 'Annually', startDate: '2024-01-25', coverageLength: '1 Year', selectedAddOns: [], donationPercentage: 7, planType: 'Silver' },
    payment: { paymentMethod: 'Credit/Debit Card', cardNumber: '9988776655443322', cardName: 'Gimli Son of Gloin', expiryDate: '10/27', cvv: '456', bankName: '', accountNumber: '', accountName: '', gcashNumber: '', gcashName: '' }
  },
  'sub-016': {
    client: { title: 'Mr.', firstName: 'Melkor', middleName: '', lastName: 'Bauglir', dob: '0000-00-01', pob: 'Void', gender: 'Male', phoneNumber: '09170000000', email: 'sauron@example.com', streetAddress: 'Barad-dûr', city: 'Mordor', province: 'Ash Mountains', postalCode: 'EVIL1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Sauron the Dark Lord', dobOrAdoptionDate: '2023-11-11', estimatedAge: '1 year', gender: 'Male', species: 'Lizard', otherSpecies: 'Dragon', breed: 'Wyvern', otherBreed: '', microchipNumber: '111100002222333', colorMarkings: 'Black', spayedNeutered: 'No', vaccinationStatus: 'None', lifestyle: 'Aggressive', chronicIllness: 'Yes', chronicIllnessExplanation: 'Dark Magic Affliction', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'Yes', recurringConditionsExplanation: 'Eye of Sauron Syndrome', onMedication: 'Yes', onMedicationExplanation: 'Morgoth\'s Potion', vetName: 'Dr. Wormtongue', vetClinicName: 'Isengard Lair', clinicPhoneNumber: '09180000000', clinicAddress: 'Orthanc Tower', lastVetVisitDate: '2024-06-01', weight: '1000 kg' },
    product: { productName: 'Legacy Insurance', coverageAmount: '1000000', deductible: '50000', reimbursementRate: '100%', paymentFrequency: 'Monthly', startDate: '2024-02-01', coverageLength: 'Lifetime', selectedAddOns: [], donationPercentage: 0, planType: 'Platinum' },
    payment: { paymentMethod: 'GCash', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: '', accountNumber: '', accountName: '', gcashNumber: '09179998888', gcashName: 'Melkor B.' }
  },
  'sub-017': {
    client: { title: 'Mr.', firstName: 'Bard', middleName: '', lastName: 'the Bowman', dob: '1975-04-15', pob: 'Esgaroth', gender: 'Male', phoneNumber: '09175556666', email: 'bard@example.com', streetAddress: 'Lake-town Pier', city: 'Esgaroth', province: 'Dale', postalCode: 'LKETWN', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Smaug the Dragon', dobOrAdoptionDate: '2023-01-01', estimatedAge: '2 years', gender: 'Male', species: 'Reptile', otherSpecies: 'Dragon', breed: 'Wyvern', otherBreed: '', microchipNumber: '000011112222333', colorMarkings: 'Red-Gold', spayedNeutered: 'No', vaccinationStatus: 'None', lifestyle: 'Territorial', chronicIllness: 'Yes', chronicIllnessExplanation: 'Fire Breath Exhaustion', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Dwalin', vetClinicName: 'Mountain Vet Clinic', clinicPhoneNumber: '09186667777', clinicAddress: 'Lonely Mountain Entrance', lastVetVisitDate: '2024-05-20', weight: '2000 kg' },
    product: { productName: 'Medical Care Insurance', coverageAmount: '500000', deductible: '20000', reimbursementRate: '60%', paymentFrequency: 'Annually', startDate: '2024-02-05', coverageLength: '1 Year', selectedAddOns: [{ id: 'disaster_relief', name: 'Disaster Relief Add-on', price: 15000, type: 'annual' }], donationPercentage: 8, planType: 'Bronze' },
    payment: { paymentMethod: 'Credit/Debit Card', cardNumber: '0000111122223333', cardName: 'Bard Bowman', expiryDate: '07/28', cvv: '789', bankName: '', accountNumber: '', accountName: '', gcashNumber: '', gcashName: '' }
  },
  'sub-018': {
    client: { title: 'Mr.', firstName: 'Saruman', middleName: '', lastName: 'the White', dob: '1930-08-20', pob: 'Isengard', gender: 'Male', phoneNumber: '09177778888', email: 'saruman@example.com', streetAddress: 'Orthanc Tower', city: 'Isengard', province: 'Nan Curunír', postalCode: 'WIZRD1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Treebeard the Ent', dobOrAdoptionDate: '2021-02-01', estimatedAge: '4 years', gender: 'Male', species: 'Tree', otherSpecies: 'Ent', breed: 'Oak', otherBreed: '', microchipNumber: '987654321098765', colorMarkings: 'Bark', spayedNeutered: 'No', vaccinationStatus: 'None', lifestyle: 'Sedentary', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Radagast', vetClinicName: 'Brown Lands Clinic', clinicPhoneNumber: '09188889999', clinicAddress: 'Brown Lands, East Emnet', lastVetVisitDate: '2024-01-01', weight: '5000 kg' },
    product: { productName: 'Legacy Insurance', coverageAmount: '300000', deductible: '15000', reimbursementRate: '95%', paymentFrequency: 'Annually', startDate: '2024-02-10', coverageLength: '20 Years', selectedAddOns: [], donationPercentage: 12, planType: 'Gold' },
    payment: { paymentMethod: 'Bank Transfer', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: 'Mordor Bank', accountNumber: '555444333', accountName: 'Saruman the White' }
  },
  'sub-019': {
    client: { title: 'Mr.', firstName: 'Gollum', middleName: '', lastName: '', dob: '1000-01-01', pob: 'Misty Mountains', gender: 'Male', phoneNumber: '09179990000', email: 'gollum@example.com', streetAddress: 'Goblin Town Caves', city: 'Misty Mountains', province: 'Rhovanion', postalCode: 'CAVE1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Shelob the Spider', dobOrAdoptionDate: '2023-09-09', estimatedAge: '1 year', gender: 'Female', species: 'Arachnid', otherSpecies: 'Giant Spider', breed: 'Venomous', otherBreed: '', microchipNumber: '123123123123123', colorMarkings: 'Dark', spayedNeutered: 'No', vaccinationStatus: 'None', lifestyle: 'Aggressive', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Uglúk', vetClinicName: 'Cirith Ungol Clinic', clinicPhoneNumber: '09180001111', clinicAddress: 'Cirith Ungol', lastVetVisitDate: '2024-06-15', weight: '200 kg' },
    product: { productName: 'Medical Care Insurance', coverageAmount: '10000', deductible: '500', reimbursementRate: '100%', paymentFrequency: 'Monthly', startDate: '2024-02-15', coverageLength: '6 Months', selectedAddOns: [], donationPercentage: 1, planType: 'Economy' },
    payment: { paymentMethod: 'GCash', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: '', accountNumber: '', accountName: '', gcashNumber: '09171239876', gcashName: 'Gollum S.' }
  },
  'sub-020': {
    client: { title: 'Mr.', firstName: 'Theoden', middleName: '', lastName: 'King', dob: '1965-11-05', pob: 'Edoras', gender: 'Male', phoneNumber: '09172223333', email: 'theoden@example.com', streetAddress: 'Golden Hall', city: 'Edoras', province: 'Rohan', postalCode: 'ROHN1', country: 'Middle-earth', declarationAccuracy: true, allowPhoneCollection: true },
    pet: { petName: 'Shadowfax the Horse', dobOrAdoptionDate: '2020-03-01', estimatedAge: '5 years', gender: 'Male', species: 'Horse', otherSpecies: '', breed: 'Mearas', otherBreed: '', microchipNumber: '444555666777888', colorMarkings: 'Grey', spayedNeutered: 'No', vaccinationStatus: 'Up-to-date', lifestyle: 'Active', chronicIllness: 'No', chronicIllnessExplanation: '', surgeryHistory: 'No', surgeryHistoryExplanation: '', recurringConditions: 'No', recurringConditionsExplanation: '', onMedication: 'No', onMedicationExplanation: '', vetName: 'Dr. Eomer', vetClinicName: 'Rohan Stables Vet', clinicPhoneNumber: '09183334444', clinicAddress: 'Rohan Fields', lastVetVisitDate: '2024-04-20', weight: '500 kg' },
    product: { productName: 'Legacy Insurance', coverageAmount: '180000', deductible: '7500', reimbursementRate: '90%', paymentFrequency: 'Annually', startDate: '2024-02-20', coverageLength: '15 Years', selectedAddOns: [], donationPercentage: 10, planType: 'Standard' },
    payment: { paymentMethod: 'Bank Transfer', cardNumber: '', cardName: '', expiryDate: '', cvv: '', bankName: 'Bank of Rohan', accountNumber: '777888999', accountName: 'Theoden King' }
  }
};

// Mock data for in-progress applications (increased for pagination demonstration)
const mockApplications: Application[] = [
  {
    id: 'sub-011',
    status: 'Approved',
    ensured: 'Pippin the Ferret',
    owners: ['Frodo Baggins'],
    product: 'Medical Care Insurance',
    coverageAmount: 40000, // PHP
    dateStarted: '2024-01-05',
    policyNumber: 'MCP-2024-0011',
  },
  {
    id: 'sub-012',
    status: 'Denied',
    ensured: 'Gandalf the Grey',
    owners: ['Bilbo Baggins'],
    product: 'Legacy Insurance',
    coverageAmount: 150000, // PHP
    dateStarted: '2024-01-10',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-013',
    status: 'Denied',
    ensured: 'Legolas Greenleaf',
    owners: ['Elrond Half-elven'],
    product: 'Medical Care Insurance',
    coverageAmount: 70000, // PHP
    dateStarted: '2024-01-15',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-014',
    status: 'Approved',
    ensured: 'Aragorn Strider',
    owners: ['Arwen Evenstar'],
    product: 'Legacy Insurance',
    coverageAmount: 200000, // PHP
    dateStarted: '2024-01-20',
    policyNumber: 'LGY-2024-0003',
  },
  {
    id: 'sub-015',
    status: 'Approved',
    ensured: 'Gimli Son of Glóin',
    owners: ['Thorin Oakenshield'],
    product: 'Medical Care Insurance',
    coverageAmount: 65000, // PHP
    dateStarted: '2024-01-25',
    policyNumber: 'MCP-2024-0012',
  },
  {
    id: 'sub-016',
    status: 'Denied',
    ensured: 'Sauron the Dark Lord',
    owners: ['Melkor Bauglir'],
    product: 'Legacy Insurance',
    coverageAmount: 1000000, // PHP
    dateStarted: '2024-02-01',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-017',
    status: 'Denied',
    ensured: 'Smaug the Dragon',
    owners: ['Bard the Bowman'],
    product: 'Medical Care Insurance',
    coverageAmount: 500000, // PHP
    dateStarted: '2024-02-05',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-018',
    status: 'Approved',
    ensured: 'Treebeard the Ent',
    owners: ['Saruman the White'],
    product: 'Legacy Insurance',
    coverageAmount: 300000, // PHP
    dateStarted: '2024-02-10',
    policyNumber: 'LGY-2024-0004',
  },
  {
    id: 'sub-019',
    status: 'Approved',
    ensured: 'Shelob the Spider',
    owners: ['Gollum'],
    product: 'Medical Care Insurance',
    coverageAmount: 10000, // PHP
    dateStarted: '2024-02-15',
    policyNumber: 'MCP-2024-0013',
  },
  {
    id: 'sub-020',
    status: 'Approved',
    ensured: 'Shadowfax the Horse',
    owners: ['Theoden King'],
    product: 'Legacy Insurance',
    coverageAmount: 180000, // PHP
    dateStarted: '2024-02-20',
    policyNumber: 'LGY-2024-0005',
  }
];

const AdvisorSubmittedApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEW STATE FOR MODAL ---
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedApplicationData, setSelectedApplicationData] = useState<ApplicationFormData | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Application['status'] | ''>('');
  const [productFilter, setProductFilter] = useState<Application['product'] | ''>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust items per page

  // Dropdown visibility states
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Refs for dropdowns to handle clicks outside
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const coverageDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Simulate data fetching with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1500); // Simulate a 1.5-second loading time

    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered applications
  const filteredApplications = useMemo(() => {
    let filtered = mockApplications;

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    if (productFilter) {
      filtered = filtered.filter(app => app.product === productFilter);
    }
    if (minCoverage) {
      filtered = filtered.filter(app => app.coverageAmount >= parseFloat(minCoverage));
    }
    if (maxCoverage) {
      filtered = filtered.filter(app => app.coverageAmount <= parseFloat(maxCoverage));
    }
    if (startDate) {
      filtered = filtered.filter(app => new Date(app.dateStarted) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(app => new Date(app.dateStarted) <= new Date(endDate));
    }
    return filtered;
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Reset current page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Calculate applications for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
        productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node) &&
        coverageDropdownRef.current && !coverageDropdownRef.current.contains(event.target as Node) &&
        dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to format currency to Philippine Peso
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2, // Ensure two decimal places
    }).format(amount);
  };

  // Check if any filter is active
  const areFiltersActive =
    statusFilter !== '' ||
    productFilter !== '' ||
    minCoverage !== '' ||
    maxCoverage !== '' ||
    startDate !== '' ||
    endDate !== '';

  const toggleDropdown = (dropdownName: string) => {
    setActiveFilterDropdown(activeFilterDropdown === dropdownName ? null : dropdownName);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- NEW: Function to handle row click and open modal ---
  const handleRowClick = (applicationId: string) => {
    // In a real application, you would fetch the full ApplicationFormData
    // from your backend using applicationId.
    // For this mock, we'll retrieve it from `mockFullApplicationData`.
    const fullData = mockFullApplicationData[applicationId];
    if (fullData) {
      setSelectedApplicationData(fullData);
      setIsSummaryModalOpen(true);
    } else {
      console.warn(`No full data found for application ID: ${applicationId}`);
      // Optionally show an alert or toast message
    }
  };

  // --- NEW: Functions to handle modal navigation (dummy for this context) ---
  // These are passed to the SummaryDetailsStep inside the modal.
  // In this context (viewing a submitted application), these might not
  // actually navigate steps, but you need to provide them as props.
  // The "Sign & Submit" button in the summary would simply close the modal here.
  const handleModalPrev = () => {
    console.log("Modal Previous clicked (no actual step change in summary view)");
    // If you had multiple "pages" within the summary, you could manage that here.
    // For a simple summary, it might do nothing or close the modal.
    setIsSummaryModalOpen(false); // Close the modal for simplicity on "Prev"
  };

  const handleModalNext = () => {
    console.log("Modal Next/Sign & Submit clicked (closes modal in summary view)");
    // In a "submitted applications" context, this button wouldn't submit.
    // It would simply acknowledge review and close the modal.
    setIsSummaryModalOpen(false);
    // You could potentially trigger a status update if an admin was "approving" here,
    // but the current design implies a readonly summary.
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <AdvisorFilterSkeleton />
          ) : (
            <>
              <Filter className="h-5 w-5 text-gray-600" /> {/* Filter Icon */}

              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('status')}
                >
                  <span>Status</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'status' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'status' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                      onClick={() => { setStatusFilter(''); setActiveFilterDropdown(null); }}
                    >
                      All Statuses
                    </div>
                    {['Submitted', 'Approved', 'Denied'].map(
                      (statusOption) => (
                        <div
                          key={statusOption}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                          onClick={() => { setStatusFilter(statusOption as Application['status']); setActiveFilterDropdown(null); }}
                        >
                          {statusOption}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Product Filter Dropdown */}
              <div className="relative" ref={productDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('product')}
                >
                  <span>Product</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'product' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'product' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                      onClick={() => { setProductFilter(''); setActiveFilterDropdown(null); }}
                    >
                      All Products
                    </div>
                    {['Medical Care Insurance', 'Legacy Insurance'].map((productOption) => (
                      <div
                        key={productOption}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                        onClick={() => { setProductFilter(productOption as Application['product']); setActiveFilterDropdown(null); }}
                      >
                        {productOption}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coverage Amount Filter Dropdown */}
              <div className="relative" ref={coverageDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('coverage')}
                >
                  <span>Coverage Amount</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'coverage' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'coverage' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 p-4">
                    <div className="flex flex-col space-y-2">
                      <Input
                        type="number"
                        placeholder="Min Amount"
                        value={minCoverage}
                        onChange={(e) => setMinCoverage(e.target.value)}
                        className="w-full text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max Amount"
                        value={maxCoverage}
                        onChange={(e) => setMaxCoverage(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date Started Filter Dropdown */}
              <div className="relative" ref={dateDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('date')}
                >
                  <span>Date Started</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'date' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'date' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 p-4">
                    <div className="flex flex-col space-y-2">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm"
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters Button (conditionally rendered) */}
              {areFiltersActive && (
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  onClick={clearFilters}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear Filters</span>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Applications Table - displays skeleton when loading, otherwise the actual table */}
        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <AdvisorTableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f5f8f3]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Ensured
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Owner(s)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Coverage Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Date Started
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Policy Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer" // Add cursor-pointer
                      onClick={() => handleRowClick(app.id)} // Add onClick handler
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.ensured}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.owners.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(app.coverageAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.dateStarted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.policyNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination Controls */}
        {!loading && filteredApplications.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => paginate(page)}
                className={currentPage === page ? 'bg-[#7eb238] hover:bg-[#8cc63f] text-white' : ''}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* --- RENDER THE APPLICATION SUMMARY MODAL HERE --- */}
      {selectedApplicationData && ( // Only render if data is available
        <ApplicationSummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)} // Close button in modal will call this
          formData={selectedApplicationData}
          onPrev={handleModalPrev} // Define what 'Previous' does in the modal context
          onNext={handleModalNext} // Define what 'Next/Submit' does in the modal context
        />
      )}
    </div>
  );
};

export default AdvisorSubmittedApplications;