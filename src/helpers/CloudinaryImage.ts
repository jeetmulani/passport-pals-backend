import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import { apiResponse } from "../common";
import multer from "multer";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary1: any = config.get("cloudinary");

cloudinary.v2.config({
    cloud_name: 'dddqgult9',
    api_key: '277748186659824',
    api_secret: 'HKPz84dwwbkwj0vyLlECgnxwZjw',
});
export const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: (req, file) => {
        // console.log("file ---------------- >>>", file);
        return {
            folder: req.params.folder_name,
            resource_type: file.mimetype.startsWith("video") ? "video" : "image",
            allowed_formats: file.mimetype.startsWith("video") ? ["mp4", "mov", "avi"] : file.mimetype.startsWith("image") ? ["jpg", "jpeg", "png", "gif", "bmp"] : null,
        };
    },
});

export const multerUpload: any = multer({ storage });

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const imageUrls = [];
        let files: any = req.files;
        // console.log("files ----------------- >>", files);

        // Iterate over the array of uploaded files
        for (let i = 0; i < files.length; i++) {
            const file: any = files[i];
            const imageUrl = file.path;
            imageUrls.push(imageUrl);
        }
        return res.status(200).json(await apiResponse(200, "Images Uploaded Successfully", imageUrls, {}));
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(await apiResponse(500, "Internal Server Error", {}, error));
    }
};


export const deleteImage = async (folderName: string, publicId: string) => {
    try {
        const result = (cloudinary as any).uploader.destroy(`${folderName}/${publicId}`);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};