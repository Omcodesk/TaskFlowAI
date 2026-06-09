import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Attempting to connect with URI loaded:', !!uri);
    if(uri) console.log('Masked URI:', uri.replace(/:([^:@]{8})[^:@]*@/, ':****@'));
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // process.exit(1); removed for health endpoint debugging
  }
};

export default connectDB;
