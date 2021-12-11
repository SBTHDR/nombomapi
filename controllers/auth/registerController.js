import Joi from 'joi';

const registerController = {
    register(req, res, next) {

        // validation
        const registerSchema = Joi.object({
            "name": Joi.string().min(3).max(50).required(),
            "email": Joi.string().email().required(),
            "password": Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
            "confirm_password": Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        res.json({ msg: "Express Register" });
    }
}

export default registerController;