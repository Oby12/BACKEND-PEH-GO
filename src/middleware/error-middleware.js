// src/middleware/error-middleware.js
const errorMiddleware = async (err, req, res, next) => {
    // Jika tidak ada error akan di lanjutkan
    if (!err) {
        next();
        return;
    }

    // Log error untuk debugging
    console.error(err);

    // Response yang lebih ramah untuk klien
    if (err.status) {
        res.status(err.status).json({
            status: false,
            message: err.message,
            errors: err.errors || null
        }).end();
    } else {
        res.status(500).json({
            status: false,
            message: 'Terjadi kesalahan pada server',
            errors: process.env.NODE_ENV === 'development' ? err.message : null
        }).end();
    }
};

export {
    errorMiddleware
};