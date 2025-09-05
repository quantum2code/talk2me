import { Router } from "express";
import { transcriptionHandler } from "../controllers/transcriptionHandler";
import multer from "multer";
import path from "path";
import { analysisHandler } from "../controllers/analysisHandler";
import { start } from "repl";
import { startConversationHandler } from "../controllers/startConversationHandler";

// let currFileName = "";
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "./uploads/",

//     filename: function (req, file, cb) {
//       currFileName =
//         file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//       cb(null, currFileName);
//     },
//   }),
// });
const upload = multer({ storage: multer.memoryStorage() });

const apiRouter = Router();

apiRouter.post(
  "/transcription",
  upload.single("audioFile"),
  transcriptionHandler
);
apiRouter.post("/analysis", analysisHandler);

apiRouter.post("/start-conversation", startConversationHandler);

export { apiRouter };
