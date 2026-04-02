import express from "express";
const router = express.Router();
import { getRandomQuestions } from "../../controllers/symptomController.js";

router.route("/random").get(getRandomQuestions);

export default router;
