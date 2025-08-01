// scripts/migrateHtmlToTiptap.js

import 'dotenv/config'
import mongoose from 'mongoose'
import { htmlToJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Post from '../models/Post.js' // adjust path as needed

const MONGO_URI = process.env.MONGODB_URI

async function migrate() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const htmlBlogs = await Post.find({ content: { $type: 'string' } })
  console.log(`📝 Found ${htmlBlogs.length} blog(s) with HTML content.`)

  for (const blog of htmlBlogs) {
    try {
      const jsonContent = htmlToJSON({
        content: blog.content,
        extensions: [StarterKit],
      })

      blog.content = jsonContent
      await blog.save()

      console.log(`✅ Converted "${blog.title}" (${blog.slug})`)
    } catch (err) {
      console.error(`❌ Failed to convert "${blog.title}":`, err.message)
    }
  }

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Migration complete.')
}

migrate()
