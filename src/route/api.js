import destinationController from "../controller/destination-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import express from "express";

const protectedRouter = new express.Router();
protectedRouter.use(authMiddleware(['ADMIN', 'WISATAWAN'])); // Hanya admin dan wisatawan yang bisa mengakses

// Admin-only endpoints
protectedRouter.post("/destinations", authMiddleware(['ADMIN']), destinationController.createDestination);
protectedRouter.put("/destinations/:id", authMiddleware(['ADMIN']), destinationController.updateDestination);
protectedRouter.delete("/destinations/:id", authMiddleware(['ADMIN']), destinationController.deleteDestination);

// Wisatawan-only endpoints
protectedRouter.get("/destinations", destinationController.getDestinations);
protectedRouter.get("/destinations/:id", destinationController.getDestinationById);

export { protectedRouter };