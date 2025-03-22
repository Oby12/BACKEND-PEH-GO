import { validate } from "../validation/validation.js";
import {
    createDestinationValidation, getValidation,
    updateDestinationValidation
} from "../validation/destination-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

//CEK KATEGORI ADA ATAU TIDAK
const checkCategoryExist = async (categoryId) => {

    categoryId = validate(getValidation, categoryId)

    const totalCategoryInDatabase = await prismaClient.category.count({
        where: {
            id: categoryId
        }
    });

    console.info(`totalCategoryInDatabase: ${totalCategoryInDatabase}`);

    if (totalCategoryInDatabase !== 1) {
        throw new ResponseError(404, "Category not found");
    }

    return totalCategoryInDatabase;
}

//create destinasi [ADMIN]
const create  = async (request) => {

    //validate destination
    const destination = validate(createDestinationValidation, request);

    console.info(`destination: ${JSON.stringify(destination)}`);
    //periksa apakah kategori ada
    await checkCategoryExist(destination.categoryId);

    //buat destinasi baru
    const newDestination = await prismaClient.destination.create({
        data : {
            name : destination.name,
            cover : destination.cover,
            address : destination.address,
            description : destination.description,
            urlLocation : destination.urlLocation,
            Category : {
                connect : {
                    id : destination.categoryId
                }
            }
        },
        select : {
            id : true,
            name : true,
            address : true,
            description : true,
            urlLocation : true,
            Category : {
                select : {
                    name : true,
                    //picture : true
                }
            }
        }
    });

    // Jika ada gambar tambahan
    if (destination.picture && destination.picture.length > 0) {
        // Buat array data untuk picture
        const pictureData = destination.picture.map(pic => ({
            picture: pic.data, // Seharusnya berisi data binary/buffer
            destinationId: newDestination.id
        }));

        // Simpan picture
        await prismaClient.picture.createMany({
            data: pictureData
        });
    }


    return newDestination;
}

//detail destinasi [ANY]
const get = async (categoryId, destinationId) => {

    //periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    destinationId = validate(getValidation, destinationId)

    //ambil destinasi berdasarkan id
    const destination = await prismaClient.destination.findFirst({
        where : {
            categoryId : categoryId,
            id : destinationId
        },
        select : {
            id: true,
            //cover: true,
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
                    id: true,
                    //picture: true
                }
            }
        }
    });

    //check destinasi
    if(!destination) {
        throw new ResponseError(404, "Destination not found");
    }

    // Ubah format respons untuk gambar
    if (destination.picture && destination.picture.length > 0) {
        destination.picture = destination.picture.map(pic => ({
            id: pic.id,
            imageUrl: `/api/images/pictures/${pic.id}` // URL untuk mengakses gambar
        }));
    }

    // Tambahkan URL untuk cover jika ada
    destination.coverUrl = `/api/images/covers/${destination.id}`;


    return destination;
}

//list destinasi [ANY]
const list = async (categoryId) => {

    categoryId = validate(getValidation, categoryId)

    //periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    //ambil semua destinasi
    const destination = await prismaClient.destination.findMany({
        where : {
            categoryId : categoryId
        },
        select : {
            id : true,
            name : true,
            address : true,
            description : true,
            urlLocation : true,
        }
    });

    // Tambahkan URL untuk cover ke setiap objek destinasi
    const destinationsWithCover = destination.map(destination => {
        return {
            ...destination,
            coverUrl: `/api/images/covers/${destination.id}`
        };
    });

    return destinationsWithCover;
};

// //update destinasi [ADMIN]
// const update = async (categoryId, request) => {
//
//     //validate destination
//     const destination = validate(updateDestinationValidation, request);
//
//     console.info(`destination: ${JSON.stringify(destination)}`);
//     //periksa apakah kategori ada
//     await checkCategoryExist(categoryId);
//
//     //check destinasi
//     const totalDestinationInDatabase = await prismaClient.destination.count({
//         where : {
//             categoryId : categoryId,
//             id : destination.id
//         }
//     });
//
//     if (totalDestinationInDatabase !== 1) {
//         throw new ResponseError(404, "Destination not found");
//     };
//
//     return prismaClient.destination.update({
//         where: {
//             id : destination.id
//         },
//         data: {
//             name: destination.name,
//             cover: destination.cover,
//             address: destination.address,
//             description: destination.description,
//             urlLocation: destination.urlLocation,
//             Category: {
//                 connect: {
//                     id: categoryId
//                 }
//             }
//         },
//         select: {
//             id: true,
//             name: true,
//             description: true,
//             categoryId: true
//         }
//     });
// };

//update destinasi [ADMIN]
const update = async (categoryId, request) => {

    //validate destination
    const destination = validate(updateDestinationValidation, request);

    console.info(`destination: ${JSON.stringify(destination)}`);
    //periksa apakah kategori ada
    await checkCategoryExist(categoryId);

    //check destinasi
    const totalDestinationInDatabase = await prismaClient.destination.count({
        where : {
            categoryId : categoryId,
            id : destination.id
        }
    });

    if (totalDestinationInDatabase !== 1) {
        throw new ResponseError(404, "Destination not found");
    };

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
            id : destination.id
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

const deleteDestination = async (destinationId) => {
    await prismaClient.destination.delete({
        where: { id: destinationId }
    });
};


export default {
    create,
    get,
    list,
    update,
    deleteDestination
};