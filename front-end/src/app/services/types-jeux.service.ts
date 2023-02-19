import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TypeJeu } from '../models/type-jeu';

@Injectable({
  providedIn: 'root'
})
export class TypesJeuxService {

// api url
api = environment.api;

// types jeux
typesJeux!: TypeJeu[];

// observable subject
typesJeux$ = new Subject<TypeJeu[]>();

constructor(
  private http: HttpClient
) { }

emitTypesJeux() {
  this.typesJeux$.next(this.typesJeux);
}

getTypesJeux() {
  this.http.get(this.api+'/typesJeux').subscribe({
    next:(data : any)=>{
      if(data.status===200){
        this.typesJeux = data.result;
        this.emitTypesJeux();
      }else{
        console.log("Erreur de chargement des types jeux (status !=200): ", data.message)
      }
    },
    error:(err)=>{
      console.log("Erreur de chargement des types jeux (error): ", err)
    }
  })
}
}
