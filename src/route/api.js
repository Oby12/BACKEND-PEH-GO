// src/route/api.js
import destinationController from "../controller/destination-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import express from "express";
import userController from "../controller/user-controller.js";
import statsController from "../controller/stats-controller.js";
import favoriteController from "../controller/favorite-controller.js";

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

//endpoint untuk logout
protectedRouter.delete("/users/logout", userController.logout);

// // Endpoint khusus untuk mengakses gambar dengan caching
// protectedRouter.get("/api/images/covers/:id", destinationController.getCoverImage);
// protectedRouter.get("/api/images/pictures/:id", destinationController.getPictureImage);

// Endpoint statistik untuk admin
protectedRouter.get("/admin/stats",
    authMiddleware(['ADMIN']),
    statsController.getStats
);

// Endpoint untuk mencatat view destinasi
protectedRouter.post("/destinations/:destinationId/view",
    statsController.addDestinationView
);

// Endpoint untuk mengecek status favorit
protectedRouter.get(
    "/destinations/:destinationId/favorite",
    favoriteController.checkIsFavorite
);

// Endpoint untuk menambah/menghapus favorit
protectedRouter.post(
    "/destinations/:destinationId/favorite",
    favoriteController.toggleFavorite
);

// Endpoint untuk mendapatkan daftar favorit
protectedRouter.get(
    "/users/favorites",
    favoriteController.getUserFavorites
);

export { protectedRouter };