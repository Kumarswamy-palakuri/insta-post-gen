/**
 * Netlify Serverless Function for QuizCraft AI
 * Endpoint: /.netlify/functions/generate-quiz (also routed to /api/generate-quiz)
 */

import { handleQuizRequest } from './quizHandler.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ success: false, error: 'Invalid JSON request body' }),
      };
    }
  }

  try {
    const result = await handleQuizRequest({
      method: event.httpMethod,
      body,
      query: event.queryStringParameters || {},
      headers: event.headers || {},
    });

    return {
      statusCode: result.statusCode || 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.data),
    };
  } catch (err) {
    console.error('Netlify function error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: false, error: err.message || 'Internal server error' }),
    };
  }
};

