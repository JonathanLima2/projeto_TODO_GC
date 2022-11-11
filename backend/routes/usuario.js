const { application } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {eUser} = require('../helpers/eUser');

router.get("/registro", (req, res) => {
    res.render("usuario/registro");
});

router.post("/registro", (req,res) => {
    var erros = ValidateLogin(req);
    if(erros.length > 0){
        res.render("usuario/registro", {erros: erros});
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Este email já está cadastrado");   
                res.redirect("/usuario/registro");
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 0 || req.body.eAdmin
                });
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro,hash) => {
                        if(erro){
                            req.flash("error_msg", "houve um erro durante o salvamento");
                            res.redirect("/");    
                        }else{
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso!");
                                res.redirect("/");
                            }).catch((error) => {
                                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente mais tarde.")
                                res.redirect("/usuario/registro");
                            });
                        }
                    });
                });
            }
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro interno");
            res.redirect("/");
        });
    }
});

router.get("/login", (req, res) => {
    res.render("usuario/login");
});

router.post("/login",(req, res, next) => {
    Usuario.findOne({email: req.body.email}).then((usuario) =>{
        if(usuario.eAdmin=="1"){
            passport.authenticate("local", {
                successRedirect: "/admin",
                failureRedirect: "/usuario/login",
                failureFlash: true
            })(req, res, next);
        }else{
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/usuario/login",
                failureFlash: true
            })(req, res, next);
        }
    })
});

router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "Deslogado com sucesso");
        res.redirect('/');
      });
});
module.exports = router;

function ValidateLogin (req){ //login de usuarios
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido"});
    }else if(req.body.nome.length < 3){
        erros.push({texto: "O nome é muito curto!"});
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"});
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"});
    }else if(req.body.senha.length < 4){
        erros.push({texto: "A senha é muito curta"});
    }
    if(!req.body.senha2|| typeof req.body.senha2 == undefined || req.body.senha2 == null || req.body.senha2 != req.body.senha){
        erros.push({texto: "As senhas são diferentes"});
    }

    return erros;
}