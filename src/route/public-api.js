// src/route/public-api.js
import express from "express";
import userController from "../controller/user-controller.js";
import destinationController from "../controller/destination-controller.js";
import base64ImageController from "../controller/base64-image-controller.js";
import barcodeController from "../controller/barcode-controller.js";
import otherController from "../controller/other-controller.js";

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

//FITUR OTHER

// Endpoint untuk mengakses gambar cover Other (tanpa autentikasi)
publicRouter.get("/api/images/other/covers/:otherId", otherController.getCoverImage);

//barcode
//publicRouter.get("/api/barcode/:categoryId/:destinationId", barcodeController.generateQrCode);
export {
    publicRouter
}