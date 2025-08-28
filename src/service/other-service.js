import { validate } from "../validation/validation.js";
import {
    createOtherValidation,
    updateOtherValidation,
    getOtherValidation
} from "../validation/other-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const create = async (request) => {
    const other = validate(createOtherValidation, request);

    // Check if name already exists
    const existingOther = await prismaClient.other.findFirst({
        where: { name: other.name }
    });

    if (existingOther) {
        throw new ResponseError(400, "Nama Other sudah ada");
    }

    return prismaClient.other.create({
        data: other
    });
};

const list = async () => {
    return prismaClient.other.findMany({
        select: {
            id: true,
            name: true,
            category: true,
            story: true,
            cover: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const get = async (otherId) => {
    otherId = validate(getOtherValidation, otherId);

    const other = await prismaClient.other.findUnique({
        where: { id: otherId }
    });

    if (!other) {
        throw new ResponseError(404, "Other tidak ditemukan");
    }

    return other;
};

const update = async (request) => {
    const other = validate(updateOtherValidation, request);

    const existingOther = await prismaClient.other.findUnique({
        where: { id: other.id }
    });

    if (!existingOther) {
        throw new ResponseError(404, "Other tidak ditemukan");
    }

    // Check name uniqueness if name is being updated
    if (other.name && other.name !== existingOther.name) {
        const nameExists = await prismaClient.other.findFirst({
            where: {
                name: other.name,
                id: { not: other.id }
            }
        });

        if (nameExists) {
            throw new ResponseError(400, "Nama Other sudah ada");
        }
    }

    return prismaClient.other.update({
        where: { id: other.id },
        data: other
    });
};

const remove = async (otherId) => {
    otherId = validate(getOtherValidation, otherId);

    const existingOther = await prismaClient.other.findUnique({
        where: { id: otherId }
    });

    if (!existingOther) {
        throw new ResponseError(404, "Other tidak ditemukan");
    }

    return prismaClient.other.delete({
        where: { id: otherId }
    });
};

const getCoverImage = async (otherId) => {
    const other = await prismaClient.other.findUnique({
        where: { id: otherId },
        select: { cover: true }
    });

    if (!other || !other.cover) {
        throw new ResponseError(404, "Gambar tidak ditemukan");
    }

    return other;
};

export default {
    create,
    list,
    get,
    update,
    remove,
    getCoverImage
};