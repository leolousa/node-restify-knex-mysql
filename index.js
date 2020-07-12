const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'fundamento_user',
    password : 'to120120',
    database : 'fundamento'
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

// Rotas rest
// Lista postagens
server.get('/posts', (req, res, next) => {

  knex('postagens').then((dados)=>{
    res.send(dados);
  }, next)

});

//Insere postagem
server.post('/posts/create', (req, res, next) => {

  knex('postagens')
    .insert(req.body)
    .then((dados)=>{
      res.send(dados);
    }, next)
});

//Busca postagem
server.get('/posts/:id', (req, res, next) => {
  const { id } = req.params;

  knex('postagens')
    .where('id', id)
    .first()
    .then((dados)=>{
      if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'))
      res.send(dados);
    }, next)

});

//Atualiza postagem
server.put('/posts/:id', (req, res, next) => {
  const { id } = req.params;

  knex('postagens')
    .where('id', id)
    .update(req.body)
    .then((dados)=>{
      if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'))
      res.send('Dados atualizados!');
    }, next)

});

//Deleta postagem
server.del('/posts/:id', (req, res, next) => {
  const { id } = req.params;

  knex('postagens')
    .where('id', id)
    .delete()
    .then((dados)=>{
      if(!dados) return res.send(new errs.BadRequestError('Nada foi encontrado!'))
      res.send('Dados excluídos!');
    }, next)

});

