const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}, accessToken = '') {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Request failed.';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch (_error) {
      // Keep generic message when body is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function createInquiry(payload) {
  const data = await request('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.item;
}

export async function fetchInquiries(limit = 200, accessToken = '') {
  const data = await request(`/api/inquiries?limit=${limit}`, { method: 'GET' }, accessToken);
  return data.items || [];
}

export async function updateInquiryStatus(id, status, accessToken = '') {
  const data = await request(`/api/inquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, accessToken);
  return data.item;
}

export async function deleteInquiry(id, accessToken = '') {
  await request(`/api/inquiries/${id}`, { method: 'DELETE' }, accessToken);
}
