import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

console.log('Testing connection to:', uri.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // mask part of the password

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED: Could not connect to MongoDB Atlas.');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    process.exit(1);
  });
