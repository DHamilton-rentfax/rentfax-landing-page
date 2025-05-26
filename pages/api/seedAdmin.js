import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  await dbConnect()

  const email = 'admin@rentfax.io'
  const plainPassword = 'DHamilton1!!'
  const hashedPassword = await bcrypt.hash(plainPassword, 12)

  try {
    const user = await User.findOne({ email })

    if (user) {
      if (!user.isAdmin) {
        user.isAdmin = true
        await user.save()
        return res.status(200).json({ message: 'Existing user promoted to admin' })
      }
      return res.status(200).json({ message: 'Admin already exists' })
    }

    // ← use new User, not new Admin
    const admin = new User({
      email,
      password: hashedPassword,
      isAdmin: true,    // this flag makes them an admin
    })

    await admin.save()
    return res.status(201).json({ message: 'Admin user created' })
  } catch (err) {
    console.error('Error seeding admin:', err)
    return res.status(500).json({ error: 'Error creating admin' })
  }
}
