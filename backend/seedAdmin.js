import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const email = 'admin2@taskflow.com';
        const password = 'password123';
        
        // Check if exists
        let admin = await User.findOne({ email });
        
        if (admin) {
            // Update password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
            await admin.save();
            console.log(`Password reset for existing admin: ${email}`);
        } else {
            // Create new
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            admin = await User.create({
                firstName: 'Super',
                lastName: 'Admin',
                email,
                password: hashedPassword,
                role: 'Admin'
            });
            console.log(`Created new admin account: ${email}`);
        }
        
        console.log('Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
