import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   loginUserForm:FormGroup;
   isSubmitted = false;
   loading =  false;
   errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    
    if(this.authService.isLoggedIn){
      this.router.navigate(['/dashboard']);
    }

    this.loginUserForm = this.formBuilder.group({
      username:['', [Validators.required, Validators.minLength(4)]],
      password:['', [Validators.required, Validators.minLength(5)]],
    })

   
  }

  get f() { return this.loginUserForm.controls }

  onSubmit() {
    this.isSubmitted = true;
     this.errorMessage = null;
    if(this.loginUserForm.invalid){
      return;
    }else{
      this.loading = true;
      this.authService.loginUser(this.loginUserForm.value)
        .subscribe( res => {
            this.router.navigate(['/dashboard']);
        },
        error => {
            this.loading = false;
         
            if(error.status === 400 ){
                  this.errorMessage = `<div class="alert alert-danger" role="alert">
              <p>${error.error.message}</p>
            </div>`
            } else{
              this.errorMessage = `<div class="alert alert-danger" role="alert">
              <p>Something went wrong. Please try again later!</p>
            </div>`
            }
        })
    }
  
  }
 
}
