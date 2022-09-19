import express from "express";
const router = express.Router();
import IdeaFn from "../controllers/ideaController.js";

router.get("/",IdeaFn.getIdeas);//show notes
router.get("/add", IdeaFn.getAddIdea);//insert form
router.post("/add",IdeaFn.postAddIdeas );//insert notes => database
router.get("/edit/:id",IdeaFn.getEditIdea);//edit form
router.put('/edit/:id', IdeaFn.putEditIdea);//update notes => database
router.delete("/:id",IdeaFn.deleteIdea);//delete notes

export default router;
