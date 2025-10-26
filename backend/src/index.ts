import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/route";
import { errorHandler } from "./middleware/errorHandler";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get("/", (req, res) => res.json({ message: "hello from /" }));
app.use("/api/", apiRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server running on http://localhost:${PORT}`);
});
<<<<<<< HEAD
=======
// export { client };
>>>>>>> working
