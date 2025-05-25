import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  const email = 'admin@rentfax.io';
  const plainPassword = 'DHamilton1!!';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new User({
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    return res.status(201).json({ message: 'Admin user created' });
  } catch (err) {
    console.error("Error seeding admin:", err);
    return res.status(500).json({ error: 'Error creating admin' });
  }
}
