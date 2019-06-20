import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    isLoggedIn$: Observable<boolean>; //Observable to determine if a user is logged in
    isLoggedOut$: Observable<boolean>; //Observable to determine if a user is logged out
    pictureUrl$: Observable<string>; //Observable to hold picture for user

    constructor(private afAuth: AngularFireAuth) {

    }

    ngOnInit() {
      this.afAuth.authState.subscribe(user => console.log(user));
      this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user)); //double negation turns the variable into a boolean
      this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
      this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user ? user.photoURL: null));
      //go to html to change what hapens based on these flags
    }

    logout() {
      this.afAuth.auth.signOut();
    }

}
