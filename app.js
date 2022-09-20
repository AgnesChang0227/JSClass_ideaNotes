import express from "express";
const app = express();
import {engine} from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";

import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";

import ideasRoute from "./routes/ideasRoute.js";
import usersRoute from "./routes/usersRoute.js";


//connect to mongoDB
mongoose.connect("mongodb://localhost:27017/note-dev")
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
app.use(methodOverride("_method"));
app.use(session({
    secret:"anything",//無所謂, 可當一個key用
    resave:true,
    saveUninitialized:true
}));//return value to use
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})

app.get("/", (req, res) => {
    const title = "Welcome";
    res.render('index', {title: title})//pass一個obj
});
app.get("/about",(req, res) => {
    res.render("about")
});

//routes
app.use("/ideas",ideasRoute);
app.use("/users",usersRoute);

app.get("/*", (req, res) => {//404
    res.status(404);
    res.render("404");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`)
});
