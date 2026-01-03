# ConvertHub React App Structure

This React application has been organized into a clean, modular structure following best practices.

## Folder Structure

```
src/
├── api/              # API route documentation
├── components/       # Reusable UI components
├── config/          # Configuration files
├── context/         # React Context providers
├── pages/           # Page components
├── services/        # API service layer
├── utils/           # Utility functions
└── App.js           # Main entry point
```

## Key Features

### 1. Context-Based State Management
- **AppContext**: Centralized state management using React Context
- All app state (navigation, files, processing, AI) is managed in one place
- Easy to access from any component using `useApp()` hook

### 2. Modular Components
- **Button**: Reusable button component with variants
- **Card**: Container component for content
- **Badge**: Status badge component
- **Sidebar**: Navigation sidebar
- **Header**: App header component
- **ProcessingToast**: Toast notifications for processing status

### 3. Page Components
- **LandingPage**: Marketing landing page
- **DashboardPage**: Main dashboard with stats
- **ImageToolsPage**: Image conversion tools
- **PdfToolsPage**: PDF manipulation tools
- **DocToolsPage**: Document processing with AI
- **HistoryPage**: Processing history (coming soon)

### 4. API Services
- **apiService.js**: Centralized API service layer
  - `geminiService`: Gemini AI API integration
  - `imageService`: Image operations
  - `pdfService`: PDF operations
  - `documentService`: Document operations
  - `generalService`: General operations (upload, download, history)

### 5. Configuration
- **api.js**: API configuration and route definitions
  - Base URLs
  - API routes (one route per feature)
  - Environment variables support

### 6. Utilities
- **formatBytes.js**: Format file sizes
- **constants.js**: Mock data and constants

## Backend Integration

The app is configured to connect to a backend API at `http://localhost:3001/api` (configurable via environment variable).

Each feature has one dedicated route:
- `/api/images/*` - Image operations
- `/api/pdf/*` - PDF operations
- `/api/documents/*` - Document operations
- `/api/upload` - File upload
- `/api/download` - File download
- `/api/history` - Processing history

See `api/routes.md` for detailed API documentation.

## Usage

### Using Context
```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { view, setView, files, setFiles } = useApp();
  // Use state and setters
}
```

### Using API Services
```javascript
import { imageService } from '../services/apiService';

// Convert images
const result = await imageService.convert(files, 'WEBP');
```

### Adding New Features
1. Add route to `config/api.js`
2. Add service method to `services/apiService.js`
3. Create page component in `pages/`
4. Add navigation in `components/Sidebar.js`
5. Add route handler in `App.js`

## Best Practices Followed

✅ Separation of concerns
✅ Single responsibility principle
✅ DRY (Don't Repeat Yourself)
✅ Modular and reusable components
✅ Centralized state management
✅ Clean API layer
✅ Environment-based configuration
✅ Simple entry point

