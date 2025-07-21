import { Router } from "express";
import { transcribeHandler } from "../controllers/transcribeHandler";
import multer, { memoryStorage } from "multer";
import path from "path";
let currFileName = "";

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

apiRouter.post("/transcribe", upload.single("audioFile"), transcribeHandler);

export { apiRouter, currFileName };
