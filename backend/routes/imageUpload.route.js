import express from "express";
import { upload } from "../config/multer.js";
import {
    dropDownFilters,
    getFilteredImages,
    uploadImage,
} from "../controllers/image.controller.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/dropdown", dropDownFilters);
router.get("/filter-images", getFilteredImages);

export default router;
