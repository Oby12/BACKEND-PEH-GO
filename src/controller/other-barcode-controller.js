import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import QRCode from "qrcode";

const generateOtherQrCode = async (req, res, next) => {
    try {
        const otherId = parseInt(req.params.otherId);
        const user = req.user;

        // Validasi parameter
        if (isNaN(otherId)) {
            throw new ResponseError(400, "Other ID harus berupa angka");
        }

        // Double check: pastikan user adalah admin
        if (user.role !== 'ADMIN') {
            throw new ResponseError(403, "Akses ditolak. Hanya admin yang dapat mengunduh barcode");
        }

        // Cek apakah Other ada
        const other = await prismaClient.other.findUnique({
            where: { id: otherId }
        });

        if (!other) {
            throw new ResponseError(404, "Other tidak ditemukan");
        }

        // Format QR code untuk Other: pehgo://other/{otherId}
        const qrData = `pehgo://other/${otherId}`;

        // Generate QR code
        const qrCodeBuffer = await QRCode.toBuffer(qrData, {
            type: 'png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 512
        });

        // Set header untuk download
        const filename = `QR_Other_${other.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', qrCodeBuffer.length);

        res.send(qrCodeBuffer);
    } catch (e) {
        next(e);
    }
};

export default {
    generateOtherQrCode
};