module.exports = {
    eUser: function (req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 0){
            return next();
        }
        req.flash("error_msg", "Acesso exclusivo de usuários, favor utilizar o acesso admin.");
        res.redirect("/");
    }
}