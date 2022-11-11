quando não ocorre o / no path da rota dentro das requisições, a rota a ser atribuída é referente a mais relativa com o que se foi passsado
no caso inserindo a path inicial de onde ela se encontra


res.render = envio do referencial da rota a ser disponibilizada     =>"teste/add"
res.redirect = caminho completo da rota a ser redirecionada         =>"/teste/add"


para criptografar uma senha: bcrypt.js
>npm install bcrytptjs

autenticação de login: passport-js
-aplicam diversos tipos de estratégia para qualquer formato de login possível
>npm install passport

para autenticar tem que ser chave primária do seu model
OBS: caso os models não estejam em inglẽs, o password precisará receber o campo passwordField, se estiver em inglês, ele não é necessário
pois ele faz a procura automaticamente. 