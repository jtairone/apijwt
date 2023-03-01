const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

//usando o express-rate-limit limitar a quantidade de requisiões
exports.limiter = rateLimit({
    windowMS: 1 * 60 *1000, //1 minuto
    max: 3,
    message: {'status':'limitado 3 requisições por minuto'}
})

//verificar o JWT Token nas requisições
exports.verificarJWT = async (req, res, next)=> {
    try{
        const token = req.cookies.accessToken
        const decoded = await jwt.verify(token, process.env.SECRET)
        req.userId = decoded.userId
        next()
    }catch(err){
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ "erro": "Token Expirado!" }).end()
        }
        return res.status(401).json({ "status": "Token Inválido!" }).end()
    }
}

//criar um usuario
exports.Usuario = function (id, nome, senha) {
    this.id = id;
    this.nome = nome;
    this.senha = senha
}