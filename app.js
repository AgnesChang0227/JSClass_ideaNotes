import express from "express";
import {engine} from "express-handlebars";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
mongoose.connect("mongodb://localhost:27017/note-dev")
    .then(() => {
        console.log("Mongodb connected...");
    })
    .catch(err => console.log(err));
import Idea from "./models/Idea.js";

app.engine("handlebars", engine())
app.set("view engine", "handlebars");
app.set("views", "./views");

//beginning of middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get("/", (req, res) => {
    const title = "Welcome";
    res.render('index', {title: title})//pass一個obj
})
app.get("/about", (req, res) => {
    res.render("about")
})
app.get("/ideas", (req, res) => {
    Idea.find({}).lean()//.lean() => cached ，可以handle更多data
        .sort({date: "desc"})
        .then(ideas => {
            console.log(ideas)
            res.render("ideas/index", {ideas})
        })
})
app.post("/ideas", (req, res) => {
    let errors = [];
    //push the error message in array
    if (!req.body.title) {
        errors.push({text: "Please add a title"})
    }
    if (!req.body.details) {
        errors.push({text: "Please add some details"})
    }
    //if there are errors, render the page with error message
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        };
        //insert a new data to database
        new Idea(newUser).save().then((idea) => {
            res.redirect("/ideas");
        });
    }

})
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add")
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`)
});
