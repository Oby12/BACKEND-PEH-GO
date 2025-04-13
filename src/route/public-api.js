// src/route/public-api.js
import express from "express";
import userController from "../controller/user-controller.js";
import destinationController from "../controller/destination-controller.js";
import base64ImageController from "../controller/base64-image-controller.js";

const publicRouter = new express.Router();

// User authentication endpoints
publicRouter.post("/users/register", userController.register);
publicRouter.post("/users/login", userController.login);

// ENDPOINT GAMBAR DI PUBLIC ROUTER UNTUK MEMUNGKINKAN AKSES TANPA AUTENTIKASI
// Endpoint untuk mengakses gambar (tanpa autentikasi)
publicRouter.get("/api/images/covers/:id", destinationController.getCoverImage);
publicRouter.get("/api/images/pictures/:id", destinationController.getPictureImage);

// Endpoint untuk gambar base64
publicRouter.get("/api/images/base64/covers/:id", base64ImageController.getBase64CoverImage);
publicRouter.get("/api/images/base64/pictures/:id", base64ImageController.getBase64PictureImage);

export {
    publicRouter
}