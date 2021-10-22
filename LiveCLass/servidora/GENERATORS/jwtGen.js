const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtGenerator = (palsid) =>{
    const payload ={
        user:palsid
    }
    return jwt.sign(payload,process.env.jwtSecrete,{expiresIn:'504h'})
}
module.exports = jwtGenerator