# API Configuration Guide

This document explains the centralized API configuration system implemented in the PetLoves application.

## Overview

The application now uses a centralized API configuration system that provides:
- Consistent API endpoint management
- Environment-based configuration
- Built-in retry logic and timeout handling
- Type-safe API calls
- Centralized error handling

## File Structure

```
src/
├── config/
│   └── api.ts              # Core API configuration
├── services/
│   └── apiService.ts       # High-level API service layer
└── types/
    └── index.ts            # Type definitions
```

## Configuration Files

### 1. `src/config/api.ts`

This is the core configuration file that contains:

- **API_CONFIG**: Base configuration including URL, timeout, and retry settings
- **API_ENDPOINTS**: Centralized endpoint definitions
- **api**: HTTP client with built-in retry logic and timeout handling
- **buildApiUrl()**: Utility function to build full API URLs

### 2. `src/services/apiService.ts`

High-level service layer that provides:

- **userService**: User authentication and profile management
- **activityService**: CRUD operations for user activities
- **batchActivityService**: Batch operations for fetching multiple activity types

## Environment Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# API Configuration
VITE_API_BASE=https://petloves-nedk.onrender.com

# For local development, uncomment:
# VITE_API_BASE=http://localhost:5000
```

### Vite Configuration

The `vite.config.ts` is configured to proxy API calls during development:

```typescript
proxy: {
  '/api': {
    target: 'https://petloves-nedk.onrender.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

## Usage Examples

### Basic API Calls

```typescript
import { api, API_ENDPOINTS } from '../config/api';

// GET request
const response = await api.get(API_ENDPOINTS.USERS.PROFILE);

// POST request
const response = await api.post(API_ENDPOINTS.USERS.LOGIN, {
  email: 'user@example.com',
  password: 'password123'
});
```

### Using Service Layer

```typescript
import { userService } from '../services/apiService';

// Login user
const result = await userService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('User logged in:', result.data);
} else {
  console.error('Login failed:', result.error);
}
```

### Batch Operations

```typescript
import { batchActivityService } from '../services/apiService';

// Fetch all user activities
const activities = await batchActivityService.getAllUserActivities(userId);

console.log('Orders:', activities.orders);
console.log('Adoptions:', activities.adoptions);
console.log('Appointments:', activities.appointments);
console.log('Visits:', activities.visits);
```

## API Endpoints

### User Endpoints
- `POST /users` - Register new user
- `POST /users/login` - User login
- `GET /users/profile/{userId}` - Get user profile

### Activity Endpoints
- `GET /orders/{userId}` - Get user orders
- `POST /orders` - Create new order
- `GET /adoptions/{userId}` - Get user adoptions
- `POST /adoptions` - Create new adoption
- `GET /appointments/{userId}` - Get user appointments
- `POST /appointments` - Create new appointment
- `GET /visits/{userId}` - Get user visits
- `POST /visits` - Create new visit

## Error Handling

The API configuration includes comprehensive error handling:

### Automatic Retries
- Failed requests are automatically retried up to 3 times
- Exponential backoff delay between retries
- Client errors (4xx) are not retried

### Timeout Handling
- Default timeout: 30 seconds
- Configurable per request
- Automatic abort on timeout

### Error Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}
```

## Development vs Production

### Development
- Uses proxy configuration in Vite
- API calls go through `/api` prefix
- Detailed logging enabled

### Production
- Direct API calls to production server
- Optimized error handling
- Reduced logging

## Migration from Old System

The old system used scattered API URLs throughout components. The new system:

1. **Centralized Configuration**: All API URLs are now in one place
2. **Type Safety**: Full TypeScript support with proper typing
3. **Error Handling**: Consistent error handling across all API calls
4. **Retry Logic**: Built-in retry mechanism for failed requests
5. **Environment Support**: Easy switching between development and production

## Best Practices

1. **Always use the service layer** for API calls instead of direct fetch
2. **Handle both success and error cases** in your components
3. **Use environment variables** for different API endpoints
4. **Leverage TypeScript types** for better development experience
5. **Monitor API health** using the built-in health check utility

## Health Check

The configuration includes a health check utility:

```typescript
import { checkApiHealth } from '../config/api';

const isHealthy = await checkApiHealth();
if (!isHealthy) {
  console.warn('API is not responding');
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend API has proper CORS configuration
2. **Timeout Issues**: Increase timeout for slow endpoints
3. **Network Errors**: Check internet connection and API server status
4. **Type Errors**: Ensure proper type definitions are imported

### Debug Mode

In development, the API configuration logs detailed information:

```typescript
// Check browser console for:
// - API Configuration details
// - Request/response information
// - Error details
```

This centralized approach provides better maintainability, type safety, and error handling for all API interactions in the PetLoves application.
