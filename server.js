import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // (you probably already imported this)

dotenv.config();

const app = express();

// ✅ Fix CORS here!
app.use(cors({
  origin: 'http://localhost:5182', // your frontend URL
  credentials: true,
}));

app.use(express.json());

// Example route
app.get('/api/posts', async (req, res) => {
  try {
    const notionToken = process.env.VITE_NOTION_TOKEN;
    const databaseId = process.env.VITE_NOTION_DATABASE_ID;

    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    const data = await notionResponse.json();

    const posts = data.results.map((page) => ({
      id: page.id,
      title: page.properties?.Title?.title?.[0]?.plain_text || '',
      slug: page.properties?.Slug?.rich_text?.[0]?.plain_text || '',
      excerpt: page.properties?.Excerpt?.rich_text?.[0]?.plain_text || '',
      content: page.properties?.Content?.rich_text?.[0]?.plain_text || '',
      cover: page.properties?.Cover?.url || '',
    }));

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
