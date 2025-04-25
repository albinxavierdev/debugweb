/**
 * Configuration settings for the application
 */

interface AppConfig {
  n8nWebhookUrl: string;
  apiTimeoutMs: number;
  isDevelopment: boolean;
}

const config: AppConfig = {
  // Replace this URL with your actual n8n webhook URL
  n8nWebhookUrl: 'http://88.222.241.88:5678/webhook-test/c7bd3a3e-635e-4cb9-bdc0-5be2e6f48659',
  
  // Add other configuration settings as needed
  apiTimeoutMs: 10000, // 10 seconds timeout for API calls
  
  // Environment-specific settings
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
};

// Freeze the config object to prevent modifications
Object.freeze(config);

export default config; 