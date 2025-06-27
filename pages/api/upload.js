import multer from "multer";
import nextConnect from "next-connect";
import sharp from "sharp";
import { uploadToS3 } from "@/utils/s3";
// import { verifyToken, isAdmin } from "@/middleware/auth"; // Enable if needed

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect({
  onError(error, req, res) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Image upload failed." });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.use(upload.single("file"));
// handler.use(verifyToken); // enable if you re-add auth
// handler.use(isAdmin);

handler.post(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const { originalname, mimetype, buffer } = file;
    const baseFileName = originalname.replace(/\s+/g, "-").replace(/\.[^/.]+$/, "");

    const outputFormat = mimetype.includes("png") ? "png" : "jpeg";

    // Create main optimized version
    const processedBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat(outputFormat, { quality: 80 })
      .toBuffer();

    // Create thumbnail version
    const thumbnailBuffer = await sharp(buffer)
      .resize({ width: 300 })
      .toFormat("jpeg", { quality: 60 })
      .toBuffer();

    const optimized = await uploadToS3(processedBuffer, `${baseFileName}.jpg`, `image/${outputFormat}`);
    const thumbnail = await uploadToS3(thumbnailBuffer, `${baseFileName}-thumb.jpg`, "image/jpeg");

    const originalSizeKB = Math.round(buffer.length / 1024);
    const optimizedSizeKB = Math.round(processedBuffer.length / 1024);

    return res.status(200).json({
      originalName: originalname,
      originalSizeKB,
      optimizedSizeKB,
      url: optimized.Location,
      thumbnailUrl: thumbnail.Location,
    });
  } catch (err) {
    console.error("S3 upload error:", err);
    return res.status(500).json({ error: "S3 upload failed" });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default allowCors(handler);
