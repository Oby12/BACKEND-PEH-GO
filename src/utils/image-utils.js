// src/utils/image-utils.js
import sharp from 'sharp';

/**
 * Kompres gambar sebelum disimpan ke database
 * @param {Buffer} buffer - Buffer gambar asli
 * @param {Number} quality - Kualitas kompresi (1-100)
 * @param {Number} maxWidth - Lebar maksimum gambar
 * @returns {Promise<Buffer>} - Buffer gambar terkompresi
 */
export const compressImage = async (buffer, quality = 80, maxWidth = 1200) => {
    try {
        return await sharp(buffer)
            .resize({ width: maxWidth, withoutEnlargement: true })
            .jpeg({ quality: quality })
            .toBuffer();
    } catch (error) {
        console.error('Error compressing image:', error);
        return buffer; // Fallback ke buffer asli jika kompresi gagal
    }
};

/**
 * Menghapus data biner gambar dari respons JSON
 * @param {Object} data - Data respons dengan gambar biner
 * @returns {Object} - Data respons tanpa gambar biner
 */
export const sanitizeResponse = (data) => {
    if (!data) return data;

    // Buat salinan objek untuk menghindari mutasi langsung
    const sanitized = { ...data };

    // Hapus gambar biner dari respons
    if (sanitized.cover) {
        delete sanitized.cover;
    }

    // Jika ada array gambar, hapus data biner
    if (sanitized.picture && Array.isArray(sanitized.picture)) {
        sanitized.picture = sanitized.picture.map(pic => {
            const picCopy = { ...pic };
            if (picCopy.picture) {
                delete picCopy.picture;
            }
            return picCopy;
        });
    }

    return sanitized;
};