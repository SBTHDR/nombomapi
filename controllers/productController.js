import { Product } from "../models"
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const multerMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image')

const productController = {
    async store(req, res, next) {
        multerMultipartData(req, res, (err) = {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
        });
    }
}

export default productController;