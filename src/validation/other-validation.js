import Joi from "joi";

const createOtherValidation = Joi.object({
    cover: Joi.any().required(),
    name: Joi.string().max(150).required(),
    category: Joi.string().max(100).required(),
    story: Joi.string().required()
});

const updateOtherValidation = Joi.object({
    id: Joi.number().positive().required(),
    cover: Joi.any().optional(),
    name: Joi.string().max(150).optional(),
    category: Joi.string().max(100).optional(),
    story: Joi.string().optional()
});

const getOtherValidation = Joi.number().positive().required();

export {
    createOtherValidation,
    updateOtherValidation,
    getOtherValidation
};