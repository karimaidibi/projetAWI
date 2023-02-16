import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'festivalJeux-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth!: boolean
  // private adminId = environment.ADMIN_ID
  // isAdmin!:boolean
  userId! : any
  // resume!: any

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    // vérifier si user est connecté
    this.VerifSignIn()
  }

  // assigner is auth a true is user est connecté
  VerifSignIn() : void {
    this.authService.isAuth$.subscribe(
      (bool: boolean) =>{
        this.isAuth = bool
        this.userId = this.authService.userId
      }
    )
  }

  logout(){
    this.authService.logout()
    window.location.reload();
  }

}
