/**
 * Yukti AI Chatbot
 * This file handles the functionality for the Yukti AI chatbot
 */

// Configuration for Yukti Chatbot
const yuktiConfig = {
  // API endpoint - using server-side proxy instead of direct API access
  apiEndpoint: '/api/yukti',
  
  // Model configuration - moved to server side
  modelConfig: {
    temperature: 0.7,
    maxTokens: 150
  },
  
  // System prompt that defines Yukti's personality and capabilities
  // Note: The server will enhance this prompt further to ensure consistent style
  systemPrompt: `You are Yukti, an AI learning assistant created by DebugShala. 
  You specialize in programming, data science, and web development.
  Your expertise covers MERN Stack, Java Full Stack, Data Science, and Generative AI courses.
  Help with coding problems, career guidance, and Debugshala course recommendations.`,
  
  // Initial message shown when the chat loads
  welcomeMessage: "Hi there! I'm Yukti, your AI learning assistant from DebugShala. How can I help you today?",
  
  // Fallback message if API fails
  errorMessage: "I'm having trouble connecting to my AI services right now. This might be due to network issues or server maintenance. You can try these troubleshooting steps: 1) Check your internet connection, 2) Refresh the page, or 3) Try again in a few minutes. If the problem persists, please contact Debugshala support.",
  
  // Security token for basic request validation (generated on page load)
  securityToken: '',
  
  // Queries remaining for free tier
  freeQueriesTotal: 10,
  freeQueriesRemaining: 10,
  
  // API connection settings
  apiRetryAttempts: 2,
  apiRetryDelay: 1000 // milliseconds
};

// Generate a session-based security token
yuktiConfig.securityToken = generateSecurityToken();

// DOM elements
let chatMessages;
let chatInput;
let sendButton;
let queriesRemainingElement;

// Initialize the chatbot functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
  checkAPIConnection();
});

// Check if the API is responding
async function checkAPIConnection() {
  try {
    const response = await fetch('/api/health', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.warn('API health check failed. Some features may not work properly.');
    }
  } catch (error) {
    console.warn('Could not connect to API server:', error.message);
  }
}

// Generate a random security token for basic request validation
function generateSecurityToken() {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => ('0' + byte.toString(16)).slice(-2)).join('');
}

// Initialize chatbot UI and event listeners
function initChatbot() {
  // Get DOM elements
  chatMessages = document.querySelector('.chat-messages');
  chatInput = document.querySelector('.chat-input input');
  sendButton = document.querySelector('.send-btn');
  queriesRemainingElement = document.querySelector('.try-yukti-btn span');
  
  if (!chatMessages || !chatInput || !sendButton) return;
  
  // Show welcome message if chat is empty
  if (!chatMessages.querySelector('.bot-message')) {
    appendMessage('bot', yuktiConfig.welcomeMessage);
  }
  
  // Update free queries counter
  updateQueriesRemaining();
  
  // Add event listeners
  sendButton.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });
  
  // Try free button event listener
  const tryFreeBtn = document.querySelector('.try-yukti-btn');
  if (tryFreeBtn) {
    tryFreeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Focus on the chat input to encourage interaction
      chatInput.focus();
      
      // Scroll to the chatbot if it's not in view
      const yuktiChatbot = document.querySelector('.yukti-chatbot');
      if (yuktiChatbot) {
        yuktiChatbot.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Handle sending a message
async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Check if user has queries remaining
  if (yuktiConfig.freeQueriesRemaining <= 0) {
    appendMessage('bot', "You've used all your free queries. Please sign up for a DebugShala course to get unlimited access to Yukti AI.");
    return;
  }
  
  // Sanitize input to prevent XSS attacks
  const sanitizedMessage = sanitizeInput(message);
  
  // Add user message to chat
  appendMessage('user', sanitizedMessage);
  
  // Clear input
  chatInput.value = '';
  
  // Show typing indicator
  const typingIndicator = appendTypingIndicator();
  
  try {
    // Send message to API and get response
    const response = await sendToAPI(sanitizedMessage);
    
    // Remove typing indicator
    removeTypingIndicator(typingIndicator);
    
    // Add bot response to chat
    appendMessage('bot', response);
    
    // Decrement remaining queries
    yuktiConfig.freeQueriesRemaining--;
    updateQueriesRemaining();
    
  } catch (error) {
    console.error('Error communicating with Yukti API:', error);
    
    // Remove typing indicator
    removeTypingIndicator(typingIndicator);
    
    // Show detailed error message with suggestions
    let errorMsg = yuktiConfig.errorMessage;
    
    // Provide specific error context if it's a network error
    if (error.message && error.message.includes('Failed to fetch')) {
      errorMsg = "I can't connect to my servers right now. Please check your internet connection and refresh the page. If you're using an ad blocker or firewall, try disabling it temporarily.";
    }
    
    appendMessage('bot', errorMsg);
  }
}

// Sanitize user input to prevent XSS attacks
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Send message to API through server-side proxy
async function sendToAPI(message) {
  // In all environments, use the server-side proxy to secure the API key
  let retryCount = 0;
  
  while (retryCount <= yuktiConfig.apiRetryAttempts) {
    try {
      // Get CSRF token if available (assuming your site implements CSRF protection)
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      
      // Show longer delay in development for UX consistency
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency in dev
      }
      
      console.log('Sending request to API:', yuktiConfig.apiEndpoint);
      
      const response = await fetch(yuktiConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'X-Security-Token': yuktiConfig.securityToken
        },
        body: JSON.stringify({
          message: message,
          systemPrompt: yuktiConfig.systemPrompt,
          timestamp: Date.now()
        }),
        // Include credentials to send cookies for session-based authentication
        credentials: 'same-origin'
      });

      console.log('Response status:', response.status);
      
      // Parse the response data
      const data = await response.json().catch(err => {
        console.error('Error parsing JSON response:', err);
        throw new Error('Invalid JSON response from server');
      });
      
      console.log('Response data structure:', Object.keys(data));
      
      // Check for error response first
      if (!response.ok || data.error) {
        console.error('API returned error:', data.error || `Status code ${response.status}`);
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }
      
      // Validate response structure
      if (!data || !data.response) {
        console.error('Missing response field in API data:', data);
        throw new Error('Invalid response format - missing response field');
      }
      
      console.log('Successfully received response from API');
      return data.response.trim();
    } catch (error) {
      console.error(`API call attempt ${retryCount + 1} failed:`, error);
      
      // If we've reached max retries, throw the error
      if (retryCount >= yuktiConfig.apiRetryAttempts) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, yuktiConfig.apiRetryDelay));
      retryCount++;
    }
  }
}

// Append a message to the chat
function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
  
  const messagePara = document.createElement('p');
  messagePara.textContent = text;
  
  messageDiv.appendChild(messagePara);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom of chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageDiv;
}

// Add typing indicator
function appendTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'bot-message typing-indicator';
  
  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dots.appendChild(dot);
  }
  
  typingDiv.appendChild(dots);
  chatMessages.appendChild(typingDiv);
  
  // Scroll to bottom of chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return typingDiv;
}

// Remove typing indicator
function removeTypingIndicator(indicator) {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

// Update the queries remaining display
function updateQueriesRemaining() {
  if (queriesRemainingElement) {
    queriesRemainingElement.textContent = `${yuktiConfig.freeQueriesRemaining} free queries remaining`;
  }
} 