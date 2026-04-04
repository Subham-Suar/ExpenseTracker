import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(mongoUri);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};
