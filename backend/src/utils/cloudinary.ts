import cloudinary from '../configurations/cloudinary.config';
import { ApiError } from './ApiError';
import path from 'path';

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

const uploadFormFile = async (
    file: Express.Multer.File,
    filePath: string,
    allowedTypes: string[],
    maxSizeMB: number
) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (!allowedTypes.includes(ext)) {
        throw new ApiError(
            400,
            `File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
        );
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        throw new ApiError(
            400,
            `File size exceeds the maximum allowed size of ${maxSizeMB} MB`
        );
    }

    const result = await cloudinary.uploader.upload(filePath);
    return result;
};

export { uploadImage, removeFileFromCloudinary, uploadFormFile };
