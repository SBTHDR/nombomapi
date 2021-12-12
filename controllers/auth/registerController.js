import Joi from 'joi';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User } from '../../models';

const registerController = {
    async register(req, res, next) {

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

        // if user already exist
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already exist'));
            }
        } catch(err) {
            return next(err);
        }

        res.json({ msg: "Express Register" });
    }
}

export default registerController;