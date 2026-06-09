import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const result = await User.updateMany({}, { $set: { isApproved: true } });
        console.log(`Updated ${result.modifiedCount} existing users to be approved.`);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateUsers();
