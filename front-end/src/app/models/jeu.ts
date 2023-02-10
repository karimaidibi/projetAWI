import { TypeJeu } from "./type-jeu"
import { Zone } from "./zone"

export class Jeu {
    _id!: string
    nom!: string
    zone!: Zone
    typeJeu!: TypeJeu
}
