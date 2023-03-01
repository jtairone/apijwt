const express = require('express')
const cors    = require('cors')
const router  = require('./rotas')
const cookieParser = require('cookie-parser')
const app     = express()
require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/', router)

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
})