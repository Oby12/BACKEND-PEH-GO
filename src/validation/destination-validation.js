// destination-validation.js
import Joi from "joi";

// Fungsi helper untuk validasi YouTube URL
const youtubeUrlValidation = Joi.string()
    .max(200)
    .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&[\w=]*)?$/)
    .optional()
    .allow(null, '')
    .messages({
        'string.pattern.base': 'Format URL YouTube tidak valid. Gunakan format: https://www.youtube.com/watch?v=VIDEO_ID atau https://youtu.be/VIDEO_ID'
    });

const createDestinationValidation = Joi.object({
    cover: Joi.any().required(),
    name: Joi.string().max(150).required(),
    address: Joi.string().max(150).required(),
    description: Joi.string().required(),
    urlLocation: Joi.string().max(200).required(),
    youtubeUrl: youtubeUrlValidation, // Field baru
    categoryId: Joi.number().positive().required(),
    picture: Joi.array().items(Joi.any()).optional()
});

const getValidation = Joi.number().positive().required();

const updateDestinationValidation = Joi.object({
    id: Joi.number().positive().required(),
    cover: Joi.any().optional(),
    name: Joi.string().max(150).optional(),
    address: Joi.string().max(150).optional(),
    description: Joi.string().optional(),
    urlLocation: Joi.string().max(200).optional(),
    youtubeUrl: youtubeUrlValidation, // Field baru
    categoryId: Joi.number().positive().required(),
    picture: Joi.array().items(Joi.any()).optional(),
    pictures: Joi.array().items(Joi.any()).optional(),
    removedPictureIds: Joi.any().optional()
});

export {
    createDestinationValidation,
    updateDestinationValidation,
    getValidation
};