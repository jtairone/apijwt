const express = require('express')
const jwt     = require('jsonwebtoken')
const funcoes = require('./src/funcoes')
require('dotenv').config()
const router = express.Router()
//implementado o Sequelize e sqlite pra trabalhar banco de dados como exemplo
const DadosUsuario = require('./database/modelos/tabela_usuarios')

router.get('/', (req, res)=>{
    res.status(200).json({ message:'Rodando!'})
})
//rota login verificar se o usuario existe cria o token e retornar cookie do token
router.post('/api/login', async (req, res)=>{
    try{    
        const usuario = await DadosUsuario.findOne({where: {user: req.body.user, senha: req.body.pass}})
        if(usuario) {     
        const token = jwt.sign({userId: 1}, process.env.SECRET, {expiresIn: process.env.EXPIRESIN})
            res.cookie('accessToken', token, {httpOnly:true})
           return res.json({accessToken:token})
        }
        res.status(401).json({status:'Não Autorizado!'})
    }catch(erro){
        res.json({status:erro.message})
    }
})
//rota fazer logout retornar pra apagar cookie do token
router.get('/api/logout', funcoes.verificarJWT, (req, res) => {
    res.clearCookie('accessToken')
    res.json({'status':'Logout OK!'})
})
//cadastrar usuário
router.post('/api/cadusuario', funcoes.verificarJWT, async (req, res)=>{
    //implementado try catch ligar excessoes de erros
    try{
        const {nome, senha} = req.body
        const user = new funcoes.Usuario(nome, senha)
        const insert = await DadosUsuario.create(user)
        res.json(insert)
    }catch(err){
        res.json(err.message)
    }
})
//buscar todos os usuarios
router.get('/api/usuarios', funcoes.verificarJWT, funcoes.limiter, async (req, res)=>{
    try{
        const usuarios = await DadosUsuario.findAll()
        res.json(usuarios)
    }catch(err){
        res.json(err.message)
    }
})
//buscar usuario por id
router.get('/api/usuario/:id', funcoes.verificarJWT, funcoes.limiter, async (req, res)=>{
    try{
        const usuario = await DadosUsuario.findOne({where: {id: req.params.id}})
        res.json(usuario)
    }catch(err){
        res.json(err.message)
    }
})

module.exports = router