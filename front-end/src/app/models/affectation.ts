import { Creneau } from "./creneau";
import { Zone } from "./zone";
import { v4 as uuidv4 } from 'uuid';

export class Affectation {
    _id!: string
    zone!: Zone
    creneau!: Creneau

    constructor(zone: Zone, creneau: Creneau, _id?: string) {
        // generate a random id
        this._id = _id || uuidv4()
        this.zone = zone
        this.creneau = creneau
    }
}
