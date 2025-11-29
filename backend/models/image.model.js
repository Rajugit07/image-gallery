import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        location : {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Image = mongoose.model("Image", imageSchema);
