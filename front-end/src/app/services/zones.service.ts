import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Zone } from './../models/zone';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  //URL de l'api stoqué comme variable d'environnement
  api = environment.api;
  // leq artistes
  zones!: Zone[]
  // observable artistes
  zones$ = new Subject<Zone[]>()

  constructor(private http: HttpClient) { }

  // Fonction qui permet de mettre à jour l'observable zones
  emitZones(){
    this.zones$.next(this.zones)
  }

  // Fonction qui permet de demander la liste de toutes les zones à partir de l'api de l'application backend
  getZones(){
    this.http.get(this.api+'/zones').subscribe({
      next:(data : any)=>{
        if(data.status===200){
          this.zones = data.result
          this.emitZones()
        }else{
          console.log("Erreur de chargement des jeux (status !=200): ",data.message)
        }
      },
      error:(error)=>{
        console.log("Erreur de chargement des jeux (error): ",error)
      }

    })
  }


}
