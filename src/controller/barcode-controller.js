import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import QRCode from "qrcode";

/**
 * Controller untuk menangani operasi barcode/QR code
 * Hanya admin yang bisa mengakses endpoint ini
 */

const generateQrCode = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);
        const user = req.user; // User dari auth middleware

        // Validasi parameter
        if (isNaN(categoryId) || isNaN(destinationId)) {
            throw new ResponseError(400, "Category ID dan Destination ID harus berupa angka");
        }

        // Double check: pastikan user adalah admin
        if (user.role !== 'ADMIN') {
            throw new ResponseError(403, "Akses ditolak. Hanya admin yang dapat mengunduh QR code");
        }

        // Cek apakah destinasi ada
        const destination = await prismaClient.destination.findFirst({
            where: {
                id: destinationId,
                categoryId: categoryId
            },
            include: {
                Category: true
            }
        });

        if (!destination) {
            throw new ResponseError(404, "Destinasi tidak ditemukan");
        }

        // --- PERUBAHAN UTAMA DI SINI ---
        // Buat string dengan format URI yang diharapkan oleh aplikasi Android
        const qrContent = `pehgo://destination/${categoryId}/${destinationId}`;

        // Generate QR code dari string di atas, BUKAN dari objek JSON
        const qrCodeBuffer = await QRCode.toBuffer(qrContent, {
            errorCorrectionLevel: 'M',
            type: 'png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 256
        });

        // Log aktivitas download untuk audit
        console.log(`QR Code downloaded by admin ${user.username} for destination ${destination.name} (ID: ${destinationId})`);

        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${destination.name.replace(/[^a-zA-Z0-9]/g, '_')}_qrcode.png"`);
        res.setHeader('Content-Length', qrCodeBuffer.length);

        // Kirim QR code sebagai response
        res.send(qrCodeBuffer);

    } catch (error) {
        next(error);
    }
};

/**
 * Endpoint untuk mendapatkan informasi QR code tanpa mendownload
 * Untuk preview atau debugging
 */
const getQrCodeInfo = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);
        const user = req.user;

        // Validasi parameter
        if (isNaN(categoryId) || isNaN(destinationId)) {
            throw new ResponseError(400, "Category ID dan Destination ID harus berupa angka");
        }

        // Hanya admin yang bisa akses
        if (user.role !== 'ADMIN') {
            throw new ResponseError(403, "Akses ditolak. Hanya admin yang dapat mengakses informasi QR code");
        }

        // Cek destinasi
        const destination = await prismaClient.destination.findFirst({
            where: {
                id: destinationId,
                categoryId: categoryId
            },
            include: {
                Category: true
            }
        });

        if (!destination) {
            throw new ResponseError(404, "Destinasi tidak ditemukan");
        }

        // Return info tanpa generate QR
        const qrInfo = {
            categoryId: categoryId,
            destinationId: destinationId,
            destinationName: destination.name,
            categoryName: destination.Category.name,
            downloadUrl: `/api/barcode/${categoryId}/${destinationId}`,
            canDownload: user.role === 'ADMIN'
        };

        res.status(200).json({
            status: true,
            data: qrInfo
        });

    } catch (error) {
        next(error);
    }
};

export default {
    generateQrCode,
    getQrCodeInfo
};