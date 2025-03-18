import { validate } from "../validation/validation.js";
import {
    createDestinationValidation, getCategoryValidation,
    updateDestinationValidation
} from "../validation/destination-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const checkCategoryExist = async (categoryId) => {

    categoryId = validate(getCategoryValidation, categoryId)

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

const create  = async (user, request) => {

    //categoryId = await checkCategoryExist(categoryId);

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
                    name : true
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

// const createDestination = async (request) => {
//     const destination = validate(createDestinationValidation, request);
//     return prismaClient.destination.create({
//         data: destination,
//         select: {
//             id: true,
//             name: true,
//             description: true,
//             categoryId: true
//         }
//     });
// };

const updateDestination = async (destinationId, request) => {
    const destination = validate(updateDestinationValidation, request);
    return prismaClient.destination.update({
        where: { id: destinationId },
        data: destination,
        select: {
            id: true,
            name: true,
            description: true,
            categoryId: true
        }
    });
};

const deleteDestination = async (destinationId) => {
    await prismaClient.destination.delete({
        where: { id: destinationId }
    });
};

const getDestinations = async () => {
    return prismaClient.destination.findMany();
};

const getDestinationById = async (destinationId) => {
    const destination = await prismaClient.destination.findUnique({
        where: { id: destinationId }
    });

    if (!destination) {
        throw new ResponseError(404, 'Destination not found');
    }

    return destination;
};

export default {
    create,
    //createDestination,
    updateDestination,
    deleteDestination,
    getDestinations,
    getDestinationById
};