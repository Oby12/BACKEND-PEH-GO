// src/service/destination-service.js
import { validate } from "../validation/validation.js";
import {
    createDestinationValidation, getValidation,
    updateDestinationValidation
} from "../validation/destination-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

// CEK KATEGORI ADA ATAU TIDAK
const checkCategoryExist = async (categoryId) => {
    categoryId = validate(getValidation, categoryId);

    const totalCategoryInDatabase = await prismaClient.category.count({
        where: {
            id: categoryId
        }
    });

    if (totalCategoryInDatabase !== 1) {
        throw new ResponseError(404, "Kategori tidak ditemukan");
    }

    return totalCategoryInDatabase;
};

// Mendapatkan gambar cover
const getCoverImage = async (destinationId) => {
    const destination = await prismaClient.destination.findUnique({
        where: { id: destinationId },
        select: { cover: true }
    });

    if (!destination || !destination.cover) {
        throw new ResponseError(404, "Gambar tidak ditemukan");
    }

    return destination;
};

// Mendapatkan gambar picture
const getPictureImage = async (pictureId) => {
    const picture = await prismaClient.picture.findUnique({
        where: { id: pictureId },
        select: { picture: true }
    });

    if (!picture || !picture.picture) {
        throw new ResponseError(404, "Gambar tidak ditemukan");
    }

    return picture;
};

// Create destinasi [ADMIN]
const create = async (request) => {
    // Validate destination
    const destination = validate(createDestinationValidation, request);

    // Periksa apakah kategori ada
    await checkCategoryExist(destination.categoryId);

    // Buat destinasi baru
    const newDestination = await prismaClient.destination.create({
        data: {
            name: destination.name,
            cover: destination.cover,
            address: destination.address,
            description: destination.description,
            urlLocation: destination.urlLocation,
            Category: {
                connect: {
                    id: destination.categoryId
                }
            }
        },
        select: {
            id: true,
            name: true,
            address: true,
            description: true,
            urlLocation: true,
            Category: {
                select: {
                    name: true
                }
            }
        }
    });

    // Jika ada gambar tambahan
    if (destination.picture && destination.picture.length > 0) {
        // Buat array data untuk picture
        const pictureData = destination.picture.map(pic => ({
            picture: pic.data,
            destinationId: newDestination.id
        }));

        // Simpan picture
        await prismaClient.picture.createMany({
            data: pictureData
        });
    }

    // Tambahkan URL untuk akses gambar
    newDestination.coverUrl = `/api/images/covers/${newDestination.id}`;

    return newDestination;
};

// Detail destinasi [ANY]
const get = async (categoryId, destinationId) => {
    // Periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    destinationId = validate(getValidation, destinationId);

    // Ambil destinasi berdasarkan id
    const destination = await prismaClient.destination.findFirst({
        where: {
            categoryId: categoryId,
            id: destinationId
        },
        select: {
            id: true,
            name: true,
            address: true,
            description: true,
            urlLocation: true,
            Category: {
                select: {
                    name: true
                }
            },
            picture: {
                select: {
                    id: true
                }
            }
        }
    });

    // Check destinasi
    if (!destination) {
        throw new ResponseError(404, "Destinasi tidak ditemukan");
    }

    // Ubah format respons untuk gambar
    if (destination.picture && destination.picture.length > 0) {
        destination.picture = destination.picture.map(pic => ({
            id: pic.id,
            imageUrl: `/api/images/pictures/${pic.id}`
        }));
    }

    // Tambahkan URL untuk cover
    destination.coverUrl = `/api/images/covers/${destination.id}`;

    return destination;
};

// List destinasi [ANY]
const list = async (categoryId, page = 1, limit = 10) => {
    categoryId = validate(getValidation, categoryId);

    // Periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    // Hitung total destinasi untuk pagination
    const totalCount = await prismaClient.destination.count({
        where: {
            categoryId: categoryId
        }
    });

    // Hitung skip untuk pagination
    const skip = (page - 1) * limit;

    // Ambil destinasi dengan pagination
    const destinations = await prismaClient.destination.findMany({
        where: {
            categoryId: categoryId
        },
        select: {
            id: true,
            name: true,
            address: true,
            description: true,
            urlLocation: true,
        },
        skip: skip,
        take: limit
    });

    // Tambahkan URL untuk cover ke setiap objek destinasi
    const destinationsWithCover = destinations.map(destination => {
        return {
            ...destination,
            coverUrl: `/api/images/covers/${destination.id}`
        };
    });

    // Buat informasi pagination
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
    };

    return {
        data: destinationsWithCover,
        pagination: pagination
    };
};

// Update destinasi [ADMIN]
const update = async (categoryId, request) => {
    // Validate destination
    const destination = validate(updateDestinationValidation, request);

    // Periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    // Check destinasi
    const totalDestinationInDatabase = await prismaClient.destination.count({
        where: {
            categoryId: categoryId,
            id: destination.id
        }
    });

    if (totalDestinationInDatabase !== 1) {
        throw new ResponseError(404, "Destinasi tidak ditemukan");
    }

    // Siapkan data untuk update
    const updateData = {
        name: destination.name,
        address: destination.address,
        description: destination.description,
        urlLocation: destination.urlLocation,
        Category: {
            connect: {
                id: categoryId
            }
        }
    };

    // Hanya tambahkan cover jika disediakan dalam request
    if (destination.cover) {
        updateData.cover = destination.cover;
    }

    const result = await prismaClient.destination.update({
        where: {
            id: destination.id
        },
        data: updateData,
        select: {
            id: true,
            name: true,
            description: true,
            categoryId: true
        }
    });

    // Tambahkan coverUrl ke hasil untuk konsistensi dengan endpoint list
    result.coverUrl = `/api/images/covers/${result.id}`;

    return result;
};

const remove = async (categoryId, destinationId) => {
    // Periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    destinationId = validate(getValidation, destinationId);

    const totalDestinationInDatabase = await prismaClient.destination.count({
        where: {
            categoryId: categoryId,
            id: destinationId
        }
    });

    if (totalDestinationInDatabase !== 1) {
        throw new ResponseError(404, "Destinasi tidak ditemukan");
    }

    // Hapus semua gambar terkait terlebih dahulu
    await prismaClient.picture.deleteMany({
        where: {
            destinationId: destinationId
        }
    });

    // Hapus destinasi
    return prismaClient.destination.delete({
        where: {
            id: destinationId
        }
    });
};

export default {
    create,
    get,
    list,
    update,
    remove,
    getCoverImage,
    getPictureImage
};