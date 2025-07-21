import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/route";
config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.json({ message: "hello from /" }));
app.use("/api/v1/", apiRouter);

app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
