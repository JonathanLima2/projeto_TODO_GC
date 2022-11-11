
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