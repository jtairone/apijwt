const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')
require('dotenv').config()

//usando o express-rate-limit limitar a quantidade de requisiões
exports.limiter = rateLimit({
    windowMS: 1 * 60 *1000, //1 minuto
    max: 3,
    message: {'status':'limitado 3 requisições por minuto'}
})

let blacklist = []
exports.invalidarToken = token => blacklist.push(token) 
setInterval(() => {
    blacklist = []
}, process.env.TIME)

//verificar o JWT Token nas requisições
exports.verificarJWT = async (req, res, next)=> {
    try{
        const token = req.cookies.accessToken
        if(blacklist.includes(token)){ return res.status(401).json({'error':'Token Inválido!'}) }
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
exports.Usuario = function (user, salt, senha) {
    this.user = user
    this.salt = salt
    this.senha = senha
}

exports.gerarSalt = () => crypto.randomBytes(16).toString('hex')

exports.criptogravaSenha = (pass, salt) => {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(pass)
    let senha = hash.digest('hex')
    return {salt, senha}
}
//passo a senha esta tentando realizar login + ( salt + hashSenha esta no BD) criou um hash e valida se são identicas
exports.validarSenhaLogin = (senha, salt, hashSenha)=>{
    const senhaSalt = this.criptogravaSenha(senha, salt)
    return hashSenha === senhaSalt.senha
}