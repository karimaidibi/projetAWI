import { Affectation } from "./affectation"
import { Benevole } from "./benevole"

export class BenevoleDisplay {
    _id!: string
    prenom!: string
    nom!: string
    email!: string
    idAffectation!: string
    idZone!: string
    zone!: string
    debut_creneau!: any
    fin_creneau!: any
    date!: any
    isEdit!: boolean
    isSelected!: boolean
    rowId!: string

    // construct benevolerDisplay from benevole and affectation
    constructor(benevole: Benevole, affectation: Affectation, rowId: string) {
        this._id = benevole._id
        this.prenom = benevole.prenom
        this.nom = benevole.nom
        this.email = benevole.email
        this.idAffectation = affectation._id || ""
        this.idZone = affectation.zone._id || ""
        this.zone = affectation.zone.nom || ""
        this.debut_creneau = affectation.creneau.debut_creneau || ""
        this.fin_creneau = affectation.creneau.fin_creneau || ""
        this.date = affectation.creneau.date || ""
        this.isEdit = false
        this.isSelected = false
        this.rowId = rowId
    }

}

export const BENEVOLE_DISPLAY_COLUMNS_SCHEMA = [
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
        key: "zone",
        type: "selectZone",
        label: "Zone",
        required: true
    },
    {
        key: "debut_creneau",
        type: "time",
        label: "Début du créneau",
        required: true
    },
    {
        key: "fin_creneau",
        type: "time",
        label: "Fin du créneau",
        required: true
    },
    {
        key: "date",
        type: "date",
        label: "Date",
        required: true
    },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]