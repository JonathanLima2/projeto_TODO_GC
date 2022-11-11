//importando modulos
const PORT = process.env.PORT || 8080; //porta de acesso do servidor web
const express = require('express');
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars');
const bodyparser = require("body-parser");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { application } = require('express');
const app = express();
const admin = require("./routes/admin");
const index = require("./routes/index");
const usuario = require("./routes/usuario");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const db = require("./config/db");
require("./config/auth")(passport);
//config
    //sessao
    app.use(session({
        secret:"nodecourse",
        resave: true,
        saveUninitialized: true
    }));

    //passport init
    app.use(passport.initialize());
    app.use(passport.session());

    //flash init
    app.use(flash());

    //middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });

    //bodyparser
    app.use(bodyparser.urlencoded({extended: true}))
    app.use(bodyparser.json());
    //handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
    app.set('view engine', 'handlebars');
    //public
    app.use(express.static(path.join(__dirname, "public")))
    
    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(db.mongoURI).then(() => {
        console.log("conectado ao mongoDb.");
    }).catch((err) => {
        console.log("Erro durante conexao com mongodb: "+err);
    });

//routes
app.use('/',index);
app.use('/admin',admin);
app.use("/usuario",usuario);

//other
app.listen(PORT, () => {
    console.log("Servidor conectado!");
});
