import joi from 'joi';

const signUpSchema = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

const singInSchema = joi.object({
    password: joi.string().min(1).required(),
    email: joi.string().email().min(4).required()
});

export { signUpSchema, singInSchema };