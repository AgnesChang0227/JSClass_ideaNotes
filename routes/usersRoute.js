import express from "express";

const router = express.Router();
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport"
// import passportConfig from "../config/passportConfig.js";
//
// passportConfig(passport);

router.get("/register", (req, res) => {
    res.render("users/register");
});
router.post("/register", (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({text: "Name is missing"});
    }
    if (!req.body.email) {
        errors.push({text: "Email is missing"});
    }
    if (req.body.password.length < 4) {
        errors.push({text: "Password must be at least 4 characters"});
    }
    if (req.body.password !== req.body.password2) {
        errors.push({text: "Password do not match"});
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err
            }
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw err
                }
                newUser.password = hash;
                newUser.save().then(() => {
                    req.flash("success_msg", "Register Done!");
                    res.redirect("/users/login");
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_msg", "Something's wrong!");
                    res.redirect("/users/register");
                })
            })
        })
    }
})

router.get("/login", (req, res) => {
    res.render("users/login");
});
router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/ideas",
        failureRedirect:"/users/login",
        failureFlash:true,
    })(req,res,next)
})
export default router;