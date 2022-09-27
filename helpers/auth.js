export default function ensureAuthenticated(req,res,next){
    if (req.isAuthenticated()){//如果有登入
        return next();
    }
    req.flash("error_msg","Not Authorized");
    res.redirect("/users/login");
}