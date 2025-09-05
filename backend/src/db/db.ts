import mongoose, { Connection } from "mongoose";

let connection: Connection | null = null;

export async function initializeMongoDB(uri: string): Promise<Connection> {
  if (connection && connection.readyState === 1) return connection;
  try {
    await mongoose.connect(uri);
    connection = mongoose.connection;
    return connection;
  } catch (error) {
    console.error("MONGODB CONNECTION:", error);
    throw error;
  }
}
