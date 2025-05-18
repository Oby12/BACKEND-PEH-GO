// src/service/stats-service.js
import { prismaClient } from "../application/database.js";

// Mendapatkan total user yang terdaftar
const getTotalRegisteredUsers = async () => {
    try {
        // Konversi langsung hasilnya ke Number
        const result = await prismaClient.user.count();
        return result;
    } catch (error) {
        console.error("Error getting user count:", error);
        return 0; // Nilai default jika terjadi error
    }
};

// Menambahkan view destinasi
const addDestinationView = async (destinationId, username) => {
    return await prismaClient.destinationView.create({
        data: {
            destinationId: destinationId,
            userId: username
        }
    });
};

// Mendapatkan total view per destinasi
const getDestinationViews = async () => {
    try {
        // Group by destinationId dan hitung jumlah views
        // Termasuk alamat dan URL cover
        const viewsByDestination = await prismaClient.$queryRaw`
            SELECT
                d.id,
                d.name,
                d.address,
                CONCAT('/api/images/covers/', d.id) as coverUrl,
                CAST(COUNT(dv.id) AS CHAR) as viewCount,
                c.name as categoryName
            FROM destinations d
                     LEFT JOIN destination_views dv ON d.id = dv.destinationId
                     LEFT JOIN categories c ON d.categoryId = c.id
            GROUP BY d.id, d.name, d.address, c.name
            ORDER BY COUNT(dv.id) DESC
                LIMIT 10
        `;
        return viewsByDestination;
    } catch (error) {
        console.error("Error getting destination views:", error);
        return []; // Return array kosong jika gagal
    }
};

// Mencatat login user
const recordUserLogin = async (username) => {
    return await prismaClient.userLogin.create({
        data: {
            userId: username
        }
    });
};

// Mendapatkan jumlah login per bulan
const getMonthlyLoginCounts = async () => {
    try {
        // Group by bulan dan hitung jumlah login
        const loginsByMonth = await prismaClient.$queryRaw`
            SELECT
                YEAR(loginAt) as year,
                MONTH(loginAt) as month,
                CAST(COUNT(id) AS CHAR) as count
            FROM user_logins
            GROUP BY YEAR(loginAt), MONTH(loginAt)
            ORDER BY year DESC, month DESC
                LIMIT 12
        `;
        return loginsByMonth;
    } catch (error) {
        console.error("Error getting monthly logins:", error);
        return []; // Return array kosong jika gagal
    }
};

export default {
    getTotalRegisteredUsers,
    addDestinationView,
    getDestinationViews,
    recordUserLogin,
    getMonthlyLoginCounts
};