/*
- creer un middleware qui va regarder si la requete contient un token
 - si oui, regarder si valide
- si tout est bon, passer au middleware suivant 
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try {
        // recuperer deja le token dans la requete
        const token = req.headers.authorization.split(' ')[1];
        // la methode verify permet de verifier un token, si cest delivré par le serveur et si cest valide
        // vreify prend en parametre le token et la cle secret pour encoder le token
        // verify return le identifiant de l utilisateur si tout est ok 
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const userStatus = decodeToken.userStatus
        console.log('userStatus : ',userStatus)

        // verifier si dans la requete on a l identifiant de l utilisateur et si cette identifiant est conformer a celui dans le token et c'est admin
        if(req.body.userId){
            if(req.body.userId !== decodeToken.userId){
                return res.status(401).json({
                    status: 401,
                    message: 'INVALID USER ID !'
                })
            }else if (userStatus !== 1){
                return res.status(401).json({
                    status: 401,
                    message: 'PERMISSION DENIED NOT ADMIN !'
                }) 
            }else{
                next()
            }
        }else if( userStatus !== 1){
            return res.status(401).json({
                status: 401,
                message: 'PERMISSION DENIED NOT ADMIN !'
            })   
        }else{
            next()
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'error in authAdmin :' + error.message
        })
    }
} 