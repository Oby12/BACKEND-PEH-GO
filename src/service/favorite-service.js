// src/service/favorite-service.js
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

// Menambahkan atau menghapus favorit (toggle)
const toggleFavorite = async (destinationId, username) => {
    try {
        // Cek apakah destinasi ada
        const destination = await prismaClient.destination.findUnique({
            where: { id: destinationId }
        });

        if (!destination) {
            throw new ResponseError(404, "Destinasi tidak ditemukan");
        }

        // Cek apakah sudah difavoritkan
        const existingFavorite = await prismaClient.favoriteDestination.findFirst({
            where: {
                destinationId: destinationId,
                userId: username
            }
        });

        // Jika sudah ada, hapus (unlike)
        if (existingFavorite) {
            await prismaClient.favoriteDestination.delete({
                where: { id: existingFavorite.id }
            });
            return { isFavorite: false };
        }

        // Jika belum ada, tambahkan (like)
        await prismaClient.favoriteDestination.create({
            data: {
                destinationId: destinationId,
                userId: username
            }
        });
        return { isFavorite: true };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
};

// Cek apakah destinasi sudah difavoritkan
const checkIsFavorite = async (destinationId, username) => {
    try {
        const favorite = await prismaClient.favoriteDestination.findFirst({
            where: {
                destinationId: destinationId,
                userId: username
            }
        });

        return { isFavorite: !!favorite };
    } catch (error) {
        console.error("Error checking favorite:", error);
        throw error;
    }
};

// Mendapatkan daftar favorit pengguna
const getUserFavorites = async (username) => {
    try {
        const favorites = await prismaClient.favoriteDestination.findMany({
            where: { userId: username },
            include: {
                Destination: {
                    include: {
                        Category: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return favorites.map(favorite => ({
            id: favorite.Destination.id,
            name: favorite.Destination.name,
            address: favorite.Destination.address,
            description: favorite.Destination.description,
            urlLocation: favorite.Destination.urlLocation,
            coverUrl: `/api/images/covers/${favorite.Destination.id}`,
            categoryName: favorite.Destination.Category.name
        }));
    } catch (error) {
        console.error("Error getting user favorites:", error);
        throw error;
    }
};

export default {
    toggleFavorite,
    checkIsFavorite,
    getUserFavorites
};