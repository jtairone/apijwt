const express = require('express')
const jwt     = require('jsonwebtoken')
const funcoes = require('./src/funcoes')
require('dotenv').config()
const router = express.Router()

let usuarios = []

router.get('/', (req, res)=>{
    res.status(200).json({ message:'Rodando!'})
})

router.post('/api/login', (req, res)=>{
    try{    
        if(req.body.user === 'tairone' && req.body.pass === '123') {     
        const token = jwt.sign({userId: 1}, process.env.SECRET, {expiresIn: process.env.EXPIRESIN})
            res.cookie('accessToken', token, {httpOnly:true})
           return res.json({accessToken:token})
        }
        res.status(401).json({status:'Não Autorizado!'})
    }catch(erro){
        res.json({status:erro.message})
    }
})
router.post('/api/cadcliente', funcoes.verificarJWT, (req, res)=>{
    const {id, nome, senha} = req.body
    const user = new funcoes.Usuario(id, nome, senha)
    usuarios.push(user)
    res.json(user)
})

router.get('/api/clientes/:id', funcoes.verificarJWT, funcoes.limiter, (req, res)=>{
    if(req.params.id === ':id'){
        return res.json(usuarios)
    }
    let cliente = usuarios.find(usuario => usuario.id == req.params.id )
    res.json(cliente)
})


module.exports = router