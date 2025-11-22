// src/api.js

// Base URL for API calls (backend)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Base URL for short URLs (redirects)
// In most cases this is the same as the backend host
export const SHORT_BASE_URL =
  import.meta.env.VITE_SHORT_BASE_URL || API_BASE_URL;

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// GET /api/links
export async function listLinks() {
  const res = await fetch(`${API_BASE_URL}/api/links`, {
    method: 'GET',
  });

  return handleResponse(res);
}

// POST /api/links
// body: { targetUrl, customCode? }
export async function createLink({ targetUrl, customCode }) {
  const res = await fetch(`${API_BASE_URL}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUrl, customCode }),
  });

  return handleResponse(res);
}

// GET /api/links/:code
export async function getLink(code) {
  const res = await fetch(
    `${API_BASE_URL}/api/links/${encodeURIComponent(code)}`,
    {
      method: 'GET',
    }
  );

  return handleResponse(res);
}

// DELETE /api/links/:code
export async function deleteLink(code) {
  const res = await fetch(
    `${API_BASE_URL}/api/links/${encodeURIComponent(code)}`,
    {
      method: 'DELETE',
    }
  );

  // 204 No Content – still treat non-2xx as error
  if (!res.ok) {
    let data = null;
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }
    } catch {
      // ignore JSON parse errors
    }

    const error = new Error(
      data?.message || `Request failed with status ${res.status}`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return;
}
