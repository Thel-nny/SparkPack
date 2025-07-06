// Create a new application
import { type ApplicationFormData } from "@/types/formData";

interface updateApplicationData {
  updateData: {
    status?: string;
  }}

export async function createApplication(applicationData: ApplicationFormData) {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create application');
  }

  return await response.json();
}

// Update an existing application by ID
export async function updateApplication(applicationId: string, updateData: updateApplicationData) {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update application');
  }

  return await response.json();
}

// Fetch applications with optional filters and pagination
export async function fetchApplications(params: {
  page: number;
  limit: number;
  statusFilter?: string;
  productFilter?: string;
  minCoverage?: string;
  maxCoverage?: string;
  startDate?: string;
  endDate?: string;
}) {
  const {
    page,
    limit,
    statusFilter,
    productFilter,
    minCoverage,
    maxCoverage,
    startDate,
    endDate,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  if (statusFilter) queryParams.append('status', statusFilter);
  if (productFilter) queryParams.append('product', productFilter);
  if (minCoverage) queryParams.append('minCoverage', minCoverage);
  if (maxCoverage) queryParams.append('maxCoverage', maxCoverage);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await fetch(`/api/applications?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch applications');
  }

  return await response.json();
}
