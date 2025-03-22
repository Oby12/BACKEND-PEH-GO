import destinationController from "../controller/destination-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import express from "express";
import {ResponseError} from "../error/response-error.js";
import {prismaClient} from "../application/database.js";

const protectedRouter = express.Router();
protectedRouter.use(authMiddleware(['ADMIN', 'WISATAWAN'])); // Hanya admin dan wisatawan yang bisa mengakses

// Admin-only endpoints
protectedRouter.post("/users/:categoryId/destinations", authMiddleware(['ADMIN']), destinationController.uploadImage,destinationController.create);
protectedRouter.put("/users/:categoryId/destinations/:destinationId", authMiddleware(['ADMIN']), destinationController.uploadImage, destinationController.update);

// // any-only endpoints
protectedRouter.get("/users/:categoryId/destinations", destinationController.list);
protectedRouter.get("/users/:categoryId/destinations/:destinationId", destinationController.get);
protectedRouter.delete("/users/:categoryId/destinations/:destinationId", authMiddleware(['ADMIN']), destinationController.remove);

//----------------------------------------------------------------------------
// Endpoint untuk mengakses gambar cover
protectedRouter.get("/api/images/covers/:id", async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        const destination = await prismaClient.destination.findUnique({
            where: { id: destinationId },
            select: { cover: true }
        });

        if (!destination || !destination.cover) {
            throw new ResponseError(404, "Image not found");
        }

        res.setHeader('Content-Type', 'image/jpeg'); // Sesuaikan dengan tipe gambar Anda
        res.send(destination.cover);
    } catch (e) {
        next(e);
    }
});

// Endpoint untuk mengakses gambar picture
protectedRouter.get("/api/images/pictures/:id", async (req, res, next) => {
    try {
        const pictureId = parseInt(req.params.id);
        const picture = await prismaClient.picture.findUnique({
            where: { id: pictureId },
            select: { picture: true }
        });

        if (!picture || !picture.picture) {
            throw new ResponseError(404, "Image not found");
        }

        res.setHeader('Content-Type', 'image/jpeg'); // Sesuaikan dengan tipe gambar Anda
        res.send(picture.picture);
    } catch (e) {
        next(e);
    }
});

export { protectedRouter };