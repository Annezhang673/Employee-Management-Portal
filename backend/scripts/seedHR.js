import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/user_model.js';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
   await mongoose.connect(process.env.MONGODB_URI);
   const hash = await bcrypt.hash('hr_001_password', 10);

   await User.create({
      userName: 'hr_001',
      email:    'hr_001@gmail.com',
      password: hash,
      role:     'HR'
   });
   console.log('✅ HR user created');
   process.exit();
}

seed().catch(e => {
   console.error(e);
   process.exit(1);
});
