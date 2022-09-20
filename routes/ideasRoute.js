import express from "express";
const router = express.Router();
import IdeaFn from "../controllers/ideaController.js";

router.get("/",IdeaFn.getIdeas);//show notes
router.get("/add", IdeaFn.getAddIdea).post("/add",IdeaFn.postAddIdeas );//insert notes => post database
router.get("/edit/:id",IdeaFn.getEditIdea).put('/edit/:id', IdeaFn.putEditIdea);//update notes => put database
router.delete("/:id",IdeaFn.deleteIdea);//delete notes

export default router;
