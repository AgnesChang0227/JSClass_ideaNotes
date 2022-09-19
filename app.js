import express from "express";
const app = express();
import {engine} from "express-handlebars";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import ideasRoute from "./routes/ideasRoute.js";

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


app.get("/", (req, res) => {
    const title = "Welcome";
    res.render('index', {title: title})//pass一個obj
});
app.get("/about",(req, res) => {
    res.render("about")
});

//routes
app.use("/ideas",ideasRoute);

app.get("/*", (req, res) => {//404
    res.status(404);
    res.render("404");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`)
});
