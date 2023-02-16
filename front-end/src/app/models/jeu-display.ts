import { TypeJeu } from "./type-jeu"
import { Zone } from "./zone"


export class JeuDisplay {
    _id!: string
    nom!: string
    zone!: string
    idZone!: string
    typeJeu!: string
    idTypeJeu!: string
}

export const COLUMNS_SCHEMA = [
    {
        key: "nom",
        type: "text",
        label: "Nom"
    },
    {
        key: "typeJeu",
        type: "text",
        label: "Type"
    },
    {
        key: "zone",
        type: "text",
        label: "Zone"
    },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
  }
]