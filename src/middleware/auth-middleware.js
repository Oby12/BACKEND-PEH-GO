import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                throw new ResponseError(401, 'Unauthorized: Token is required');
            }

            // FIX: Extract token from "Bearer <token>" format
            let token = authHeader;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove "Bearer " prefix
            }

            console.log('Extracted token:', token.substring(0, 10) + '...'); // Log untuk debugging

            const user = await prismaClient.user.findFirst({
                where: {
                    token: token
                }
            });

            if (!user) {
                console.log('User not found with token:', token.substring(0, 10) + '...');
                throw new ResponseError(401, 'Unauthorized: Invalid token');
            }

            if (!allowedRoles.includes(user.role)) {
                console.log('User role not allowed:', user.role, 'Expected:', allowedRoles);
                throw new ResponseError(403, 'Forbidden: You do not have permission');
            }

            console.log('Authentication successful for user:', user.username, 'Role:', user.role);
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            next(error);
        }
    };
};

export { authMiddleware };