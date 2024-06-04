import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().required(),
    
});

export const updateContactSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
        
    email: Joi.string()
        .email(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});