const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {eAdmin} = require('../helpers/eAdmin');
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
const passport = require("passport");

router.get('/', eAdmin,(req,res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("admin/index", {postagens: postagens});
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao carregar as postagens");
        console.log(err);
        res.redirect("/404");
    });
});
//rotas de categoria
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "erro ao listar as categorias");
        res.redirect("/admin");
    })
});
router.get('/categorias/add', eAdmin,(req, res) => {
    res.render("admin/addcategorias");
});

router.post('/categorias/nova', eAdmin, (req, res) => {

    //validação da requisição
    var erros = validateCat(req);

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros});
    }else{
        //requisição
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria salva com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar categoria!");
            res.redirect("/admin");
        })
    }
});

router.get("/categorias/edit/:id", eAdmin,(req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{    
        res.render("admin/editcategorias", {categoria: categoria});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", eAdmin,(req,res) => {
    var erros = validateCat(req);
    if(erros.length > 0)
    {
        res.render("admin/editcategorias", {erros: erros});
    }else{
        Categoria.findOne({_id:req.body.id}).then((categoria) =>{
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso");
                res.redirect("/admin/categorias");
            }).catch((err) =>{
                req.flash("error_msg", "houve um erro interno durante o salvamento.");
                res.redirect("/admin/categorias");
            });
        }).catch((err) => {
            req.flash("error_msg", "Esta categoria não existe");
            res.redirect("/admin/categorias");
        });
    }
});

router.post("/categorias/deletar", eAdmin,(req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria removida com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!");
        res.redirect("/admin/categorias");
    });
});



//rotas de postagem
router.get('/postagens', eAdmin,(req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens});
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        console.log(err);
        res.redirect("/admin");
    });
});

router.get("/postagens/add", eAdmin,(req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias}); 
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao carregar o formulário.");
        res.redirect("/admin/postagens");
    });
})

router.post("/postagens/nova", eAdmin, (req, res) => {
    var erros = validatePost(req);
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros});
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() =>{
            req.flash("success_msg", "postagem criada com sucesso");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Houve um erro ao salvar a postagem");
            res.redirect("/admin/postagens");
        });
    }
});

router.get("/postagens/edit/:id", eAdmin,(req, res) =>{
    Postagem.findOne({_id:req.params.id}).then((postagem) =>{   
        Categoria.find().then((categorias) => {
        res.render("admin/editpostagens", {categorias: categorias, postagem: postagem});
        }).catch((err)=> {
            req.flash("error_msg", "Erro ao buscar categorias");
            res.redirect("/admin/postagens");
        }); 
    }).catch((err) => {
        req.flash("error_msg", "Esta postagem não existe");
        res.redirect("/admin/postagens");
    });
});

router.post("/postagens/edit", eAdmin,(req, res) =>{
    var erros = validatePost(req);
    if(erros.length > 0){
        res.render("admin/postagens", {erros: erros});
    }else{
        Postagem.findOne({_id: req.body.id}).then((postagem) =>{
            postagem.titulo = req.body.titulo;
            postagem.slug = req.body.slug;
            postagem.descricao = req.body.slug;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;

            postagem.save().then(() => {
                req.flash("success_msg", "postagem salva com sucesso");
                res.redirect("/admin/postagens");
            }).catch((err) => {
                req.flash("error_msg", "Erro interno");
                res.redirect("/admin/postagens");
            });
        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro ao salvar a edição");
            console.log(err);
            res.redirect("/admin/postagens");    
        });
    }
});

router.post("/postagens/deletar/:id", eAdmin,(req, res) =>{
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem removida com sucesso!");
        res.redirect("/admin/postagens");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a postagem!");
        res.redirect("/admin/postagens");
    });
});

router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "Deslogado com sucesso");
        res.redirect('/');
      });
});

module.exports = router;

//sistema de validação simples
function validateCat (req){ //categoria
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome inválido"});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Texto slug inválido"});
    }
    if(req.body.nome.length < 2)
    {
        erros.push({texto: "nome da categoria é muito curto!"});
    }
    return erros;
}


function validatePost (req){ //postagens
    var erros = [];
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({texto: "Título inválido"});
    }else if(req.body.titulo.length < 2){
        erros.push({texto: "nome da categoria é muito curto!"});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Texto slug inválido"});
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "descrição inválida"});
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Conteúdo inválido"});
    }
    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida! registre uma categoria."});
    }
    return erros;
}