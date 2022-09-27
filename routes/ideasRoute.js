import express from "express";
const router = express.Router();
import IdeaFn from "../controllers/ideaController.js";

//2種方法都可以：
router.get("/",IdeaFn.getIdeas);//show notes
router.route("/add").get(IdeaFn.getAddIdea).post(IdeaFn.postAddIdeas );//insert notes => post database
router.get("/edit/:id",IdeaFn.getEditIdea).put('/edit/:id', IdeaFn.putEditIdea);//update notes => put database
router.delete("/:id",IdeaFn.deleteIdea);//delete notes
router.get("/records",IdeaFn.getRecords);

export default router;
