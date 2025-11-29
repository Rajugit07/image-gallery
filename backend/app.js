import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

// 3. Local imports
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import imageUpload from "./routes/imageUpload.route.js";

//observitry
import client from "prom-client";

const app = express();
// DB connection
connectDB();

const corsOptions = {
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/image", imageUpload);

app.get("/", (_, res) => {
    res.send("API running");
});

// observitry

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

// Frontend fallback for unknown UI routes
app.use((req, res, next) => {
    const isApi = req.originalUrl.startsWith("/api");
    if (!isApi) {
        return res
            .status(404)
            .sendFile(path.join(__dirname, "../frontend/404.html"));
    }
    next();
});

// API 404
app.use((_, res) => {
    res.status(404).json({
        success: false,
        message: "Invalid route",
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
