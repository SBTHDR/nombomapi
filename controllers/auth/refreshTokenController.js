import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshTokenController = {
    async refresh(req, res, next) {
        // Token validation
        const refreshSchema = Joi.object({
            "refresh_token": Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // Check for token in database
        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });

            if (!refreshToken) {
                return next(CustomErrorHandler.unauthorized('Invalid Refresh Token!'));
            }
            
            let userId;
            try {
                const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch (err) {
                return next(CustomErrorHandler.unauthorized('Invalid Refresh Token!'));
            }

            // check for user
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unauthorized('User not found!'));
            }

            // JWD Token
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token =  JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // Whitelisting Token
            await RefreshToken.create({ token: refresh_token });

            res.json({ access_token, refresh_token });

        } catch (err) {
            return next(new Error('Something went wrong! try again after few seconds. ' + err.message));
        }
    }
}

export default refreshTokenController;