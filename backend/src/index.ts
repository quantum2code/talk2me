import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/route";
import { errorHandler } from "./middleware/errorHandler";
import { initializeMongoDB } from "./db/db";
config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.json({ message: "hello from /" }));
app.use("/api/", apiRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  try {
    initializeMongoDB(MONGODB_URI || "");
    console.log(`server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("FAILED TO START THE SERVER", error);
  }
});
