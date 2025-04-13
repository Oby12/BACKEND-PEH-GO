// src/controller/destination-controller.js
import destinationService from "../service/destination-service.js";
import multer from 'multer';
import { compressImage, sanitizeResponse } from '../utils/image-utils.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Mendapatkan path direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path untuk placeholder image
const PLACEHOLDER_PATH = path.join(__dirname, '../assets/placeholder.jpg');
// Buat folder assets jika belum ada
const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}
// Jika placeholder belum ada, buat placeholder kosong
if (!fs.existsSync(PLACEHOLDER_PATH)) {
    // Buat placeholder image dasar jika tidak ada
    console.log('Creating placeholder image...');
    const placeholderContent = Buffer.from(
        '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',
        'base64'
    );
    fs.writeFileSync(PLACEHOLDER_PATH, placeholderContent);
}

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

// Endpoint khusus untuk mengambil gambar cover dengan validasi dan log
const getCoverImage = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        console.log(`Getting cover image for destination ${destinationId}`);

        const destination = await destinationService.getCoverImage(destinationId);

        if (!destination || !destination.cover) {
            console.log(`No cover found for destination ${destinationId}, serving placeholder`);
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        }

        try {
            // Konversi data BLOB dengan benar
            const imageBuffer = Buffer.from(destination.cover);
            console.log(`Cover found for destination ${destinationId}, size: ${imageBuffer.length} bytes`);

            // Set header yang tepat
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Kirim buffer gambar
            res.send(imageBuffer);
        } catch (imageError) {
            console.error('Error processing image:', imageError);
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        }
    } catch (e) {
        console.error('Error serving cover image:', e);
        try {
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        } catch (fallbackError) {
            console.error('Error sending placeholder:', fallbackError);
            next(e);
        }
    }
};

// Endpoint khusus untuk mengambil gambar dengan validasi dan log
const getPictureImage = async (req, res, next) => {
    try {
        const pictureId = parseInt(req.params.id);
        console.log(`Getting picture image for ID ${pictureId}`);

        const picture = await destinationService.getPictureImage(pictureId);

        if (!picture || !picture.picture) {
            console.log(`No picture found for ID ${pictureId}, serving placeholder`);
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        }

        try {
            // Konversi data BLOB dengan benar
            const imageBuffer = Buffer.from(picture.picture);
            console.log(`Picture found for ID ${pictureId}, size: ${imageBuffer.length} bytes`);

            // Set header yang tepat
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Kirim buffer gambar
            res.send(imageBuffer);
        } catch (imageError) {
            console.error('Error processing image:', imageError);
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        }
    } catch (e) {
        console.error('Error serving picture image:', e);
        try {
            res.setHeader('Content-Type', 'image/jpeg');
            return res.sendFile(PLACEHOLDER_PATH);
        } catch (fallbackError) {
            console.error('Error sending placeholder:', fallbackError);
            next(e);
        }
    }
};

// Endpoint tambahan untuk mengambil gambar cover sebagai base64
const getBase64CoverImage = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);
        console.log(`Getting base64 cover for destination ${destinationId}`);

        const destination = await destinationService.getCoverImage(destinationId);

        if (!destination || !destination.cover) {
            console.log(`No cover found for destination ${destinationId}, serving placeholder as base64`);
            // Baca placeholder dan encode ke base64
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }

        try {
            // Konversi BLOB ke buffer dan encode ke base64
            const imageBuffer = Buffer.from(destination.cover);
            console.log(`Cover found, size: ${imageBuffer.length} bytes, converting to base64`);

            const base64Image = imageBuffer.toString('base64');

            // Kirim sebagai JSON dengan data URI
            res.json({
                imageData: `data:image/jpeg;base64,${base64Image}`
            });
        } catch (imageError) {
            console.error('Error processing base64 image:', imageError);
            // Fallback ke placeholder
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }
    } catch (e) {
        console.error('Error serving base64 image:', e);
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
    getPictureImage,
    getBase64CoverImage
};