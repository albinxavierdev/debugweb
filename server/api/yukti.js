/**
 * Server-side proxy for Yukti AI Chatbot
 * This securely handles API requests between the client and OpenAI
 * without exposing API keys to the frontend
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// API keys and security constants should be stored in environment variables
// Never hardcode API keys in your code
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-key-here'; // Set this through environment variables
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';

// Enhanced system prompt layer to ensure responses are short, personalized, and Debugshala-focused
const SYSTEM_PROMPT_WRAPPER = `You are Yukti, Debugshala's AI learning assistant. 
Respond in a friendly, concise manner (50-80 words maximum).
Always personalize your responses by referring to yourself as "I" or "Yukti" and mention Debugshala when relevant.
Focus on programming, data science, web development, and Debugshala's courses.
If asked about courses, mention actual Debugshala offerings: MERN Stack, Data Science, Java Full Stack, or Generative AI.
Always provide practical coding insights where applicable.
Never recommend resources outside of Debugshala unless absolutely necessary.

USER'S SYSTEM PROMPT: {userSystemPrompt}

USER QUERY: {userQuery}

Remember, keep your response brief, helpful, and focused on Debugshala's educational approach.`;

// Valid referrer domains - only allow requests from your own domains
const VALID_REFERRERS = ['debugshala.com', 'www.debugshala.com', 'localhost:3000'];

// Session tokens - for added security validation (more complete implementations would use a database)
const activeSessionTokens = new Set();

// Rate limiting middleware to prevent abuse - 10 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware to validate requests
const validateRequest = (req, res, next) => {
  // 1. Check referrer header to prevent requests from unauthorized domains
  const referrer = req.get('Referrer');
  if (referrer) {
    const referrerUrl = new URL(referrer);
    const referrerHost = referrerUrl.hostname;
    
    if (!VALID_REFERRERS.some(domain => referrerHost === domain || referrerHost.endsWith(`.${domain}`))) {
      return res.status(403).json({ error: 'Unauthorized referrer' });
    }
  } else {
    return res.status(403).json({ error: 'Missing referrer' });
  }
  
  // 2. Check for security token from client (basic defense against CSRF)
  const securityToken = req.get('X-Security-Token');
  if (!securityToken || securityToken.length < 32) {
    return res.status(403).json({ error: 'Invalid security token' });
  }
  
  // 3. Validate timestamp to prevent replay attacks
  const timestamp = req.body.timestamp;
  if (!timestamp || Date.now() - timestamp > 30000) { // Request must be recent (within 30 seconds)
    return res.status(403).json({ error: 'Request expired' });
  }
  
  // 4. Add session token to active tokens for future validation (more robust implementations would use a database)
  activeSessionTokens.add(securityToken);
  
  next();
};

// Handles POST requests to /api/yukti
router.post('/', apiLimiter, validateRequest, async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }
    
    // Check API key before making requests
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-key-here') {
      console.error('OpenAI API key not configured properly');
      return res.status(500).json({ 
        error: 'API configuration error',
        details: 'The server is not configured with a valid API key',
        requestId: crypto.randomUUID()
      });
    }
    
    // Truncate system prompt and message if they exceed limits
    const sanitizedSystemPrompt = (systemPrompt || '').slice(0, 500);
    const sanitizedMessage = message.slice(0, 1000);
    
    // Apply the enhanced system prompt wrapper
    const enhancedSystemPrompt = SYSTEM_PROMPT_WRAPPER
      .replace('{userSystemPrompt}', sanitizedSystemPrompt)
      .replace('{userQuery}', sanitizedMessage);
    
    // Request configuration
    const openaiRequestData = {
      model: MODEL,
      messages: [
        { role: 'system', content: enhancedSystemPrompt },
        { role: 'user', content: sanitizedMessage }
      ],
      max_tokens: 150,
      temperature: 0.7
    };
    
    // Log request (remove in production, only for debugging)
    console.log('Processing request for:', sanitizedMessage.substring(0, 50) + '...');
    
    try {
      // Make request to OpenAI API
      const openaiResponse = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(openaiRequestData)
      });
      
      // Handle API error responses
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({ error: { message: 'Unknown API error' } }));
        console.error('OpenAI API Error:', JSON.stringify(errorData));
        
        let clientErrorMessage = 'Error processing your request';
        
        // If the error is due to API key issues, provide a better error message
        if (errorData.error && errorData.error.type === 'authentication_error') {
          clientErrorMessage = 'API authentication failed. Please contact Debugshala support.';
          console.error('API Key authentication failure');
        } else if (errorData.error && errorData.error.type === 'insufficient_quota') {
          clientErrorMessage = 'Service temporarily unavailable. Please try again later.';
          console.error('API quota exceeded');
        }
        
        // Don't expose detailed API errors to client
        return res.status(500).json({ 
          error: clientErrorMessage, 
          requestId: crypto.randomUUID() // Provide request ID for logs without exposing internal details
        });
      }
      
      // Parse API response
      const data = await openaiResponse.json().catch(err => {
        console.error('Error parsing OpenAI response:', err);
        throw new Error('Failed to parse API response');
      });
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid response structure from OpenAI:', JSON.stringify(data));
        throw new Error('Invalid response structure from API');
      }
      
      // Send response to client
      return res.json({
        response: data.choices[0].message.content,
        usage: data.usage
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return res.status(500).json({ 
        error: 'Error connecting to AI service',
        details: 'There was a problem communicating with the AI service',
        requestId: crypto.randomUUID()
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      requestId: crypto.randomUUID()
    });
  }
});

module.exports = router; 