import mongoose from "mongoose";

let client: mongoose.mongo.MongoClient;
export async function initializeMongoDB(): Promise<mongoose.mongo.MongoClient> {
  try {
    if (client) return client;
    await mongoose.connect(process.env.MONGODB_URI!);
    client = mongoose.connection.getClient();
    return client;
  } catch (error) {
    console.error("MONGODB CONNECTION:", error);
    throw error;
  }
}
