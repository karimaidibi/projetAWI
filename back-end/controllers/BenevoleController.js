const BenevoleModel = require('../models/BenevoleModel');

module.exports = {

    //get tous les benevoles
    list: (req,res)=>{
        BenevoleModel.find((err,benevoles)=>{
            if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting benevoles'
            })
            }
            return res.status(200).json({
            status: 200,
            result: benevoles
            })
        })
    },

    //get un benevole
    show: (req, res)=>{
    const id = req.params.id; // recupere id dans les paramteres de la requete
    BenevoleModel.findOne({_id: id}, (err, benevole)=>{
        if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting une benevole.'
            })
        }
        if(!benevole){
            return res.status(404).json({
                status: 404,
                message: 'benevole non trouvé !'
            })
        }
        return res.status(200).json({
            status: 200,
            result: benevole
        })
    })
    },

    //créer une benevole 
    create: (req, res)=>{

        //recuperer le body de la requete
        const benevole = req.body; 
        delete benevole._id; // si ya un id dans la reponse json recu je le supprime (va etre regenere par mongodb)

        var Rdv = new BenevoleModel({
            ...benevole,
        })
        // save la benevole dans mongodb
        Rdv.save((err, benevole)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when creating benevole',
                    error: err
                });
            }
            return res.status(201).json({
                status: 201,
                message: 'benevole Created'
            })
        })
    },

    remove: (req,res)=>{
        const id = req.params.id;
        BenevoleModel.findByIdAndRemove(id,(err,benevole)=>{
            if(err){
            return res.status(500).json({
                status: 500,
                message: 'Error when getting un benevole.'
            })
            }
            if(!benevole){
                return res.status(404).json({
                    status: 404,
                    message: 'benevole non trouvé !'
                })
            }
            return res.status(204).json() 
        })
    },

    //update un benevole
    update: (req,res)=>{
        const id = req.params.id; // recupere id dans les parameteres de la requete
        const benevole = req.body; // recupere le body de la requete
        delete benevole._id; // si ya un id dans la reponse json recu je le supprime (va etre regenere par mongodb)
        //update le benevole
        BenevoleModel.updateOne({_id: id},{$set:{...benevole}}, (err,data)=>{
            if(err){
                return res.status(500).json({
                status: 500,
                message: 'Erreur when updating benevole.'
                })
            }
            // si tout ce passe bien
            return res.status(200).json({
                status: 200,
                message: 'Objet updated success!'
            })
        })
    },

    /**
     * removeMany : remove many benevole from the database
     * first it will parse the body.ids of the request to get the list of id
     * then it will remove all the benevole with the ids in the list
    */
    removeMany: (req,res)=>{
        const ids = req.body; // recupere la liste des id dans le body de la requete
        console.log(ids);
        BenevoleModel.deleteMany({_id: {$in: ids}}, (err, data)=>{
            if(err){
                return res.status(500).json({
                    status: 500,
                    message: 'Error when deleting many benevole',
                    error: err
                });
            }
            return res.status(204).json({
                status: 204,
                message: 'benevoles deleted success!'
            });
        })
    },

    // Update une affectation du benevole
    updateAffectation: (req, res) => {
        const id = req.params.id;
        const oldAffectation = req.body.oldAffectation;
        const newAffectation = req.body.newAffectation;
    
        BenevoleModel.updateOne({_id: id}, {$pull: {affectations: oldAffectation}}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Erreur lors de la suppression de l\'ancienne affectation.'
                });
            }
            BenevoleModel.updateOne({_id: id}, {$push: {affectations: newAffectation}}, (err, data) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Erreur lors de l\'ajout de la nouvelle affectation.'
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: 'Mise à jour de l\'affectation effectuée avec succès.'
                });
            });
        });
    },

    // Update lea liste des affectations du benevole
    updateAffectations: (req,res)=>{
        const id = req.params.id; // recupere id dans les paramteres de la requete
        const affectations = req.body // recuperer les affectations dans le body de la requete

        //update l'objet affecttaions de cet benevole
        BenevoleModel.updateOne({_id: id},{$set:{affectations : affectations}}, (err,data)=>{
            if(err){
                return res.status(500).json({
                status: 500,
                message: 'Erreur when updating affectations of benevole.'
                })
            }
            // si tout ce passe bien
            return res.status(200).json({
                status: 200,
                message: 'AFfectations updated success!'
            })
        })

    },

    // remove une affectation du benevole
    removeAffectation: (req, res) => {
        const id = req.params.id;
        const affectation = req.body;
    
        BenevoleModel.updateOne({_id: id}, {$pull: {affectations: affectation}}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Erreur lors de la suppression de l affectation du benevole.'
                });
            }
            return res.status(200).json({
                status: 200,
                message: 'suppression de l affectation du benevole effectuée avec succès.'
            });

        });
    },



}