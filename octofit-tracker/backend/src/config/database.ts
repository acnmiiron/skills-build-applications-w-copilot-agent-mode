import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(connectionString);
  console.log(`Connected to ${mongoose.connection.name}`);
}

export { connectionString };
