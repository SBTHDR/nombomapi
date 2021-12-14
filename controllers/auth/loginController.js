import Joi from 'joi';
import { User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService';

const loginController = {
    async login(req, res, next) {
        // login validation
        const loginSchema = Joi.object({
            "email": Joi.string().email().required(),
            "password": Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.invalidCredentials());
            }

            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.invalidCredentials());
            }

            const access_token = JwtService.sign({ _id: user._id, role: user.role });

            res.json({ access_token });
        } catch (err) {
            return next(err);
        }
    }
}

export default loginController;