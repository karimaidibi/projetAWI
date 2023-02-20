import { Affectation } from "./affectation"
import { Benevole } from "./benevole"

export class CrudBenevoleDisplay {
    _id!: string
    prenom!: string
    nom!: string
    email!: string
    affectations!: Affectation[]
    isEdit!: boolean
    isSelected!: boolean

    constructor(benevole: Benevole) {
        this._id = benevole._id
        this.prenom = benevole.prenom
        this.nom = benevole.nom
        this.email = benevole.email
        this.affectations = benevole.affectations
        this.isEdit = false
        this.isSelected = false
    }
}

export const BENEVOLE_COLUMNS_SCHEMA = [
    {
        key: "isSelected",
        type: "isSelected",
        label: ""
    },
    {
        key: "prenom",
        type: "text",
        label: "Prénom",
        required: true
    },
    {
        key: "nom",
        type: "text",
        label: "Nom",
        required: true
    },
    {
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        pattern: '.+@.+'
    },
    {
        key: "affectations",
        type: "affectations",
        label: "Nombre d'Affectations",
        required: false
    },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]
