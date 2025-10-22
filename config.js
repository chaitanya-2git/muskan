// Local Development Configuration
const DEV_CONFIG = {
    API_BASE_URL: '/backend/api',  // Relative URL for localhost
    SITE_URL: 'http://localhost:8000', // Local development URL
    ENVIRONMENT: 'development'
};

// Production Configuration (for reference)
const PRODUCTION_CONFIG = {
    API_BASE_URL: '/backend/api',
    SITE_URL: 'https://yourdomain.com',
    ENVIRONMENT: 'production'
};

// Use development config by default
const CONFIG = DEV_CONFIG;

// Export for use in other files
window.CONFIG = CONFIG;
window.DEV_CONFIG = DEV_CONFIG;
window.PRODUCTION_CONFIG = PRODUCTION_CONFIG;
