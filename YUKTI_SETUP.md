# Yukti AI Chatbot - Secure Implementation Guide

This document outlines the secure implementation of Yukti AI, an educational assistant chatbot for Debugshala's website. The implementation follows security best practices to protect API keys and prevent common web vulnerabilities.

## Security Features

The Yukti AI implementation includes these security features:

1. **Server-Side API Proxy**: API keys are never exposed to client-side code
2. **CSRF Protection**: Cross-Site Request Forgery protection with tokens
3. **Rate Limiting**: Prevents abuse by limiting requests per IP address
4. **Input Sanitization**: Prevents XSS attacks through proper sanitization
5. **Referrer Validation**: Only allows requests from authorized domains
6. **Request Validation**: Includes timestamp checking to prevent replay attacks
7. **Error Handling**: Doesn't expose sensitive information in error messages
8. **HTTPS**: All communication should be over encrypted HTTPS connections
9. **Content Security Policy**: Implemented via Helmet middleware

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Yukti AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_random_secret_here
```

For production, update the environment variables:

```
NODE_ENV=production
PORT=80
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## How It Works

### Client-Server Communication Flow

1. User sends a message through the chatbot UI
2. Client-side JavaScript sanitizes the input and sends a request to `/api/yukti`
3. The request includes a security token and timestamp
4. Server validates the request origin, token, and timestamp
5. If valid, the server forwards the request to OpenAI with the API key
6. OpenAI responds with the AI-generated answer
7. Server sends the response back to the client
8. Client displays the response in the chatbot UI

### Key Files

- `src/scripts/yukti-chatbot.js`: Client-side chatbot functionality
- `src/styles/teams.css`: Styling for the chatbot UI
- `server.js`: Main Express server setup
- `server/api/yukti.js`: Server-side API proxy for OpenAI

## Security Best Practices

1. **Never store API keys in client-side code** - Always use a server-side proxy.
2. **Use environment variables** - Store sensitive information in environment variables, not in code.
3. **Validate all input** - Sanitize user input on both client and server sides.
4. **Implement rate limiting** - Prevent abuse by limiting request frequency.
5. **Use HTTPS everywhere** - Encrypt all data in transit.
6. **Apply the principle of least privilege** - Only expose the minimum functionality needed.
7. **Monitor and log** - Keep track of API usage and errors.

## Troubleshooting

If you encounter CORS issues:
- Check that your domain is included in the CORS configuration in `server.js`

If you see CSRF token errors:
- Ensure that requests are being made from the same origin
- Make sure cookies are being properly set and sent

For API key issues:
- Verify that your `.env` file contains the correct OpenAI API key
- Check that the key has the necessary permissions

## Maintenance and Updates

- Regularly update dependencies to address security vulnerabilities
- Monitor OpenAI API changes that might affect the chatbot functionality
- Review and update rate limits based on usage patterns
- Check for any exposed API keys or secrets in code repositories 