import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const getUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'firstName email role createdAt');
        
        console.log('--- ALL REGISTERED USERS ---');
        users.forEach(u => {
            console.log(`Name: ${u.firstName} | Email: ${u.email} | Role: ${u.role}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
        process.exit(1);
    }
};

getUsers();
