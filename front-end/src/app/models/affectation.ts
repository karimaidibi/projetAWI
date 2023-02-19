import { Creneau } from "./creneau";
import { Zone } from "./zone";

export class Affectation {
    zone!: Zone
    creneau!: Creneau

    constructor(zone: Zone, creneau: Creneau) {
        this.zone = zone
        this.creneau = creneau
    }
}
