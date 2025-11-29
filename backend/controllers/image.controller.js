import { Image } from "../models/image.model.js";
import cloudinary from "../config/cloudinary.js";

// upload image & description
export const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        const { year, location, description } = req.body;

        if (!file) {
            return res.status(400).json({
                message: "Image file is required",
                success: false,
            });
        }

        if (!year || !location || !description) {
            return res.status(400).json({
                message:
                    "All fields (year, location, description) are required",
                success: false,
            });
        }

        // upload image to cloudinary

        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "gallery",

                        // Important: generate optimized version
                        eager: [
                            {
                                quality: "auto",
                                fetch_format: "auto",
                                width: 1600,
                                crop: "limit",
                            },
                        ],
                        eager_async: false,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
        };

        const cloudResult = await uploadToCloudinary();

        // optimized version URL
        const optimizedUrl = cloudResult.eager[0].secure_url;

        const savedImage = await Image.create({
            url: optimizedUrl,
            year,
            location,
            description,
        });

        return res.status(200).json({
            message: "Image uploaded and saved successfully",
            image: savedImage,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// drop down filters
export const dropDownFilters = async (req, res) => {
    try {
        const years = await Image.distinct("year");
        const locations = await Image.distinct("location");

        years.sort((a, b) => b - a); // newest year first

        return res.status(200).json({
            success: true,
            years,
            locations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// get filter images

export const getFilteredImages = async (req, res) => {
    try {
        let { page = 1, limit = 8, year, location } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const filter = {};

        if (year) filter.year = Number(year);

        if (location && location.trim() !== "") {
            filter.location = location.trim();
        }

        const totalDocuments = await Image.countDocuments(filter);

        const images = await Image.find(filter)
            .sort({ year: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            count: images.length,
            images,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
