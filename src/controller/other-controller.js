import otherService from "../service/other-service.js";
import multer from 'multer';
import { compressImage, sanitizeResponse } from '../utils/image-utils.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware untuk upload gambar cover
const uploadCover = upload.single('cover');

const create = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Gambar cover wajib diunggah"
            });
        }

        // Kompres gambar cover sebelum disimpan
        const compressedCover = await compressImage(req.file.buffer);

        // Menyiapkan data dengan gambar terkompresi
        const data = {
            ...req.body,
            cover: compressedCover
        };

        const result = await otherService.create(data);

        // Sanitasi respons untuk menghapus data biner
        const sanitizedResult = sanitizeResponse(result);

        res.status(201).json({
            status: true,
            message: "Other berhasil dibuat",
            data: sanitizedResult
        });
    } catch (e) {
        next(e);
    }
};

const list = async (req, res, next) => {
    try {
        const results = await otherService.list();

        // Sanitasi hasil untuk menghapus data biner
        const sanitizedResults = results.map(other => sanitizeResponse(other));

        res.status(200).json({
            status: true,
            message: "Berhasil mengambil data Other",
            data: sanitizedResults
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const otherId = parseInt(req.params.otherId);
        const result = await otherService.get(otherId);

        // Sanitasi respons untuk menghapus data biner
        const sanitizedResult = sanitizeResponse(result);

        res.status(200).json({
            status: true,
            message: "Berhasil mengambil detail Other",
            data: sanitizedResult
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const otherId = parseInt(req.params.otherId);
        let data = {
            id: otherId,
            ...req.body
        };

        // Jika ada file cover baru, kompres dulu
        if (req.file) {
            const compressedCover = await compressImage(req.file.buffer);
            data.cover = compressedCover;
        }

        const result = await otherService.update(data);

        // Sanitasi respons untuk menghapus data biner
        const sanitizedResult = sanitizeResponse(result);

        res.status(200).json({
            status: true,
            message: "Other berhasil diupdate",
            data: sanitizedResult
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const otherId = parseInt(req.params.otherId);
        await otherService.remove(otherId);

        res.status(200).json({
            status: true,
            message: "Other berhasil dihapus"
        });
    } catch (e) {
        next(e);
    }
};

const getCoverImage = async (req, res, next) => {
    try {
        const otherId = parseInt(req.params.otherId);
        const result = await otherService.getCoverImage(otherId);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 tahun
        res.send(result.cover);
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    list,
    get,
    update,
    remove,
    getCoverImage,
    uploadCover
};