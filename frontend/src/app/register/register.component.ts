import { Directive, Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUserForm:FormGroup;
  isSubmitted = false;
  errorMessage:string;
  loading =  false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el:ElementRef, 
  ) { }

  ngOnInit() {
     
    if(this.authService.isLoggedIn){
      this.router.navigate(['/dashboard']);
    }

    this.registerUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email,  Validators.minLength(5)]],
      username: ['', [Validators.required,Validators.minLength(4)]],
      password:['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
    },
    {validator: this.checkIfMatchingPasswords('password', 'confirmPassword')}
    )
    

  }

  checkIfMatchingPasswords(passwordKey:string, confirmPasswordKey:string){
      return (group:FormGroup) => {
        let passwordInput =  group.controls[passwordKey],
           confirmPasswordInput = group.controls[confirmPasswordKey];
        
        if(confirmPasswordInput.errors  && !confirmPasswordInput.errors.notEquivalent){
          return;
        }

        if(passwordInput.value !== confirmPasswordInput.value){
          return confirmPasswordInput.setErrors({notEquivalent:true})
        }else{
          return confirmPasswordInput.setErrors(null)
        }
      } 
  }

  get f() { return this.registerUserForm.controls }


  onSubmit(){
    this.isSubmitted = true;
    this.errorMessage = null;
    
    if(this.registerUserForm.invalid){
      return;
    }else{
      this.loading = true;
      const { confirmPassword, ...userData} =  this.registerUserForm.value;
      this.authService.registerUser(userData).subscribe((res) => {
        this.loading = false;
         if(res.success){
            this.registerUserForm.reset()
            this.router.navigate(['login']);
         }
      }, (error) => {
        this.loading = false;
         console.log(error);
        this.errorMessage = `<div class="alert alert-danger" role="alert">
        <p>${error}</p>
      </div>`
      })
  }


}}
