import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard  } from './auth.guard';

import bootstrap from 'bootstrap'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path:'login',
        component: LoginComponent
      },
      {
          path:"register",
          component: RegisterComponent
      },
      {
        path:'',
        redirectTo:'/dashboard',
        pathMatch:'full',
      },
      {
        path:'dashboard',
        component: HomeComponent,
        canActivate:[AuthGuard]
      }
    ])
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
