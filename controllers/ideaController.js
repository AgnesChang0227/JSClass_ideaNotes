import Idea from "../models/Idea.js";

const IdeaFn = {
    getIdeas: (req, res) => {
        Idea.find({user: res.locals.user._id})//找user自己的note
            .lean()//.lean() => cached ，可以handle更多data
            .sort({date: "desc"})
            .then(ideas => {
                console.log(ideas);
                res.render("ideas/index", {ideas})
            })
    },
    postAddIdeas: (req, res) => {
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
                user: res.locals.user._id,
            };
            //insert a new data to database
            new Idea(newUser).save().then((idea) => {
                req.flash("success_msg", "Note Added !");
                res.redirect("/ideas");
            });
        }
    },
    getAddIdea: (req, res) => {
        res.render("ideas/add")
    },
    getEditIdea: (req, res) => {//
        Idea.findOne({_id: req.params.id})
            .lean()
            .then((idea) => {
                res.render("ideas/edit", {idea})
            })
    },
    putEditIdea: (req, res) => {
        Idea.findOne({_id: req.params.id})
            .then(idea => {
                idea.title = req.body.title;
                idea.details = req.body.details;
                idea.save().then(() => {
                    req.flash("success_msg", `Note Updated : ${idea.title}`);
                    res.redirect("/ideas");
                })
            })
    },
    deleteIdea: (req, res) => {
        Idea.deleteOne({_id: req.params.id})
            .then(() => {
                req.flash("error_msg", "Note Deleted")
                res.redirect("/ideas");
            })
    },
    getRecords: (req, res) => {
        // Idea.aggregate([//總數
        //     {
        //         $lookup://多表鏈接查詢=> 出一個array
        //             {
        //                 from: "users",//target collection
        //                 localField: "user",//the local join field
        //                 foreignField: "_id",//target join field,內容和上面localField的內容一樣
        //                 as: "userInfo",//name of result => a object
        //             }
        //     },
        //     {
        //         $unwind: //展開:輸入某一數組字段，以輸出每個元素=> object
        //             {
        //                 path: "$userInfo",//path to the array field
        //                 preserveNullAndEmptyArrays: true,//如果path為null或丟失或空數組，則輸出文檔
        //             }
        //     },
        //     {
        //         $sort://排序
        //             {
        //                 "date":-1,//最新=>最舊 =>object
        //             }
        //     }
        // ])//總數
        Idea.find({}).populate("user",["name","email"])
            .then((recordsDB) => {
                console.log(recordsDB)//object
                res.render("ideas/records",{records:recordsDB});
            })
    }
}
export default IdeaFn;

