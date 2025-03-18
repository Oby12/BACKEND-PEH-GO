// import { prismaClient } from "../application/database.js";
// import { ResponseError } from "../error/response-error.js";
//
// const authMiddleware = (allowedRoles) => {
//     return async (req, res, next) => {
//         const token = req.headers['authorization'];
//         if (!token) {
//             throw new ResponseError(401, 'Unauthorized: Token is required');
//         }
//
//         const user = await prismaClient.user.findFirst({
//             where: {
//                 token: token
//             }
//         });
//
//         if (!user) {
//             throw new ResponseError(401, 'Unauthorized: Invalid token');
//         }
//
//         if (!allowedRoles.includes(user.role)) {
//             throw new ResponseError(403, 'Forbidden: You do not have permission');
//         }
//
//         req.user = user;
//         next();
//     };
// };
//
// export { authMiddleware };

import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                throw new ResponseError(401, 'Unauthorized: Token is required');
            }

            const user = await prismaClient.user.findFirst({
                where: {
                    token: token
                }
            });

            if (!user) {
                throw new ResponseError(401, 'Unauthorized: Invalid token');
            }

            if (!allowedRoles.includes(user.role)) {
                throw new ResponseError(403, 'Forbidden: You do not have permission');
            }

            req.user = user;
            next();
        } catch (error) {
            // Meneruskan error ke middleware error handler berikutnya
            next(error);
        }
    };
};

export { authMiddleware };