const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    signup: (req, res)=>{
        bcrypt.hash(req.body.password, 10, (err,hash)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: err.message
                })
            }
            //create user
            const user = req.body
            const newUser = new UserModel({
                ...user,
                email: req.body.email,
                password: hash
            })
            //save
            newUser.save((err,user)=>{
                if(err){
                    return res.status(400).json({
                        status: 400,
                        message: err.message
                    })  
                }
                return res.status(201).json({
                    status: 201,
                    message: 'User created succesfully'
                })
            })
        })
    },

    login: (req, res)=>{
        //chercher lutilisateur en question
        UserModel.findOne({email: req.body.email}, (err, user)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: err.message
                });
            }
            if(!user){
                return res.status(404).json({
                    status: 404,
                    message: 'utilisateur NOT found'
                });           
            }
            // si pas derreur, verifier le mot de passe de lutilisateur
            // comparer le pass recu avec le pass de user dans la bd
            bcrypt.compare(req.body.password, user.password, (err,valide)=>{
                if(err){
                    return res.status(500).json({
                        status: 500,
                        message: err.message
                    });
                }
                if(!valide){
                    return res.status(401).json({
                        status: 401,
                        message: "password pas bon !"
                    });         
                }
                // si tout se passe bien
                else{
                    console.log('client logged in')
                    return res.status(200).json({
                        userId: user._id,
                        // generer un token avec le package json web token
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.TOKEN_SECRET, // grace a cette cle ca va encoder le token et on a besoin de ca pour decoder le token 
                            {expiresIn: '24h'} // dure pour une journe
                        )
    
                    })
                }
            })
        })
    }
}