import Joi from "joi";

const registerUserValidation = Joi.object({
    //role: Joi.string().valid("WISATAWAN", "ADMIN").default("WISATAWAN"),
    username : Joi.string().max(150).required(),
    name : Joi.string().max(150).required(),
    email : Joi.string().email().max(100).required(),
    password : Joi.string().max(150).required()
});

const loginUserValidation = Joi.object({
    email : Joi.string().email().required().max(150),
    password : Joi.string().max(150).required()
});

export {
    registerUserValidation,
    loginUserValidation
}