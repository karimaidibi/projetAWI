const JeuModel = require('../models/JeuModel');

module.exports = {

    //get tous les jeu
    list: (req,res)=>{
        JeuModel.find((err,jeux)=>{
            if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting jeux'
            })
            }
            return res.status(200).json({
            status: 200,
            result: jeux
            })
        })
    },

    //get un jeu
    show: (req, res)=>{
    const id = req.params.id; // recupere id dans les paramteres de la requete
    JeuModel.findOne({_id: id}, (err, jeu)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting une jeu.'
            })
        }
        if(!jeu){
            return res.status(404).json({
                status: 404,
                message: 'jeu non trouvé !'
            })
        }
        return res.status(200).json({
            status: 200,
            result: jeu
        })
    })
    },

    //créer une jeu 
    create: (req, res)=>{

        //recuperer le body de la requete
        const jeu = req.body; 
        delete jeu._id; // si ya un id dans la reponse json recu je le supprime (va etre regenere par mongodb)

        var Rdv = new JeuModel({
            ...jeu,
        })
        // save la jeu dans mongodb
        Rdv.save((err, jeu)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when creating jeu',
                    error: err
                });
            }
            return res.status(201).json({
                status: 201,
                message: 'jeu Created'
            })
        })
    },

    remove: (req,res)=>{
    const id = req.params.id;
    JeuModel.findByIdAndRemove(id,(err,jeu)=>{
        if(err){
        return res.status(500).json({
            status: 500,
            message: 'Error when getting un jeu.'
        })
        }
        if(!jeu){
            return res.status(404).json({
                status: 404,
                message: 'jeu non trouvé !'
            })
        }
        return res.status(204).json() 
    })
    },

    //update un jeu
    update: (req,res)=>{
        const id = req.params.id; // recupere id dans les parameteres de la requete
        const jeu = req.body; // recupere le body de la requete
        //update le jeu
        BenevoleModel.updateOne({_id: id},{$set:{...jeu}}, (err,data)=>{
            if(err){
                return res.status(500).json({
                status: 500,
                message: 'Erreur when updating jeu.'
                })
            }
            // si tout ce passe bien
            return res.status(200).json({
                status: 200,
                message: 'Objet updated success!'
            })
        })
    },

    // Update le type de jeu du jeu
    updateTypeJeuOfJeu: (req,res)=>{
        const id = req.params.id; // recupere id dans les parameteres de la requete
        const typeJeu = req.body.typeJeu // recuperer le type de jeu dans le body de la requete

        //update le type de jeu du jeu
        JeuModel.updateOne({_id: id},{$set:{typeJeu : typeJeu}}, (err,data)=>{
            if(err){
                return res.status(500).json({
                status: 500,
                message: 'Erreur when updating typeJeu of jeu.'
                })
            }
            // si tout ce passe bien
            return res.status(200).json({
                status: 200,
                message: 'Objet updated success!'
            })
        })

    },

    // Update la zone du jeu
    updateZoneOfJeu: (req,res)=>{
        const id = req.params.id; // recupere id dans les parameteres de la requete
        const zone = req.body.zone // recupere la zone dans le body de la requete
        //update la zone du jeu
        JeuModel.updateOne({_id: id},{$set:{zone : zone}}, (err,data)=>{
            if(err){
                return res.status(500).json({
                status: 500,
                message: 'Erreur when updating zone of jeu.'
                })
            }
            // si tout ce passe bien
            return res.status(200).json({
                status: 200,
                message: 'Objet updated success!'
            })
        })

    },
  
}