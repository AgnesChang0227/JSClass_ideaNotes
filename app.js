import express from "express";
import {engine} from "express-handlebars";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";

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
app.use(morgan("tiny"))
app.use(methodOverride("_method"));

//beginning of middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    const title = "Welcome";
    res.render('index', {title: title})//pass一個obj
})
app.get("/about", (req, res) => {
    res.render("about")
})
app.get("/ideas", (req, res) => {
    Idea.find({})
        .lean()//.lean() => cached ，可以handle更多data
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

//create
app.get("/ideas/add", (req, res) => {
    res.render("ideas/add")
})


app.get("/ideas/edit/:id", (req, res) => {
    Idea.findOne({_id: req.params.id})
        .lean()
        .then((idea) => {
            res.render("ideas/edit", {idea})
        })
})

//edit
app.put("/ideas/edit/:id", (req, res) => {
    Idea.findOne(req.params)
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save().then(() => {
                res.redirect("/ideas");
            })
        })
})

//delete
app.delete("/ideas/:id", (req, res) => {
    Idea.deleteOne({_id: req.params.id})
        .then(() => {
            res.redirect("/ideas");
        })
})

app.get("/*", (req, res) => {
    res.status(404);
    res.render("404");
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`)
});
