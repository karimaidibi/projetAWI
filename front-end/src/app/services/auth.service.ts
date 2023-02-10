import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.api;

  token: string | null = "" ;

  userId!: string | null;

  /* status de connexion
    - false par defaut
    - true durant la session connecté
  */
  isAuth$ = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient,
    private router : Router) {this.initAuth()}

  // commenter la methode init Auth
  initAuth(){
    if(typeof localStorage !== "undefined"){
      let data = localStorage.getItem('auth')
      if (data) {
        let donne : any = JSON.parse(data)
        if(donne.userId && donne.token){
          this.userId = donne.userId;
          this.token = donne.token;
          this.isAuth$.next(true) // tjrs connecté
        }
      }
    }
  }

  /*Une fonction qui permet d'authentifier lutilisateur*/
  signin(email: any, password: any){
    return new Promise((resolve,reject)=>{
      this.http.post(this.api+'/users/login', {email: email, password: password})
      .subscribe(
        {
          next : (authData: any)=>{
            this.token = authData.token
            this.userId = authData.userId
            this.isAuth$.next(true);
            // save authData en local afin de stocker les infos users sur son navigateur
            if(typeof localStorage !== "undefined"){
              localStorage.setItem('auth', JSON.stringify(authData))
            }
            this.router.navigate(['/home'])
            resolve(true)
          },
          error: (err)=>{
            reject(err)
          },
          complete: ()=>{
            console.log("user sign in ok")
          }
        }
      )
    });
  }

  /*Une fonction qui permet de terminer la session active de l'utilsateur connecté*/
  logout(){
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
    if(typeof localStorage !== "undefined"){
      localStorage.setItem('auth',"")
      localStorage.setItem('cart','')
      localStorage.setItem('favoris','')
    }
  }
  
}
