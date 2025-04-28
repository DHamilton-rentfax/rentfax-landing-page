export async function fetchHashnodePosts() {
    const username = "rentfax"; // 🔥 Change to your real Hashnode username
  
    const response = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            user(username: "${username}") {
              publication {
                posts(page: 0) {
                  _id
                  title
                  brief
                  slug
                }
              }
            }
          }
        `,
      }),
    });
  
    const { data } = await response.json();
    return data.user.publication.posts.map(post => ({
      id: post._id,
      title: post.title,
      brief: post.brief,
      slug: post.slug,
    }));
  }
  