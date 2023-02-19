import { TypeJeu } from "./type-jeu"
import { Zone } from "./zone"


export class JeuDisplay {
    _id!: string
    nom!: string
    zone!: string
    idZone!: string
    typeJeu!: string
    idTypeJeu!: string
    isEdit!: boolean
    isSelected!: boolean
}

export const COLUMNS_SCHEMA = [
    {
        key: "isSelected",
        type: "isSelected",
        label: ""
    },
    {
        key: "nom",
        type: "text",
        label: "Nom",
        required: true
    },
    {
        key: "typeJeu",
        type: "selectTypeJeu",
        label: "Type",
        required: true
    },
    {
        key: "zone",
        type: "selectZone",
        label: "Zone",
        required: false
    },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]