const express = require('express');
const app = express();
const connection = require("./db/connection");

const cors = require('cors');

// Compartilhar recursos entre diferentes origens
app.use(
  cors({
    Credentials: true,
    origin: 'http://localhost:3000'
  })
)

// Configuração de resposta
app.use(express.json())


// Rotas
const UserRouters = require('./routers/UserRoutes')
const StudentRouters = require('./routers/StudentRouters')
const RecordRouters = require('./routers/RecordRouters')
const GroupRecordRouters = require('./routers/GroupRecordRouters')
const TeacherRecordRouters = require('./routers/TeacherRecordRouters')
const ResponsibleRecordRouters = require('./routers/ResponsibleRecordRouters')

app.use('/user', UserRouters)
app.use('/student', StudentRouters)
app.use('/record', RecordRouters)
app.use('/group', GroupRecordRouters)
app.use('/teacher', TeacherRecordRouters)
app.use('/responsible', ResponsibleRecordRouters)

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