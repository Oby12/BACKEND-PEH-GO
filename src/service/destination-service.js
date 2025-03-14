import { validate } from "../validation/validation.js";
import {
    createDestinationValidation, getCategoryValidation,
    updateDestinationValidation
} from "../validation/destination-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {request} from "express";

const checkCategoryExist = async (user, categoryId) => {

    categoryId = validate(getCategoryValidation, categoryId)

    const totalCategoryInDatabase = await prismaClient.category.count({
        where: {
            username: user.username,
            id: categoryId
        }
    });

    if (totalCategoryInDatabase !== 1) {
        throw new ResponseError(404, "Category not found");
    }

    return totalCategoryInDatabase;
}

// const create = async (user, categoryId, request) => {
//
//     categoryId = await checkCategoryExist(user,categoryId);
//
//     //validate destination
//     const destination = validate(createDestinationValidation, request);
//     destination.categoryId = categoryId;
//
//     return prismaClient.destination.create({
//         data : destination,
//         select : {
//             id : true,
//             name : true,
//             address : true,
//             description : true,
//             urlLocation : true,
//         }
//     });
// }

const createDestination = async (request) => {
    const destination = validate(createDestinationValidation, request);
    return prismaClient.destination.create({
        data: destination,
        select: {
            id: true,
            name: true,
            description: true,
            categoryId: true
        }
    });
};

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
    createDestination,
    updateDestination,
    deleteDestination,
    getDestinations,
    getDestinationById
};