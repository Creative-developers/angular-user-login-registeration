import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: Object = {};

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
 ){

  this.authService.getLoggedInUserProfile(this.authService.getAccessToken()).subscribe(data => {
    if(data.user !== null){
      this.currentUser = data.user;
    }else{
      alert('Something went wrong!');
    }
  }, error => {
    alert(error);
  })
 }

  ngOnInit() {
  }

  logout(){
   
    this.authService.logout();
  }

}
