import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

// console.log("client id: ", process.env.GOOGLE_CLIENT_ID);

mongoose.connect(process.env.MONGODB_URI!);
const client = mongoose.connection.getClient();
const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
});
export { auth };
