const TypeJeuModel = require('../models/TypeJeuModel');

module.exports = {

  //get tous les TypeJeu
  list: (req,res)=>{
    TypeJeuModel.find((err,typesJeux)=>{
      if(err){
        return res.status(500).json({
          status: 500,
          message: 'Error when getting typesJeux'
        })
      }
      return res.status(200).json({
        status: 200,
        result: typesJeux
      })
    })
  },

  //get un TypeJeu
  show: (req, res)=>{
    const id = req.params.id; // recupere id dans les parameteres de la requete
    TypeJeuModel.findOne({_id: id}, (err, typeJeu)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting une typeJeu.'
            })
        }
        if(!typeJeu){
            return res.status(404).json({
                status: 404,
                message: 'typeJeu non trouvé !'
            })
        }
        return res.status(200).json({
            status: 200,
            result: typeJeu
        })
    })
  },

  //créer une typeJeu 
  create: (req, res)=>{

    //recuperer le body de la requete 
    const typeJeu = req.body; // transformer le json recu en objet javascript 
    delete typeJeu._id; // si ya un id dans la reponse json recu je le supprime (va etre regenere par mongodb)

    var TypeJeu = new TypeJeuModel({
        ...typeJeu,
    })
    // save la typeJeu dans mongodb
    TypeJeu.save((err, TypeJeu)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when creating TypeJeu',
                error: err
            });
        }
        return res.status(201).json({
            status: 201,
            message: 'TypeJeu Created'
        })
    })
  },

  //update une typeJeu
  update: (req,res)=>{
    const id = req.params.id // recuperer id du produit
    let typeJeu = req.body // recuperer lobjet 
    delete typeJeu._id // supprimer l'id de l'objet

    //update la typeJeu
    TypeJeuModel.updateOne({_id: id},{...typeJeu, _id: id}, (err,data)=>{
      if(err){
        return res.status(500).json({
          status: 500,
          message: 'Erreur when updating typeJeu'
        })
      }
      // si tout ce passe bien
      return res.status(200).json({
        status: 200,
        message: 'typeJeu updated success!'
      })
    })

  },

  // fonction pour supprimer une typeJeu
  remove: (req,res)=>{
    const id = req.params.id;
    TypeJeuModel.findByIdAndRemove(id,(err,typeJeu)=>{
      if(err){
        return res.status(500).json({
            status: 500,
            message: 'Error when getting une typeJeu.'
        })
      }
      if(!typeJeu){
          return res.status(404).json({
              status: 404,
              message: 'typeJeu non trouvé!'
          })
      }
      return res.status(204).json() 
    })
  }
  
}
