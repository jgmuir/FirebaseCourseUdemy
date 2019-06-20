import { Component, OnInit, ViewEncapsulation } from '@angular/core';

//import the firebase sdk into this file
import * as firebase from 'firebase/app';
//import the firestore functionality into this file
import 'firebase/firestore';
import { Course } from '../model/course';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
//the firebase sdk is modular; only import the parts needed to the app
/*
//below is configuration for specific firebase database this app is using
const config = {
  apiKey: "AIzaSyAw-T7SOawmXHLN98SjmBH9AQdYek6Yu9M",
  authDomain: "fir-course-f9568.firebaseapp.com",
  databaseURL: "https://fir-course-f9568.firebaseio.com",
  projectId: "fir-course-f9568",
  storageBucket: "fir-course-f9568.appspot.com",
  messagingSenderId: "597430100518",
  appId: "1:597430100518:web:319371476d5d2358"
};
firebase.initializeApp(config); //pass db configuration into the firebase sdk
//reference to the db
const db = firebase.firestore();
*/
@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private Adb: AngularFirestore) { //inject AngulaFirestore here in constructor

  }

  ngOnInit() {
    /*
    //the below has all been directly working with the firebase db, can use AngularFire instead
    //.doc() queries for a document in the database, takes in a path to document (does not grab a nested collection)
    //.get() returns the Promise of a Snapshot (type determined by what is queried)
    //.then() instructs what happens next, takes an anonymous function
    db.doc('courses/socohJH4gYQtDi7ZjZOD')
      .get()
      .then(snap => console.log(snap.data())); //snap methods allow access to document data 

   //.collection() queries a full collection, takes in path to collection
    db.collection('courses').get()
      .then(snaps => {
        //declare Course array (defined by instrcutor) and initialize it with the ids and data
        const courses : Course[] = snaps.docs.map(snap => {
          return <Course>{
            id: snap.id,
            ...snap.data()
          }
        });
        //console.log(snaps.docs.map(snap => snap.data())); //outputs to console arrays of Course data from collection, no ids
        //console.log(snaps.docs.map(snap => snap.id)); //outputs to console array of ids
        console.log(courses); //output to console the Course Array with all data
      });
      */

     //AngularFire methods//
     //AngularFire provides with an Observable based api (allows for development using Reactive approach)

     //look at what Observables return by .subscribe() on them
     //.valueChanges() corresponds to .data() from the firebase db
     //.valueChanges() gives a live connection to the firestore db (emits current state of collection as it gets modified)
     //this.Adb.collection('courses').valueChanges()
     // .subscribe(val =>console.log(val));
     
     //.snapshotChanges() shows collction of document snapshots
     //.snapshotChanges() emits the current state of the entire collection (complete data)
     /*
     this.Adb.collection('courses').snapshotChanges()
      .subscribe(snaps => {
        const courses: Course[] = snaps.map(snap => {
          return <Course> {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data()
          }
        })
        console.log(courses);
      });
      */
      //.stateChanges() only emits changed documents
      //this.Adb.collection('courses').stateChanges()
      // .subscribe(snaps =>console.log(snaps));

      //two examples of acquiring a reference in different ways
      const courseRef = this.Adb.doc('/courses/socohJH4gYQtDi7ZjZOD')
        .snapshotChanges()
        .subscribe(snap => {
          const course:any = snap.payload.data();
          console.log('course.relatedCourseRef', course.relatedCourseRef);
        });
      
        const ref = this.Adb.doc('courses/U60ro3Tuuk31ZUkSCJv1')
          .snapshotChanges()
          .subscribe(
            doc => console.log("ref", doc.payload.ref)
          );
  }

  //better practice to have code in functions and not crammed in NgOnInit
  save() {
    //example of a batched writ
    const firebaseCourseRef = this.Adb.doc('/courses/socohJH4gYQtDi7ZjZOD').ref; //reference to a course
    const rxjsCourseRef = this.Adb.doc('/courses/U60ro3Tuuk31ZUkSCJv1').ref;

    const batch = this.Adb.firestore.batch(); //a batch instance

    batch.update(firebaseCourseRef, {titles: {description: 'Firebase Course'}});
    batch.update(rxjsCourseRef, {titles: {description: 'RxJs Course'}});
    const batch$ = of(batch.commit()); //.commit() applies all changes the batch has made at once; of() takes a Promise and turns it into an Observable
    batch$.subscribe(); 
  }

  //async and await keywords helpful for dealing with Promises
  async runTransaction() {
    const newCounter = await this.Adb.firestore.runTransaction(async transaction => {
      console.log('Running transaction...');
      const courseRef = this.Adb.doc('/courses/socohJH4gYQtDi7ZjZOD').ref;

      //using a transaction creates a Read-lock on the data while being read
      const snap = await transaction.get(courseRef);
      const course = <Course> snap.data();
      const lessonsCount = course.lessonsCount + 1;
      transaction.update(courseRef, {lessonsCount});
      return lessonsCount; //return values from transaction, don't decalare them in a higher scope
    })
  }

}
