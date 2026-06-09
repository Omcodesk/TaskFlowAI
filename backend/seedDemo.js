import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedDemoAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const hashedPassword = await bcrypt.hash('demo123', 10);

        // Seed Demo Admin
        const adminEmail = 'admin@demo.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await User.create({
                firstName: 'Demo',
                lastName: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin'
            });
            console.log('Demo Admin created!');
        } else {
            console.log('Demo Admin already exists.');
        }

        // Seed Demo Employee
        const employeeEmail = 'employee@demo.com';
        const existingEmployee = await User.findOne({ email: employeeEmail });
        if (!existingEmployee) {
            await User.create({
                firstName: 'Demo',
                lastName: 'Employee',
                email: employeeEmail,
                password: hashedPassword,
                role: 'Employee'
            });
            console.log('Demo Employee created!');
        } else {
            console.log('Demo Employee already exists.');
        }

        console.log('Seed complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDemoAccounts();
