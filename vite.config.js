import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleQuizRequest } from './netlify/functions/quizHandler.js';

/**
 * Local AI Server Plugin
 * Emulates the Netlify Serverless Function locally within the Vite dev & preview server
 * Handles POST/GET requests to /api/generate-quiz and /.netlify/functions/generate-quiz
 */
function localAiServerPlugin() {
  const middleware = async (req, res, next, mode) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];

    if (pathname === '/api/generate-quiz' || pathname === '/.netlify/functions/generate-quiz') {
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        res.end();
        return;
      }

      if (req.method === 'GET') {
        try {
          const env = loadEnv(mode || 'development', process.cwd(), '');
          Object.assign(process.env, env);

          const result = await handleQuizRequest({
            method: 'GET',
            query: {},
            headers: req.headers,
          });

          res.writeHead(result.statusCode || 200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify(result.data));
        } catch (err) {
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
        }
        return;
      }

      let bodyText = '';
      req.on('data', (chunk) => {
        bodyText += chunk;
      });

      req.on('end', async () => {
        let body = {};
        if (bodyText) {
          try {
            body = JSON.parse(bodyText);
          } catch (e) {
            res.writeHead(400, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            });
            res.end(JSON.stringify({ success: false, error: 'Invalid JSON request body' }));
            return;
          }
        }

        try {
          // Load .env variables into process.env so GEMINI_API_KEY is available
          const env = loadEnv(mode || 'development', process.cwd(), '');
          Object.assign(process.env, env);

          const result = await handleQuizRequest({
            method: req.method,
            body,
            headers: req.headers,
          });

          res.writeHead(result.statusCode || 200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify(result.data));
        } catch (err) {
          console.error('Local AI server error:', err);
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: false, error: err.message || 'Server error' }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'local-ai-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => middleware(req, res, next, server.config.mode));
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => middleware(req, res, next, server.config.mode));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localAiServerPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true, // Exposes server to local network (0.0.0.0)
  },
  preview: {
    port: 3000,
    host: true,
  },
}));
