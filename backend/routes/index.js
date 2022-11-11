const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Postagem");
require("../models/Categoria");
const Postagem = mongoose.model("postagens");
const Categoria = mongoose.model("categorias");
router.get('/', (req,res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens: postagens});
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao carregar as postagens");
        console.log(err);
        res.redirect("/404");
    });
});
router.get("/404", (req,res) =>{
    res.send("erro 404");
});
router.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        if(postagem){
            res.render("postagem/index",{postagem: postagem});
        }else{
            req.flash("error_msg", "Postagem não existe.");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno.");
        console.log(err);
        res.redirect("/");
    });
});
router.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", {categorias: categorias});
    }).catch((err) =>{
        req.flash("error_msg","houve um erro ao listar todas as categorias");
    res.redirect("/");
    });
});
router.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens) => {
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
            }).catch((err) =>{
                req.flash("error_msg", "Houve um erro ao carregar as postagens");
                res.redirect("/");
            });
        }else{
            req.flash("error_msg", "Esta categoria não existe.");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno.");
        console.log(err);
        res.redirect("/");
    });
});
module.exports = router;