import Idea from "../models/Idea.js";
const IdeaFn = {
    getIdeas:(req, res) => {
        Idea.find({})
            .lean()//.lean() => cached ，可以handle更多data
            .sort({date: "desc"})
            .then(ideas => {
                console.log(ideas)
                res.render("ideas/index", {ideas})
            })
    },
    postAddIdeas:(req, res) => {
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
    },
    getAddIdea:(req, res) => {
        res.render("ideas/add")
    },
    getEditIdea:(req, res) => {//
        Idea.findOne({_id: req.params.id})
            .lean()
            .then((idea) => {
                console.log(idea._id);
                res.render("ideas/edit", {idea})
            })
    },
    putEditIdea:(req, res) => {
        Idea.findOne({_id: req.params.id})
            .then(idea => {
                idea.title = req.body.title;
                idea.details = req.body.details;
                idea.save().then(() => {
                    res.redirect("/ideas");
                })
            })
    },
    deleteIdea :(req, res) => {
        Idea.deleteOne({_id: req.params.id})
            .then(() => {
                res.redirect("/ideas");
            })
    },
}
export default IdeaFn;

