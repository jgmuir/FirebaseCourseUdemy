import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI; //firebaseui instance

  constructor(private afAuth: AngularFireAuth, private router: Router, private ngZone: NgZone) {

  }

  ngOnInit() {
    //setting up FirebaseUI configuration
    const uiConfig = {
      //array of acceptable sign in options
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],

      //callbacks that are called when successful login
      callbacks: {
        signInSuccessWithAuthResult: this.onLoginSuccessful
          .bind(this) //good idea to .bind(this) to ensure everything is referring to same this
      }
    }
    this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth) //setup firebase ui with constructor, takes reference to global firebase sdk auth service (available thorugh AngularFire)
    this.ui.start('#firebaseui-auth-container', uiConfig); //add reference to container div from html, pass in uiConfiguration to initialize the firebaseui
  }

  ngOnDestroy() {
    this.ui.delete(); //deletes firebaseui so that the login page can be revisted as many times as needed
  }

  onLoginSuccessful(result) {
    console.log("Firebase UI result:", result); //showing output of the result that is produced
    //this.ngZone.run(() => this.router.navigateByUrl('/courses')); //use the router to navigate to courses if user logged in successfully
    //ngZone.run() may not be necessary, worked for me the first time without it
    this.router.navigateByUrl('/courses');
  }
}
