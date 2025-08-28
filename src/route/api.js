// src/route/api.js
import destinationController from "../controller/destination-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import express from "express";
import userController from "../controller/user-controller.js";
import statsController from "../controller/stats-controller.js";
import favoriteController from "../controller/favorite-controller.js";
import barcodeController from "../controller/barcode-controller.js"; // Import barcode controller
import otherController from "../controller/other-controller.js";
import otherBarcodeController from "../controller/other-barcode-controller.js";

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

protectedRouter.delete("/users/:categoryId/destinations/:destinationId",
    authMiddleware(['ADMIN']),
    destinationController.remove
);

// Endpoint untuk download barcode - HANYA ADMIN
protectedRouter.get("/api/barcode/:categoryId/:destinationId",
    authMiddleware(['ADMIN']), // Hanya admin yang bisa download barcode
    barcodeController.generateQrCode
);

// Endpoints untuk semua pengguna (admin dan wisatawan)
protectedRouter.get("/users/:categoryId/destinations", destinationController.list);
protectedRouter.get("/users/:categoryId/destinations/:destinationId", destinationController.get);

// Endpoint untuk logout
protectedRouter.delete("/users/logout", userController.logout);

// Endpoint statistik untuk admin
protectedRouter.get("/admin/stats",
    authMiddleware(['ADMIN']),
    statsController.getStats
);

// Endpoint untuk mencatat view destinasi (semua user)
protectedRouter.post("/destinations/:destinationId/view",
    statsController.addDestinationView
);

// Endpoint untuk mengecek status favorit (semua user)
protectedRouter.get(
    "/destinations/:destinationId/favorite",
    favoriteController.checkIsFavorite
);

// Endpoint untuk menambah/menghapus favorit (semua user)
protectedRouter.post(
    "/destinations/:destinationId/favorite",
    favoriteController.toggleFavorite
);

// Endpoint untuk mendapatkan daftar favorit (semua user)
protectedRouter.get(
    "/users/favorites",
    favoriteController.getUserFavorites
);

// Endpoint untuk download barcode - HANYA ADMIN
protectedRouter.get("/api/barcode/:categoryId/:destinationId",
    authMiddleware(['ADMIN']), // Pastikan hanya admin yang bisa mengakses
    barcodeController.generateQrCode
);

//OTHER FITUR

// Admin-only endpoints untuk Other
protectedRouter.post("/admin/others",
    authMiddleware(['ADMIN']),
    otherController.uploadCover,
    otherController.create
);

protectedRouter.put("/admin/others/:otherId",
    authMiddleware(['ADMIN']),
    otherController.uploadCover,
    otherController.update
);

protectedRouter.delete("/admin/others/:otherId",
    authMiddleware(['ADMIN']),
    otherController.remove
);

// Endpoints untuk semua pengguna
protectedRouter.get("/others", otherController.list);
protectedRouter.get("/others/:otherId", otherController.get);

// Endpoint untuk download barcode Other - HANYA ADMIN
protectedRouter.get("/api/barcode/other/:otherId",
    authMiddleware(['ADMIN']),
    otherBarcodeController.generateOtherQrCode
);



export { protectedRouter };