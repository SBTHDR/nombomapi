import { Product } from "../models"
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import fs from 'fs';
import productSchema from "../validators/productValidator";


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

        multerMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            const filePath = req.file.path;
    
            const { error } = productSchema.validate(req.body);

            if (error) {
                // If validation failed after file upload
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {                        
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                // Validation Error
                return next(error);
            }

            const { name, description, price, size } = req.body;

            let document;
            try {
                document = await Product.create({
                    name,
                    description,
                    price,
                    size,
                    image: filePath
                });

            } catch (err) {
                return next(err);
            }

            res.status(201).json(document);
        });
    },

    async update(req, res, next) {
        multerMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }

            let filePath; 
            if (req.file) {                
                filePath = req.file.path;
            }
    
            const { error } = productSchema.validate(req.body);

            if (error) {
                // If validation failed after file upload
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {                        
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                }
                // Validation Error
                return next(error);
            }

            const { name, description, price, size } = req.body;

            let document;
            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    description,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true });

            } catch (err) {
                return next(err);
            }

            res.status(201).json(document);
        });
    },

    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({ _id: req.params.id });

        if(!document) {
            return next(new Error('Not Found!')); 
        }

        // delete img from disk
        const imagePath = document._doc.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            res.json(document);
        });
    },

    async index(req, res, next) {
        let documents;

        try {
            documents = await Product.find().select('-updatedAt -__v').sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(documents);
    },

    async show(req, res, next) {
        let document;

        try {
            document = await Product.findOne({ _id: req.params.id }).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async getProducts(req, res, next) {
        let documents;
        try {
            documents = await Product.find({
                _id: { $in: req.body.ids },
            }).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    }
}

export default productController;