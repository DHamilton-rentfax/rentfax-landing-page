// src/api/hashnodeApi.js

export async function fetchPosts() {
  const host = "blogs.rentfax.io"; // 🔥 Your custom domain

  const query = `
    query {
      publication(host: "${host}") {
        posts(first: 10) {
          edges {
            node {
              title
              slug
              brief
              coverImage {
                url
              }
              publishedAt
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    console.error("Hashnode API Error:", response.status);
    throw new Error("Failed to fetch posts");
  }

  const result = await response.json();

  const posts = result?.data?.publication?.posts?.edges?.map((edge) => ({
    title: edge.node.title,
    slug: edge.node.slug,
    brief: edge.node.brief,
    coverImage: edge.node.coverImage?.url || "",
    publishedAt: edge.node.publishedAt,
  })) || [];

  return posts;
}
