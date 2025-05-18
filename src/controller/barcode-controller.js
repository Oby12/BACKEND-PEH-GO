// src/controller/barcode-controller.js
import qrcode from "qrcode";
import { ResponseError } from "../error/response-error.js";
import destinationService from "../service/destination-service.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Dapatkan path direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Buat direktori tmp jika belum ada
const tempDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const generateQRCode = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const destinationId = parseInt(req.params.destinationId);

        // Validasi ID
        if (isNaN(categoryId) || isNaN(destinationId)) {
            throw new ResponseError(400, "ID parameter tidak valid");
        }

        // Cek apakah destinasi ada
        const destination = await destinationService.get(categoryId, destinationId);

        // Data untuk QR code (format: pehgo://destination/{categoryId}/{destinationId})
        const qrData = `pehgo://destination/${categoryId}/${destinationId}`;

        // Buat nama file unik
        const fileName = `destinasi-${destinationId}-${Date.now()}.png`;
        const filePath = path.join(tempDir, fileName);

        console.log(`Generating QR code for destination ${destinationId}, data: ${qrData}`);

        // Opsi QR code yang lebih baik untuk pembacaan
        const options = {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.92,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300 // Ukuran lebih besar
        };

        // Generate QR code dan simpan ke file
        await qrcode.toFile(filePath, qrData, options);

        console.log(`QR code saved to ${filePath}`);

        // Kirim file sebagai response
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${destination.name.replace(/[^a-z0-9]/gi, '_')}_qrcode.png"`);

        // Stream file ke response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Hapus file setelah dikirim
        fileStream.on('end', () => {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting temporary file: ${err.message}`);
            });
        });
    } catch (e) {
        console.error(`Error generating QR code: ${e.message}`);
        next(e);
    }
};

export default {
    generateQRCode
};