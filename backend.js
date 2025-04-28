import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(express.json());

// ✅ Health Check BEFORE CORS
app.get("/api/health", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Now CORS setup (AFTER health check)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  "https://your-production-domain.com" // ← replace later
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Fetch posts from Notion
app.get("/api/posts", async (req, res) => {
  try {
    const notionToken = process.env.VITE_NOTION_TOKEN;
    const databaseId = process.env.VITE_NOTION_DATABASE_ID;

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      }
    });

    const data = await response.json();

    const posts = data.results.map((page) => ({
      id: page.id,
      title: page.properties?.Title?.title?.[0]?.plain_text || '',
      slug: page.properties?.Slug?.rich_text?.[0]?.plain_text || '',
      excerpt: page.properties?.Excerpt?.rich_text?.[0]?.plain_text || '',
      content: page.properties?.Content?.rich_text?.[0]?.plain_text || '',
      cover: page.properties?.Cover?.files?.[0]?.external?.url || ''
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
