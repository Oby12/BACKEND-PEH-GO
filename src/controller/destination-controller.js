// src/controller/destination-controller.js
import destinationService from "../service/destination-service.js";
import multer from 'multer';
import { compressImage, sanitizeResponse } from '../utils/image-utils.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware untuk upload
const uploadImage = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'picture', maxCount: 3 } // Batasi jumlah gambar untuk performa
]);

const create = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);

        // Kompresi gambar cover sebelum disimpan
        let coverBuffer = req.files.cover[0].buffer;
        const compressedCover = await compressImage(coverBuffer);

        // Menyiapkan data dengan gambar terkompresi
        const data = {
            ...req.body,
            cover: compressedCover,
            categoryId: categoryId,
            picture: req.files.picture ? await Promise.all(req.files.picture.map(async file => ({
                data: await compressImage(file.buffer)
            }))) : []
        };

        const result = await destinationService.create(data);
        res.status(201).json({
            data: sanitizeResponse(result)
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);
        const result = await destinationService.get(categoryId, destinationId);
        res.status(200).json({
            data: result // Service sudah menangani sanitisasi data
        });
    } catch (e) {
        next(e);
    }
};

const list = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        // Tambahkan pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await destinationService.list(categoryId, page, limit);

        res.status(200).json({
            data: result.data,
            pagination: result.pagination
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);

        // Pastikan ID valid
        if (isNaN(categoryId) || isNaN(destinationId)) {
            return res.status(400).json({
                errors: "ID parameter tidak valid"
            });
        }

        // Siapkan data request
        const requestData = {
            ...req.body,
            id: destinationId,
            categoryId: categoryId
        };

        // Tambahkan informasi file jika ada
        if (req.files) {
            if (req.files.cover && req.files.cover.length > 0) {
                // Kompres cover sebelum update
                requestData.cover = await compressImage(req.files.cover[0].buffer);
            }

            if (req.files.picture && req.files.picture.length > 0) {
                requestData.pictures = await Promise.all(req.files.picture.map(async file => ({
                    data: await compressImage(file.buffer)
                })));
            }
        }

        const result = await destinationService.update(categoryId, requestData);
        res.status(200).json({
            data: sanitizeResponse(result)
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);

        await destinationService.remove(categoryId, destinationId);
        res.status(200).json({
            message: 'Destinasi berhasil dihapus'
        });
    } catch (e) {
        next(e);
    }
};

// Endpoint khusus untuk mengambil gambar cover
const getCoverImage = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        const destination = await destinationService.getCoverImage(destinationId);

        // Set cache header untuk meningkatkan performa
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24 jam
        res.setHeader('ETag', `"dest-cover-${destinationId}"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(destination.cover);
    } catch (e) {
        next(e);
    }
};

// Endpoint khusus untuk mengambil gambar
const getPictureImage = async (req, res, next) => {
    try {
        const pictureId = parseInt(req.params.id);
        const picture = await destinationService.getPictureImage(pictureId);

        // Set cache header untuk meningkatkan performa
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24 jam
        res.setHeader('ETag', `"dest-pic-${pictureId}"`);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(picture.picture);
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    uploadImage,
    list,
    get,
    update,
    remove,
    getCoverImage,
    getPictureImage
};