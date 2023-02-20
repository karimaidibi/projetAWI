import { Affectation } from "./affectation"

export class Benevole {
    _id!: string
    prenom!: string
    nom!: string
    email!: string
    affectations!: Affectation[]

    constructor(_id : string ,prenom: string, nom: string, email: string, affectations: Affectation[]) {
        this._id = _id
        this.prenom = prenom
        this.nom = nom
        this.email = email
        this.affectations = affectations
    }
}

