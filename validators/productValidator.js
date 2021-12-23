import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string(),
});

export default productSchema;