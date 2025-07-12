import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from '../src/models/user_model.js';
import Application from '../src/models/application_model.js';

async function main() {
   // connect to MongoDB
   await mongoose.connect(process.env.MONGODB_URI);
   console.log('✅ Connected to MongoDB');

   // Clear existing data
   // await User.deleteMany({ email: /@example\.com$/ });
   // await Application.deleteMany();

   // Create 2 employee users
   const empData = [
      {userName: "testUser_001", email: "test_001@gmail.com", password: "Test_001" },
      {userName: "testUser_002", email: "test_002@gmail.com", password: "Test_002" }
   ];

   const employees = [];
   for (const u of empData) {
      const hash = await bcrypt.hash(u.password, 10);
      const user = await User.findOneAndUpdate(
         { email: u.email },
         { userName: u.userName, email: u.email, password: hash, role: 'Employee'},
         { upsert: true, new: true }
      );

      console.log('👤 Employee user:', user.email);
      employees.push(user);
   }

   // Create some sample application
   const sampleApps = [
      {
         user:     employees[0]._id,
         data:     { firstName: 'Alice',  lastName: 'Anderson',   position: 'Engineer' },
         documents: [],
         status:   'Pending'
      },
      {
         user:     employees[1]._id,
         data:     { firstName: 'Bob',    lastName: 'Baker',      position: 'Designer' },
         documents: [],
         status:   'Rejected',
         feedback: 'Your visa document is missing a signature.'
      }
   ];

   for (const app of sampleApps) {
      const created = await Application.findOneAndUpdate(
         { user: app.user },
         app,
         { upsert: true, new: true }
      );
      console.log(`📄 Application for ${app.user.toString()}:`, created.status);
   }

   console.log('🎉 Seeding complete');
   process.exit(0);
}

main().catch( err => {
   console.error(err);
   process.exit(1);
})