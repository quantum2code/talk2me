import { Router } from "express";
import { transcriptionHandler } from "../controllers/transcriptionHandler";
import multer from "multer";
import { analysisHandler } from "../controllers/analysisHandler";
import { startConversationHandler } from "../controllers/startConversationHandler";
import { getConversationsHandler } from "../controllers/getConversationsHandler";
import { getConversationByIdHandler } from "../controllers/getConversationByIdHandler";
import { toNodeHandler } from "better-auth/node";
// import { auth } from "../utils/auth";

const upload = multer({ storage: multer.memoryStorage() });

const apiRouter = Router();

apiRouter.post("/transcription", upload.single("audio"), transcriptionHandler);
apiRouter.post("/analysis", analysisHandler);

apiRouter.post("/start", startConversationHandler);
apiRouter.get("/conversations", getConversationsHandler);
apiRouter.get("/conversations/:id", getConversationByIdHandler);

// apiRouter.all("/auth/{*any}", toNodeHandler(auth));

export { apiRouter };
