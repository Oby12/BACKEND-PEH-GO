// src/controller/base64-image-controller.js
import destinationService from "../service/destination-service.js";
import { ResponseError } from "../error/response-error.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan path direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path untuk placeholder image
const PLACEHOLDER_PATH = path.join(__dirname, '../assets/placeholder.jpg');

const getBase64CoverImage = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.id);

        if (isNaN(destinationId)) {
            throw new ResponseError(400, "ID tidak valid");
        }

        // Coba ambil data gambar cover
        const destination = await destinationService.getCoverImage(destinationId);

        if (!destination || !destination.cover) {
            // Jika gambar tidak ditemukan, gunakan placeholder
            console.log(`Cover tidak ditemukan untuk destinasi ${destinationId}, menggunakan placeholder`);
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }

        try {
            // Konversi BLOB ke buffer dan encode ke base64
            const imageBuffer = Buffer.from(destination.cover);
            console.log(`Cover ditemukan untuk destinasi ${destinationId}, ukuran: ${imageBuffer.length} bytes`);

            const base64Image = imageBuffer.toString('base64');

            // Kirim sebagai JSON dengan data URI
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Image}`
            });
        } catch (imageError) {
            console.error('Error saat memproses gambar:', imageError);
            // Fallback ke placeholder
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }
    } catch (e) {
        console.error('Error saat menyajikan gambar base64:', e);
        next(e);
    }
};

// Menambahkan endpoint baru untuk gambar picture
const getBase64PictureImage = async (req, res, next) => {
    try {
        const pictureId = parseInt(req.params.id);

        if (isNaN(pictureId)) {
            throw new ResponseError(400, "ID tidak valid");
        }

        // Coba ambil data gambar picture
        const picture = await destinationService.getPictureImage(pictureId);

        if (!picture || !picture.picture) {
            // Jika gambar tidak ditemukan, gunakan placeholder
            console.log(`Picture tidak ditemukan untuk ID ${pictureId}, menggunakan placeholder`);
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }

        try {
            // Konversi BLOB ke buffer dan encode ke base64
            const imageBuffer = Buffer.from(picture.picture);
            console.log(`Picture ditemukan untuk ID ${pictureId}, ukuran: ${imageBuffer.length} bytes`);

            const base64Image = imageBuffer.toString('base64');

            // Kirim sebagai JSON dengan data URI
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Image}`
            });
        } catch (imageError) {
            console.error('Error saat memproses gambar:', imageError);
            // Fallback ke placeholder
            const placeholderBuffer = fs.readFileSync(PLACEHOLDER_PATH);
            const base64Placeholder = placeholderBuffer.toString('base64');
            return res.json({
                imageData: `data:image/jpeg;base64,${base64Placeholder}`
            });
        }
    } catch (e) {
        console.error('Error saat menyajikan gambar base64:', e);
        next(e);
    }
};

export default {
    getBase64CoverImage,
    getBase64PictureImage
};