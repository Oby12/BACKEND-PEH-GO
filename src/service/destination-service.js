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

// Helper function untuk extract YouTube video ID
const extractYoutubeVideoId = (url) => {
    if (!url) return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([^&\n?#]+)$/ // Jika hanya ID yang dimasukkan
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
};

// Helper function untuk membuat embed URL
const createYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    const videoId = extractYoutubeVideoId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
};

// Update fungsi create destinasi
const create = async (request) => {
    const destination = validate(createDestinationValidation, request);

    await checkCategoryExist(destination.categoryId);

    // Process YouTube URL jika ada
    let youtubeUrl = null;
    if (destination.youtubeUrl) {
        youtubeUrl = destination.youtubeUrl.trim();
    }

    const newDestination = await prismaClient.destination.create({
        data: {
            name: destination.name,
            cover: destination.cover,
            address: destination.address,
            description: destination.description,
            urlLocation: destination.urlLocation,
            youtubeUrl: youtubeUrl, // Simpan YouTube URL
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
            youtubeUrl: true, // Include dalam response
            Category: {
                select: {
                    name: true
                }
            }
        }
    });

    // Handle pictures jika ada
    if (destination.picture && destination.picture.length > 0) {
        const pictureData = destination.picture.map(pic => ({
            picture: pic.data,
            destinationId: newDestination.id
        }));

        await prismaClient.picture.createMany({
            data: pictureData
        });
    }

    // Process YouTube URL untuk embed
    if (newDestination.youtubeUrl) {
        newDestination.youtubeEmbedUrl = createYoutubeEmbedUrl(newDestination.youtubeUrl);
    }

    newDestination.coverUrl = `/api/images/covers/${newDestination.id}`;

    return newDestination;
};

// Update fungsi get detail destinasi
const get = async (categoryId, destinationId) => {
    await checkCategoryExist(categoryId);

    destinationId = validate(getValidation, destinationId);

    const destination = await prismaClient.destination.findFirst({
        where: {
            id: destinationId
        },
        select: {
            id: true,
            name: true,
            address: true,
            description: true,
            urlLocation: true,
            youtubeUrl: true, // Include YouTube URL
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

    if (!destination) {
        throw new ResponseError(404, "Destinasi tidak ditemukan");
    }

    // Process pictures
    if (destination.picture && destination.picture.length > 0) {
        destination.picture = destination.picture.map(pic => ({
            id: pic.id,
            imageUrl: `/api/images/pictures/${pic.id}`
        }));
    }

    // Process YouTube URL untuk embed
    if (destination.youtubeUrl) {
        destination.youtubeEmbedUrl = createYoutubeEmbedUrl(destination.youtubeUrl);
    }

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
    const destination = validate(updateDestinationValidation, request);

    await checkCategoryExist(categoryId);

    const totalDestinationInDatabase = await prismaClient.destination.count({
        where: {
            categoryId: categoryId,
            id: destination.id
        }
    });

    if (totalDestinationInDatabase !== 1) {
        throw new ResponseError(404, "Destinasi tidak ditemukan");
    }

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

    // Update YouTube URL jika disediakan
    if (destination.youtubeUrl !== undefined) {
        updateData.youtubeUrl = destination.youtubeUrl ? destination.youtubeUrl.trim() : null;
    }

    // Update cover jika disediakan
    if (destination.cover) {
        updateData.cover = destination.cover;
    }

    try {
        // Validate destination
        const destination = validate(updateDestinationValidation, request);
        console.log("Data setelah validasi:", JSON.stringify(destination, null, 2));

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

        // Proses IDs gambar yang akan dihapus
        let removedPictureIds = [];
        if (destination.removedPictureIds) {
            try {
                // Penanganan untuk string dengan format "id1,id2,id3"
                if (typeof destination.removedPictureIds === 'string' && destination.removedPictureIds.includes(',')) {
                    removedPictureIds = destination.removedPictureIds
                        .split(',')
                        .map(id => parseInt(id.trim()))
                        .filter(id => !isNaN(id));
                    console.log("removedPictureIds parsed dari string CSV:", removedPictureIds);
                }
                // Coba parse jika berbentuk string JSON
                else if (typeof destination.removedPictureIds === 'string') {
                    try {
                        const parsed = JSON.parse(destination.removedPictureIds);
                        if (Array.isArray(parsed)) {
                            removedPictureIds = parsed;
                        } else {
                            removedPictureIds = [parseInt(destination.removedPictureIds)];
                        }
                        console.log("removedPictureIds parsed dari string JSON:", removedPictureIds);
                    } catch (jsonError) {
                        // Jika bukan JSON valid, coba parse sebagai ID tunggal
                        const singleId = parseInt(destination.removedPictureIds);
                        if (!isNaN(singleId)) {
                            removedPictureIds = [singleId];
                        }
                        console.log("removedPictureIds diproses sebagai ID tunggal:", removedPictureIds);
                    }
                }
                // Jika sudah berbentuk array, gunakan langsung
                else if (Array.isArray(destination.removedPictureIds)) {
                    removedPictureIds = destination.removedPictureIds;
                    console.log("removedPictureIds sudah berbentuk array:", removedPictureIds);
                }
                // Jika masih berbentuk objek dengan properti 'data'
                else if (destination.removedPictureIds.data) {
                    removedPictureIds = destination.removedPictureIds.data;
                    console.log("removedPictureIds diambil dari property data:", removedPictureIds);
                }
                else {
                    console.log("Format removedPictureIds tidak dikenali:", destination.removedPictureIds);
                }
            } catch (e) {
                console.error("Error parsing removedPictureIds:", e.message);
            }
        }

        console.log("Final removedPictureIds yang akan diproses:", removedPictureIds);

        // Mulai transaksi untuk memastikan semua operasi database berhasil atau gagal bersama
        const result = await prismaClient.$transaction(async (prisma) => {
            const updatedDestination = await prisma.destination.update({
                where: {
                    id: destination.id
                },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    categoryId: true,
                    address: true,
                    urlLocation: true,
                    youtubeUrl: true // Include dalam response
                }
            });

            // 2. Hapus gambar yang ditandai untuk dihapus jika ada
            if (removedPictureIds && removedPictureIds.length > 0) {
                console.log(`Menghapus gambar dengan ID: ${removedPictureIds.join(', ')}`);
                try {
                    const deleteResult = await prisma.picture.deleteMany({
                        where: {
                            id: {
                                in: removedPictureIds
                            },
                            destinationId: destination.id // Pastikan hanya menghapus gambar dari destinasi ini
                        }
                    });
                    console.log(`Gambar yang berhasil dihapus: ${deleteResult.count}`);
                } catch (deleteError) {
                    console.error("Error saat menghapus gambar:", deleteError);
                    // Throw error untuk gagalkan transaksi
                    throw deleteError;
                }
            }

            // 3. Tambahkan gambar baru jika ada
            // Pilih data gambar dari field yang tersedia (pictures atau picture)
            const newPictures = destination.pictures || destination.picture || [];

            if (newPictures.length > 0) {
                // Hitung gambar yang ada saat ini (setelah menghapus yang ditandai)
                const currentPictureCount = await prisma.picture.count({
                    where: {
                        destinationId: destination.id
                    }
                });

                console.log(`Jumlah gambar saat ini: ${currentPictureCount}, menambahkan ${newPictures.length} gambar baru`);

                // Pastikan total gambar tidak melebihi batas 3
                const availableSlots = 3 - currentPictureCount;

                if (availableSlots <= 0) {
                    throw new ResponseError(400, "Maksimal 3 gambar per destinasi. Hapus beberapa gambar terlebih dahulu.");
                }

                // Pilih hanya jumlah gambar yang cukup untuk slot yang tersedia
                const picturesToAdd = newPictures.slice(0, availableSlots);

                // Konversi dari format controller menjadi format untuk database
                const pictureData = picturesToAdd.map(pic => ({
                    picture: pic.data,
                    destinationId: destination.id
                }));

                // Simpan gambar baru
                if (pictureData.length > 0) {
                    await prisma.picture.createMany({
                        data: pictureData
                    });
                }
            }

            return updatedDestination;
        });

        // Process YouTube URL untuk embed
        if (result.youtubeUrl) {
            result.youtubeEmbedUrl = createYoutubeEmbedUrl(result.youtubeUrl);
        }

        // Tambahkan coverUrl ke hasil untuk konsistensi dengan endpoint list
        result.coverUrl = `/api/images/covers/${result.id}`;

        return result;
    } catch (error) {
        console.error("Error saat update destinasi:", error);
        throw error; // Re-throw error untuk ditangani oleh error middleware
    }
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

    console.log(`Menghapus semua catatan view untuk destinasi ${destinationId}`);
    await prismaClient.destinationView.deleteMany({
        where: {
            destinationId: destinationId
        }
    });

    // Hapus semua gambar terkait terlebih dahulu
    console.log(`Menghapus semua gambar untuk destinasi ${destinationId}`);
    await prismaClient.picture.deleteMany({
        where: {
            destinationId: destinationId
        }
    });

    //hapus dari favorite
    console.log(`Menghapus semua favorite untuk destinasi ${destinationId}`);
    await prismaClient.favoriteDestination.deleteMany({
        where: {
            destinationId: destinationId
        }
    });

    // Hapus destinasi
    console.log(`Menghapus destinasi ${destinationId}`);
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