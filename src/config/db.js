import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, () => {
    try {
        console.log('Database connected.');
    } catch (err) {
        console.log('It was not possible to connect to the database.');
    }
});

export default mongoose;