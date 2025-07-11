export async function fetchApplications(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/applications?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function createApplication(applicationData: any) {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    if (!response.ok) {
      throw new Error('Failed to create application');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

export async function updateApplication(id: string, applicationData: any) {
  try {
    const response = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    if (!response.ok) {
      throw new Error('Failed to update application');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }

  return await response.json();
}