import mongoose, { Connection } from "mongoose";

export async function initializeMongoDB(
  uri: string
): Promise<mongoose.mongo.MongoClient> {
  try {
    await mongoose.connect(uri);
    const client = mongoose.connection.getClient();
    return client;
  } catch (error) {
    console.error("MONGODB CONNECTION:", error);
    throw error;
  }
}
