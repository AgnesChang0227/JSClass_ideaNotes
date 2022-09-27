import User from "../models/User.js";
import bcrypt from "bcryptjs";
import passport from "passport";

const UserFn = {
    getRegister: (req, res) => {
        res.render("users/register");
    },
    postRegister: (req, res) => {
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
    },
    getLogin: (req, res) => {
        res.render("users/login");
    },
    postLogin: (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/ideas",
            failureRedirect: "/users/login",
            failureFlash: true,
            session: true,//debug用
        })(req, res, next)
    },
    getLogout: (req, res) => {
        console.log("logout");
        //logout 是passport的功能：delete req.session of user
        req.logOut(err => {
            if (err) throw err;
            req.flash("success_msg", "You're logged out");
            res.redirect("/users/login")
        });

    },
    getProfile:(req,res)=>{
        res.render("users/profile",{
            name:res.locals.user.name,
            email:res.locals.user.email,
        });

    }
}
export default UserFn;