// src/route/api.js
import destinationController from "../controller/destination-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import express from "express";

const protectedRouter = express.Router();
protectedRouter.use(authMiddleware(['ADMIN', 'WISATAWAN'])); // Hanya admin dan wisatawan yang bisa mengakses

// Admin-only endpoints
protectedRouter.post("/users/:categoryId/destinations",
    authMiddleware(['ADMIN']),
    destinationController.uploadImage,
    destinationController.create
);

protectedRouter.put("/users/:categoryId/destinations/:destinationId",
    authMiddleware(['ADMIN']),
    destinationController.uploadImage,
    destinationController.update
);

// Endpoints untuk semua pengguna
protectedRouter.get("/users/:categoryId/destinations", destinationController.list);
protectedRouter.get("/users/:categoryId/destinations/:destinationId", destinationController.get);
protectedRouter.delete("/users/:categoryId/destinations/:destinationId",
    authMiddleware(['ADMIN']),
    destinationController.remove
);

// Endpoint khusus untuk mengakses gambar dengan caching
protectedRouter.get("/api/images/covers/:id", destinationController.getCoverImage);
protectedRouter.get("/api/images/pictures/:id", destinationController.getPictureImage);

export { protectedRouter };