// Test-only HTTP server. Uses production JWT middleware and AI router, with a
// fake database lookup; it never creates users or touches the existing database.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'browser-test-jwt-secret-only-000000000000';
process.env.AI_SERVICE_URL = 'http://127.0.0.1:8101';
process.env.AI_ASR_SERVICE_URL = 'http://127.0.0.1:8101';
process.env.AI_ASR_SERVICE_TOKEN = 'browser-test-service-token-only-00000000';
process.env.AI_CHAT_API_FORMAT = 'native';
process.env.AI_SERVICE_TOKEN = 'browser-test-service-token-only-00000000';
process.env.AI_RATE_LIMIT_MAX = '100';
const express = require('../../../backend/node_modules/express');
const jwt = require('../../../backend/node_modules/jsonwebtoken');
const { User } = require('../../../backend/dist/models/User');
const { protect } = require('../../../backend/dist/middlewares/auth');
const { createAiRouter } = require('../../../backend/dist/routes/ai.routes');
const user = { _id: '000000000000000000000001', id: '000000000000000000000001', name: 'Test Reader', firstName: 'Test', role: 'user', status: 'active' };
User.findById = async id => id === user.id ? user : null;
const app = express();
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/auth/me', protect, (_req, res) => res.json({ success: true, user }));
app.get('/test-token', (_req, res) => res.json({ token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }) }));
app.use('/api/ai', createAiRouter());
app.listen(5101, '127.0.0.1');
