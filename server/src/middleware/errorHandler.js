"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'An unexpected error occurred' });
}
//# sourceMappingURL=errorHandler.js.map