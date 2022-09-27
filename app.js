import express from "express";
const app = express();
import {engine} from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
passportConfig(passport);//把passport 丟進passportConfigkl做連結
import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import ensureAuthenticated from "./helpers/auth.js";
import ideasRoute from "./routes/ideasRoute.js";
import usersRoute from "./routes/usersRoute.js";

//connect to mongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Mongodb connected...");
    })
    .catch(err => console.log(err));

app.engine("handlebars", engine())
app.set("view engine", "handlebars");
app.set("views", "./views");

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan("tiny"))
app.use(express.static("views/public"));
app.use(methodOverride("_method"));
app.use(session({
    secret:"anything",//無所謂, 可當一個key用
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:20*1000,//存放時間（沒有動作(request API)的時候）
    }
}));//return value to use
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//任何地方都可以加msg
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.fail_passport = req.flash("fail_passport");
    res.locals.user=req.user||null;
    console.log("abc",res.locals.user);//debug用
    next();
})

app.get("/",(req, res) => {
    const title = "Welcome";
    res.render('index', {title: title})//pass一個obj
});
app.get("/about",(req, res) => {
    res.render("about")
});

//routes
app.use("/ideas",ensureAuthenticated ,ideasRoute);
app.use("/users",usersRoute);

app.get("/*", (req, res) => {//404
    res.status(404);
    res.render("404");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server start on port ${port}`)
});
