// src/controller/stats-controller.js
import statsService from "../service/stats-service.js";

// Fungsi pembantu untuk mengkonversi BigInt ke Number
const convertBigIntToNumber = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'bigint') {
        return Number(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToNumber(item));
    }

    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = convertBigIntToNumber(obj[key]);
        }
        return newObj;
    }

    return obj;
};

// Mendapatkan semua statistik untuk admin
const getStats = async (req, res, next) => {
    try {
        const totalUsers = await statsService.getTotalRegisteredUsers();
        const destinationViews = await statsService.getDestinationViews();
        const monthlyLogins = await statsService.getMonthlyLoginCounts();

        // Mengkonversi nilai BigInt ke Number sebelum JSON.stringify
        const convertedData = {
            totalRegisteredUsers: Number(totalUsers),
            destinationViews: convertBigIntToNumber(destinationViews) || [],
            monthlyLogins: convertBigIntToNumber(monthlyLogins) || []
        };

        res.status(200).json({
            data: convertedData
        });
    } catch (e) {
        console.error("Error dalam getStats:", e);
        res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat mengambil statistik: " + e.message,
            errors: null
        });
    }
};

// Menambahkan view destinasi
const addDestinationView = async (req, res, next) => {
    try {
        const destinationId = parseInt(req.params.destinationId);
        const username = req.user.username;

        await statsService.addDestinationView(destinationId, username);
        res.status(200).json({
            data: "View recorded"
        });
    } catch (e) {
        console.error("Error dalam addDestinationView:", e);
        res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat mencatat view: " + e.message,
            errors: null
        });
    }
};


export default {
    getStats,
    addDestinationView
};