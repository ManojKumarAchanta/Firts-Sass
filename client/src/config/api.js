// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: "", // System provides this at runtime
  GEMINI_BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent",
  BACKEND_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
};

// Backend API Routes - One route per feature
export const API_ROUTES = {
  // Image operations
  IMAGE_CONVERT: "/images/convert",
  IMAGE_COMPRESS: "/images/compress",
  IMAGE_RESIZE: "/images/resize",

  // PDF operations
  PDF_MERGE: "/pdf/merge",
  PDF_SPLIT: "/pdf/split",
  PDF_COMPRESS: "/pdf/compress",
  PDF_UNLOCK: "/pdf/unlock",
  PDF_REORDER: "/pdf/reorder",

  // Document operations
  DOC_CONVERT: "/documents/convert",
  DOC_PROCESS: "/documents/process",

  // General
  UPLOAD: "/upload",
  DOWNLOAD: "/download",
  HISTORY: "/history",
};

