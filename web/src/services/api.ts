import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('castlegate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Mock token for development (since we don't have real auth yet)
const MOCK_TOKEN = 'mock-token-for-dev';

// Mock user ID for development
const MOCK_USER_ID = 'user-123';

// Set mock token for development
if (typeof window !== 'undefined') {
  localStorage.setItem('castlegate_token', MOCK_TOKEN);
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  icon?: string;
  uploaded?: string;
  uploadedAt?: string;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  provider: string;
  type: string;
  value: string;
  purchase: string;
  icon?: string;
  status: string;
  createdAt?: string;
}

// Documents API
export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data.documents || [];
  },

  create: async (document: Partial<Document>, file?: File): Promise<Document> => {
    const formData = new FormData();
    
    // Add text fields
    if (document.name) formData.append('name', document.name);
    if (document.type) formData.append('type', document.type);
    if (document.icon) formData.append('icon', document.icon);
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.document;
  },

  update: async (id: string, updates: Partial<Document>): Promise<void> => {
    await api.put(`/documents/${id}`, updates);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  download: async (id: string, openInNewTab: boolean = false): Promise<void> => {
    // Get token for authorization
    const token = typeof window !== 'undefined' ? localStorage.getItem('castlegate_token') : null;
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch file as blob
    const response = await fetch(`${API_BASE_URL}/documents/${id}/download`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    
    // Get content type and filename from headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'document';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create blob with explicit MIME type
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    if (openInNewTab && (contentType.startsWith('application/pdf') || contentType.startsWith('image/'))) {
      // Open in new tab for PDFs and images
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        // Popup blocked, fallback to download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } else {
      // Download for other file types
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    
    // Clean up after a delay to ensure file opens/downloads properly
    setTimeout(() => window.URL.revokeObjectURL(url), 3000);
  }
};

// Assets API
export const assetsApi = {
  getAll: async (): Promise<Asset[]> => {
    const response = await api.get('/assets');
    return response.data.assets || [];
  },

  create: async (asset: Partial<Asset>): Promise<Asset> => {
    const response = await api.post('/assets', asset);
    return response.data.asset;
  },

  update: async (id: string, updates: Partial<Asset>): Promise<void> => {
    await api.put(`/assets/${id}`, updates);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/assets/${id}`);
  }
};

export default api;

