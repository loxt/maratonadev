const express = require('express');
const server = express();

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true
});

server.get('/', function (req, res) {
  db.query("SELECT * FROM donors", function (err, result) {
    if (err) { res.send("Erro de banco de dados."); }

    return res.render('index.html', result.rows);
  })
});

server.post('/', function (req, res) {
  const { name, blood } = req.body;

  if (name === "" || email === "" || blood === "") {
    res.send("Todos os campos são obrigatórios.");
  }

  const query = (`INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`);

  const values = [name, email, blood];

  db.query(query, values, function (err) {
    if (err) { res.send("Erro no banco de dados."); }

    return res.redirect("/");
  });

  return res.redirect("/");
})

server.listen(3000);