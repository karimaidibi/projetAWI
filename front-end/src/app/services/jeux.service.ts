import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Jeu } from '../models/jeu';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JeuxService {

  // api url
  api = environment.api;

  // jeux
  jeux!: Jeu[];

  // observable subject
  jeux$ = new Subject<Jeu[]>();

  constructor(
    private http: HttpClient
  ) { }

  emitJeux() {
    this.jeux$.next(this.jeux);
  }

  getJeux() {
    this.http.get(this.api+'/jeux').subscribe({
      next:(data : any)=>{
        if(data.status===200){
          this.jeux = data.result;
          this.emitJeux();
        }else{
          console.log("Erreur de chargement des jeux (status !=200): ", data.message)
        }
      },
      error:(err)=>{
        console.log("Erreur de chargement des jeux (error): ", err)
      }
    })
  }

  createNewJeu(jeu: Jeu){
    return new Promise((resolve,reject)=>{
      this.http.post(this.api+'/jeux',jeu).subscribe({
        next:(data:any)=>{
          if(data.statux===201){
            this.getJeux()
            resolve(data)
          }else{
            console.log("Erreur de création du jeu (status !=201): ", data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de création du jeu (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Création du jeu terminée")
        }
      })
    })
  }

  updateJeu(id: string, jeu : Jeu){
    return new Promise((resolve, reject)=>{
      this.http.put(this.api+'/jeux/'+id, jeu).subscribe({
        next:(data:any)=>{
          if(data.statu===200){
            this.getJeux()
            resolve(data)
          }else{
            console.log("Erreur de mise à jour du jeu (status !=200): ", data.message)
            reject(data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de mise à jour du jeu (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Mise à jour du jeu terminée")
        }
      })
    })
  }
}
