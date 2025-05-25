// pages/api/upload.js
import nextConnect from "next-connect"
import multer from "multer"
import { uploadToS3 } from "../../utils/s3"

// 1) Turn off Next.js body parsing so multer can work
export const config = {
  api: {
    bodyParser: false,
  },
}

// 2) Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: 10MB limit
})

const handler = nextConnect({
  onError(err, req, res) {
    console.error("Upload API Error:", err)
    res.status(500).json({ error: "Upload failed" })
  },
  onNoMatch(req, res) {
    res
      .status(405)
      .json({ error: `Method ${req.method} not allowed` })
  },
})

// 3) Attach multer middleware to handle a single "file" field
handler.use(upload.single("file"))

handler.post(async (req, res) => {
  // 4) Guard: multer must populate req.file
  if (!req.file) {
    return res.status(400).json({ error: "No file provided." })
  }

  const { originalname, mimetype, buffer } = req.file

  try {
    // 5) Upload to S3
    const result = await uploadToS3(buffer, originalname, mimetype)
    // S3 SDK v2 returns .Location, v3 may differ—adjust as needed
    const url = result.Location || result.Key || null

    if (!url) {
      throw new Error("S3 did not return a URL")
    }

    return res.status(200).json({ url })
  } catch (err) {
    console.error("S3 upload error:", err)
    return res
      .status(500)
      .json({ error: "Could not upload file to S3." })
  }
})

export default handler
