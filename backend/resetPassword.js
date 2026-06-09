import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const resetAdminPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const users = await User.find({ role: 'Admin' });
        
        if (users.length === 0) {
            console.log('No Admin users found in the database!');
            process.exit(0);
        }

        console.log(`Found ${users.length} Admin account(s). Resetting passwords to: admin123`);
        
        const hashedPassword = await bcrypt.hash('admin123', 10);

        for (const user of users) {
            user.password = hashedPassword;
            await user.save();
            console.log(`- Reset password for: ${user.email} (Name: ${user.firstName} ${user.lastName})`);
        }

        console.log('\nAll Admin passwords have been successfully reset to: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdminPasswords();
