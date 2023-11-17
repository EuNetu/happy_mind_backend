const express = require('express');
const app = express();

const cors = require('cors');

app.use( 
  cors({
    Credentials:true, 
    origin: 'http://localhost:5000'
  }) 
)

app.use(express.json())


app.listen(8000)