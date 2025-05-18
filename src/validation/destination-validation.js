import Joi from "joi";

const createDestinationValidation = Joi.object({
    cover: Joi.any().required(), // Untuk file upload, validasi detail dilakukan di controller
    name: Joi.string().max(150).required(),
    address: Joi.string().max(150).required(),
    description: Joi.string().required(),
    urlLocation: Joi.string().max(200).required(),
    categoryId: Joi.number().positive().required(),
    picture: Joi.array().items(Joi.any()).optional() // Untuk file upload multiple
});


const getValidation = Joi.number().positive().required();

const updateDestinationValidation = Joi.object({
    id : Joi.number().positive().required(),
    cover: Joi.any().optional(), // Untuk file upload, validasi detail dilakukan di controller
    name: Joi.string().max(150).optional(),
    address: Joi.string().max(150).optional(),
    description: Joi.string().optional(),
    urlLocation: Joi.string().max(200).optional(),
    categoryId: Joi.number().positive().required(),
    picture: Joi.array().items(Joi.any()).optional(), // Untuk file upload multiple
    pictures: Joi.array().items(Joi.any()).optional(), // Field name alternatif untuk kompatibilitas
    removedPictureIds: Joi.any().optional() // Untuk menghapus gambar - menerima format apapun
});

export {
    createDestinationValidation,
    updateDestinationValidation,
    getValidation
};