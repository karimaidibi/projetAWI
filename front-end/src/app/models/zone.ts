// This class should have a constructor with a parameter for each property

export class Zone {
    _id!: string
    nom!: string

    constructor(_id : string,nom: string) {
        this._id = _id
        this.nom = nom
    }
}
