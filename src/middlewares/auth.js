const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const person = new PrismaClient().person
const blacklistToken = new PrismaClient().token

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.headers['pj-token']
    if (!token) {
        return res.status(400).send({ msg: "The token is required for authen" })
    }
    const bt = await blacklistToken.findFirst({
        where: {
            token: token
        }
    })
    if (bt) {
        return res.status(401).send({ msg: "Please sign in again" })
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN)
        let findedUser = await person.findFirst({
            where:{
                user_id: decoded.user_id
            }
        })
        req.token = token 
        req.user = decoded
    } catch(error){
        return res.status(400).send({ msg: "Invalid token" })
    }
    next()
}

module.exports = verifyToken