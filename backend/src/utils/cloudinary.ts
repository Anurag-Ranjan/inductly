import cloudinary from '../configurations/cloudinary.config';
import { ApiError } from './ApiError';

const uploadImage = async (file: Express.Multer.File, filePath: string) => {
    if (!file.mimetype.startsWith('image/')) {
        throw new ApiError(400, 'Only image files are allowed');
    }

    const result = await cloudinary.uploader.upload(filePath);

    return result;
};

const removeFileFromCloudinary = async (public_id: string) => {
    const result = await cloudinary.uploader.destroy(public_id);
};

export { uploadImage, removeFileFromCloudinary };
