// scripts/fixBlogAuthors.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import Blog from "../models/Post.js"
import User from "../models/User.js"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rentfax_blog"

async function runFix() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    const blogs = await Blog.find({})
    let updated = 0

    for (const blog of blogs) {
      const originalAuthor = blog.author
      let fixedAuthor = null

      // If already valid ObjectId with an existing user, skip
      if (
        mongoose.Types.ObjectId.isValid(originalAuthor) &&
        (await User.exists({ _id: originalAuthor }))
      ) {
        continue
      }

      // If it's an email string, try to look up the user
      if (typeof originalAuthor === "string" && originalAuthor.includes("@")) {
        const user = await User.findOne({ email: originalAuthor })
        if (user) {
          fixedAuthor = user._id
        }
      }

      // If it's just a name (e.g., "Dominique"), try to match a user by name
      else if (typeof originalAuthor === "string" && originalAuthor.length > 1) {
        const user = await User.findOne({ name: originalAuthor })
        if (user) {
          fixedAuthor = user._id
        }
      }

      // Fallback if no match — set author as null and log
      if (!fixedAuthor) {
        blog.author = null
        await blog.save()
        console.log(`⚠️ Blog "${blog.title}" had invalid author. Set to null.`)
        updated++
        continue
      }

      // If valid match found, update author field
      blog.author = fixedAuthor
      await blog.save()
      console.log(`✅ Updated blog "${blog.title}" with correct author.`)
      updated++
    }

    console.log(`\n🎉 Fix complete. Blogs updated: ${updated}`)
    process.exit()
  } catch (err) {
    console.error("❌ Error during fix:", err)
    process.exit(1)
  }
}

runFix()
