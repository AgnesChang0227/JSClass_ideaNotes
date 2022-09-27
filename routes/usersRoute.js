import express from "express";
import UserFn from "../controllers/userController.js";
const router = express.Router();

//使用router.route(path).get(fn).post(fn)
router.route("/register").get(UserFn.getRegister).post(UserFn.postRegister);
router.route("/login").get(UserFn.getLogin ).post(UserFn.postLogin);
router.get("/logout",UserFn.getLogout);
router.route("/profile").get(UserFn.getProfile)

export default router;