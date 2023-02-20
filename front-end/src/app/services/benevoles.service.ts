import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Benevole } from '../models/benevole';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Affectation } from '../models/affectation';

@Injectable({
  providedIn: 'root'
})
export class BenevolesService {

  // api url
  api = environment.api;

  // benevoles
  benevoles!: Benevole[];

  // observable subject
  benevoles$ = new Subject<Benevole[]>();

  // benevole
  benevole!: Benevole;

  // observable subject benevole
  benevole$ = new Subject<Benevole>();

  constructor(
    private http: HttpClient
  ) { }

  emitBenevoles() {
    this.benevoles$.next(this.benevoles);
  }

  emitBenevole() {
    this.benevole$.next(this.benevole);
  }

  getBenevoles(){
    this.http.get(this.api+'/benevoles').subscribe({
      next:(data : any)=>{
        if(data.status===200){
          this.benevoles = data.result
          this.emitBenevoles()
        }else{
          console.log("Erreur de chargement des benevoles (status !=200): ",data.message)
        }
      },
      error:(error)=>{
        console.log("Erreur de chargement des benevoles (error): ",error)
      }

    })
  }

  getBenevoleById(id: string){
      this.http.get(this.api+'/benevoles/'+id).subscribe({
        next:(data: any)=>{
          if(data.status===200){
            this.benevole = data.result
            this.emitBenevole()
          }else{
            console.log("Erreur de chargement du benevole (status !=200): ",data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de chargement du benevole (error): "+err)
        }
      })
  }

  createBenevole(benevole: Benevole){
    return new Promise((resolve,reject)=>{
      this.http.post(this.api+'/benevoles',benevole).subscribe({
        next:(data:any)=>{
          if(data.status===201){
            this.getBenevoles()
            resolve(data)
          }else{
            console.log("Erreur de création du benevole (status !=201): ", data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de création du benevole (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Création du benevole terminée")
        }
      })
    })
  }

  updateBenevole(id: string, benevole : Benevole){
    return new Promise((resolve, reject)=>{
      this.http.put(this.api+'/benevoles/'+id, benevole).subscribe({
        next:(data:any)=>{
          if(data.status===200){
            this.getBenevoles()
            resolve(data)
          }else{
            console.log("Erreur de mise à jour du benevole (status !=200): ", data.message)
            reject(data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de mise à jour du benevole (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Mise à jour du benevole terminée")
        }
      })
    })
  }

  deleteBenevole(id: string){
    return new Promise((resolve, reject)=>{
      this.http.delete(this.api+'/benevoles/'+id).subscribe({
        next:(data:any)=>{
            this.getBenevoles()
            resolve(data)
          },
        error:(err)=>{
          console.log("Erreur de suppression du benevole (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Suppression du benevole terminée")
        }
      })
    })
  }

  /**
  * deleteBenevoles
  * @param ids : array of benevoles ids
  * @returns Promise 
  */
   deleteBenevoles(ids: string[]){
    return new Promise((resolve, reject)=>{
      this.http.post(this.api+'/benevoles/removeMany',ids).subscribe({
        next:(data:any)=>{
            this.getBenevoles()
            resolve(data)
          },
        error:(err)=>{
          console.log("Erreur de suppression des benevoles (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Suppression des benevoles terminée")
        }
      })
    })
  }

  // Affectations Management

  updateAffectations(id: string, affectations : Affectation[]){
    return new Promise((resolve, reject)=>{
      this.http.put(this.api+'/benevoles/'+id+'/affectations', affectations).subscribe({
        next:(data:any)=>{
          if(data.status===200){
            this.getBenevoles()
            this.getBenevoleById(id)
            resolve(data)
          }else{
            console.log("Erreur de mise à jour des affectations du benevole (status !=200): ", data.message)
            reject(data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de mise à jour des affectations du benevole (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Mise à jour des affectations du benevole terminée")
        }
      })
    })
  }

  deleteAffectation(id: string, affectation : Affectation){
    return new Promise((resolve, reject)=>{
      this.http.put(this.api+'/benevoles/'+id+'/affectation', affectation).subscribe({
        next:(data:any)=>{
          if(data.status===200){
            this.getBenevoles()
            this.getBenevoleById(id)
            resolve(data)
          }else{
            console.log("Erreur de supression de l'affectation du benevole (status !=200): ", data.message)
            reject(data.message)
          }
        },
        error:(err)=>{
          console.log("Erreur de supression de l'affectation du benevole (error): ", err)
          reject(err)
        },
        complete:()=>{
          console.log("Supression de l'affectation du benevole terminée")
        }
      })
    })
  }

}
