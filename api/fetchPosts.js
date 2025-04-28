// /api/fetchPosts.js
export default async function handler(req, res) {
    const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;
  
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      }
    });
  
    const data = await response.json();
  
    const posts = data.results.map((page) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text || '',
      slug: page.properties.Slug.rich_text[0]?.plain_text || '',
      excerpt: page.properties.Excerpt.rich_text[0]?.plain_text || '',
      content: page.properties.Content.rich_text[0]?.plain_text || ''
    }));
  
    res.status(200).json(posts);
  }
  