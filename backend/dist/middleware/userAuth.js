"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const userAuth = (req, res, next) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'USER') {
            res.status(403).json({
                status: 'error',
                message: 'Access denied. Only users can book sessions'
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Authentication failed'
        });
    }
};
exports.userAuth = userAuth;
