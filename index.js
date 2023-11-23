const express = require('express');
const app = express();
const connection = require("./db/connection");

const cors = require('cors');

// Compartilhar recursos entre diferentes origens
app.use(
  cors({
    Credentials: true,
    origin: 'http://localhost:5000'
  })
)

// Configuração de resposta
app.use(express.json())


// Rotas
const UserRouters = require('./routers/UserRoutes')
const ChildRouters = require('./routers/ChildRouters')
const RecordRouters = require('./routers/RecordRouters')

app.use('/user', UserRouters)
app.use('/child', ChildRouters)
app.use('/record', RecordRouters)

//sincronizar com o banco e observar a aplicação na porta 8000
connection
  // .sync({force: true})
  .sync()
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });