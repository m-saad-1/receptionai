"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = adminAuth;
function adminAuth(req, res, next) {
    const token = req.headers['x-admin-token'];
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret';
    if (!token || token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or missing admin token' });
    }
    next();
}
//# sourceMappingURL=adminAuth.js.map