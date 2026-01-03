import { API_CONFIG, API_ROUTES } from '../config/api';

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;

  // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;

  const defaultOptions = {
    headers: isFormData ? {} : {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Gemini API Service
export const geminiService = {
  generateContent: async (prompt) => {
    if (!API_CONFIG.GEMINI_API_KEY) {
      throw new Error("API Key is missing. This feature requires the Gemini API.");
    }

    const response = await fetch(
      `${API_CONFIG.GEMINI_BASE_URL}?key=${API_CONFIG.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('Gemini API Call Failed');

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },
};

// Backend API Services
export const imageService = {
  convert: (files, format) => apiCall(API_ROUTES.IMAGE_CONVERT, {
    method: 'POST',
    body: JSON.stringify({ files, format }),
  }),
  compress: (files, quality) => apiCall(API_ROUTES.IMAGE_COMPRESS, {
    method: 'POST',
    body: JSON.stringify({ files, quality }),
  }),
};

export const pdfService = {
  merge: (files) => apiCall(API_ROUTES.PDF_MERGE, {
    method: 'POST',
    body: JSON.stringify({ files }),
  }),
  split: (file, pages) => apiCall(API_ROUTES.PDF_SPLIT, {
    method: 'POST',
    body: JSON.stringify({ file, pages }),
  }),
  compress: (file) => apiCall(API_ROUTES.PDF_COMPRESS, {
    method: 'POST',
    body: JSON.stringify({ file }),
  }),
  unlock: (file, password) => apiCall(API_ROUTES.PDF_UNLOCK, {
    method: 'POST',
    body: JSON.stringify({ file, password }),
  }),
  reorder: (file, order) => apiCall(API_ROUTES.PDF_REORDER, {
    method: 'POST',
    body: JSON.stringify({ file, order }),
  }),
};

export const documentService = {
  convert: (file, format) => apiCall(API_ROUTES.DOC_CONVERT, {
    method: 'POST',
    body: JSON.stringify({ file, format }),
  }),
  process: (text, operation) => apiCall(API_ROUTES.DOC_PROCESS, {
    method: 'POST',
    body: JSON.stringify({ text, operation }),
  }),
};

export const generalService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall(API_ROUTES.UPLOAD, {
      method: 'POST',
      body: formData,
    });
  },
  download: (fileId) => {
    const url = `${API_CONFIG.BACKEND_BASE_URL}${API_ROUTES.DOWNLOAD}?fileId=${fileId}`;
    return fetch(url, { method: 'GET' });
  },
  getHistory: () => apiCall(API_ROUTES.HISTORY, {
    method: 'GET',
  }),
};

