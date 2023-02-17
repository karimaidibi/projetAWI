const ZoneModel = require('../models/ZoneModel');
//module externe : require le nom du module externe qu'on vient 
// dinstaller avec npm 

module.exports = {

  //get toutes les zones
  list: (req,res)=>{
    ZoneModel.find((err,zones)=>{
      if(err){
        return res.status(500).json({
          status: 500,
          message: 'Error when getting zones'
        })
      }
      return res.status(200).json({
        status: 200,
        result: zones
      })
    })
  },

  //get une zone
  show: (req, res)=>{
    const id = req.params.id; // recupere id dans les paramteres de la requete
    ZoneModel.findOne({_id: id}, (err, zone)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting une zone.'
            })
        }
        if(!zone){
            return res.status(404).json({
                status: 404,
                message: 'zone non trouver!'
            })
        }
        return res.status(200).json({
            status: 200,
            result: zone
        })
    })
  },

  //créer une zone
  create: (req, res)=>{
    //recuperer le body de la requete 
    const zone = req.body; // transformer le json recu en objet javascript 
    delete zone._id; // si ya un id dans la reponse json recu je le supprime (va etre regenere par mongodb)

    var Zone = new ZoneModel({
        ...zone,
    })
    //console.log(zone);
    // save la zone dans mongodb
    Zone.save((err, Zone)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when creating Zone',
                error: err
            });
        }
        return res.status(201).json({
            status: 201,
            message: 'Zone Created'
        })
    })
  },

  //update une zone
  update: (req,res)=>{
    const id = req.params.id // recuperer id du produit
    let zone = req.body // recuperer lobjet 
    delete zone._id;

    //update la zone
    ZoneModel.updateOne({_id: id},{...zone, _id: id}, (err,data)=>{
      if(err){
        return res.status(500).json({
          status: 500,
          message: 'Erreur when updating zone'
        })
      }
      // si tout ce passe bien
      return res.status(200).json({
        status: 200,
        message: 'Objet updated success!'
      })
    })

  },

  // fonction pour supprimer une zone
  remove: (req,res)=>{
    const id = req.params.id;
    ZoneModel.findByIdAndRemove(id,(err,zone)=>{
      if(err){
        return res.status(500).json({
            status: 500,
            message: 'Error when getting une zone.'
        })
      }
      if(!zone){
          return res.status(404).json({
              status: 404,
              message: 'zone non trouver!'
          })
      }
      return res.status(204).json() 
    })
  }
  
}
