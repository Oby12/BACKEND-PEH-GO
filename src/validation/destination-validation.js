import Joi from "joi";

const createDestinationValidation = Joi.object({
    cover: Joi.binary().required(), // Validasi untuk tipe `Bytes`
    name: Joi.string().max(150).required(),
    address: Joi.string().max(150).required(),
    description: Joi.string().required(),
    urlLocation: Joi.string().uri().max(200).required(),
    categoryId: Joi.number().integer().positive().required(),
    picture: Joi.array().items(Joi.object({
        id: Joi.number().integer().positive().optional(),
        url: Joi.string().uri().required(),
    })).optional(),
});

const updateDestinationValidation = Joi.object({
    id : Joi.number().positive().required(),
    cover: Joi.binary().required(), // Validasi untuk tipe `Bytes`
    name: Joi.string().max(150).required(),
    address: Joi.string().max(150).required(),
    description: Joi.string().required(),
    urlLocation: Joi.string().uri().max(200).required(),
    categoryId: Joi.number().integer().positive().required(),
    picture: Joi.array().items(Joi.object({
        id: Joi.number().integer().positive().optional(),
        url: Joi.string().uri().required(),
    })).optional(),
});

const getCategoryValidation = Joi.number().positive().required();

export {
    createDestinationValidation,
    updateDestinationValidation,
    getCategoryValidation
};