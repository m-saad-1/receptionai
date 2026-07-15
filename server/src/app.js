"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rateLimiter_1 = require("./services/rateLimiter");
const conversations_1 = __importDefault(require("./routes/conversations"));
const chat_1 = __importDefault(require("./routes/chat"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Apply rate limiter to all /api routes
app.use('/api/', rateLimiter_1.apiLimiter);
app.use('/api/conversations', conversations_1.default);
app.use('/api/chat', chat_1.default);
app.use('/api/admin', admin_1.default);
// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map