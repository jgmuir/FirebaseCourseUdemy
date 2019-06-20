//this file was generated from the command "ng generate service (insert path here)"
//the above command generated courses.service.ts and courses.service.spec.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable, from } from 'rxjs';
import { convertSnaps } from './db-utils';
import { Lesson } from '../model/lesson';
import OrderByDirection = firebase.firestore.OrderByDirection;

//use service to inject Angular, don't do it directly from component
//the idea is that services interact with the database, and components interact with services

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private Adb: AngularFirestore) { }

  loadAllCourses(): Observable<Course[]>{
    //define the courses$ by assigning it the Observable returned by snapshotChanges
    //.pipe() to use map operator
    //map operator takes response from AngularFirestore and maps to list of courses
    //to query the collection, add a second argument to .collecion() which is the query function that is chosen
    //.orderBy() takes a field that it uses to sort the collection
    //.where() takes a field to filter the collection (don't use same field for both)
    return this.Adb.collection('courses',
      ref => ref.orderBy('seqNo'))
      .snapshotChanges()
      .pipe(map(snaps => convertSnaps<Course>(snaps)), first()); //first() completes the Observable so that database updates do not update immediately while user is using site
      //take(num) is similar to first, taking num updates before it stops updating
      
      //can't use .where() twice normally, need to go to firebase to create a composite index that accomplishes this
      //every query in firestore needs an index
      //all inequality checks need to be on the final field, equality checks are fine
      //order of fields in .where() is important, need different indexes for different orders
  }

  findCourseByUrl(courseUrl: string):Observable<Course>{
    return this.Adb.collection('courses',
      ref => ref.where("url", "==", courseUrl)
      ).snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps);
          return courses.length == 1 ? courses[0]:undefined; //since looking for only one course, use ternary operator to setup logic
        }),
        first() //the Observable needs to be forced to end after getting first value or else routing does not work
      )
  }

  findLessons(courseId:string, sortOrder:OrderByDirection = 'asc',
              pagesNumber = 0, pageSize = 3): Observable<Lesson[]> {
    //need to use path to the lessons collection
    //path to a collection is expected to have an odd number of path segments
    return this.Adb.collection(`courses/${courseId}/lessons`,
              ref => ref.orderBy('seqNo', sortOrder)
              .limit(pageSize)
              .startAfter(pagesNumber * pageSize))
            .snapshotChanges()
            .pipe(
              map(snaps => convertSnaps<Lesson>(snaps)),
              first()
            )
  }

  //Partial indictes we do not expect a complete change to the Course object
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    //path to a document is expected to have an even number of path segments
    //.update() is best for changing existing documents
    //.set() is best for creating new documents
    return from (this.Adb.doc(`courses/${courseId}`).update(changes));
  }
}
