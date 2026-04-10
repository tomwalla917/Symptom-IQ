import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

mongoose.connect(process.env.LOCAL_MONGODB || 'mongodb://127.0.0.1:27017/SymptomIQ');

export default mongoose.connection;
