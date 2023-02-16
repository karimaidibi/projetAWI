import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm!: FormGroup;
  errorMessage!: string;
  loading: boolean = false

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initSignIpForm()
  }

  // initialiser le formulaire de signin
  initSignIpForm(){
    this.signInForm = this.formBuilder.group({
      /*validator required, email, mail length, max length*/
      email: this.formBuilder.control("", [Validators.required, Validators.email]),
      password: this.formBuilder.control("", [Validators.required,Validators.minLength(5)]),
    })
  }

  // valider le formulaire
  onSubmit() :void{
    this.loading = true

    let email = this.signInForm.get('email');
    if (email){
      email = email.value
    }
    let password = this.signInForm.get('password');
    if(password){
      password = password.value
    }
    this.authService.signin(email,password)
    .then(()=>{
      this.loading = false
      this.router.navigate(['/home'])
      this.refreshPage()
    })
    .catch((err)=>{
      this.loading = false
      console.log(err.message)
      if(err.status===404){
        this.errorMessage = "l'adresse email est incorrecte"
      }else if(err.status === 401){
        this.errorMessage = "Votre mot de pass est incorrecte, veuillez réessayer"
      }else{
        this.errorMessage = err.message
      }
    })
  }

  // Function pour reload the application
  refreshPage() {
    window.location.reload();
  }


}
