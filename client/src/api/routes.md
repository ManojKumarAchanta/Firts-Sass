# Backend API Routes

This document outlines the API routes that the backend should implement. Each feature has one route.

## Base URL
```
http://localhost:3001/api
```

## Image Operations

### POST /api/images/convert
Convert images to different formats
- **Body**: `{ files: File[], format: string }`
- **Response**: `{ success: boolean, files: File[] }`

### POST /api/images/compress
Compress images
- **Body**: `{ files: File[], quality: number }`
- **Response**: `{ success: boolean, files: File[] }`

### POST /api/images/resize
Resize images
- **Body**: `{ files: File[], width?: number, height?: number }`
- **Response**: `{ success: boolean, files: File[] }`

## PDF Operations

### POST /api/pdf/merge
Merge multiple PDFs
- **Body**: `{ files: File[] }`
- **Response**: `{ success: boolean, file: File }`

### POST /api/pdf/split
Split PDF into multiple files
- **Body**: `{ file: File, pages: number[] }`
- **Response**: `{ success: boolean, files: File[] }`

### POST /api/pdf/compress
Compress PDF file
- **Body**: `{ file: File }`
- **Response**: `{ success: boolean, file: File }`

### POST /api/pdf/unlock
Unlock password-protected PDF
- **Body**: `{ file: File, password: string }`
- **Response**: `{ success: boolean, file: File }`

### POST /api/pdf/reorder
Reorder PDF pages
- **Body**: `{ file: File, order: number[] }`
- **Response**: `{ success: boolean, file: File }`

## Document Operations

### POST /api/documents/convert
Convert documents (DOCX, etc.) to PDF
- **Body**: `{ file: File, format: string }`
- **Response**: `{ success: boolean, file: File }`

### POST /api/documents/process
Process document text (summarize, translate, etc.)
- **Body**: `{ text: string, operation: string }`
- **Response**: `{ success: boolean, result: string }`

## General Operations

### POST /api/upload
Upload a file
- **Body**: `FormData` with file
- **Response**: `{ success: boolean, fileId: string, url: string }`

### GET /api/download?fileId=xxx
Download a processed file
- **Query**: `fileId: string`
- **Response**: File blob

### GET /api/history
Get processing history
- **Response**: `{ success: boolean, history: HistoryItem[] }`

