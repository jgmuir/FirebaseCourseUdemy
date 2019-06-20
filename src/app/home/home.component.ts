import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CoursesService } from '../services/courses.service';

//Components get the data from the services

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    courses$ :Observable<Course[]>; //Observable, data that the home component recieves
    beginnersCourses$ : Observable<Course[]>;
    advancedCourses$ : Observable<Course[]>;

    //not directly using database, uses service
    constructor(private coursesService: CoursesService) {

    }

    ngOnInit() {
        this.reloadCourses(); //same logic applies to both places
    }

    reloadCourses(){
        this.courses$ = this.coursesService.loadAllCourses(); //Observable still live, can emit new values over time

        //define the Observables
        //take the original courses$, pipe it to map operator
        //use .filter() to remove unwanted elements
        this.beginnersCourses$ = this.courses$.pipe(
            map(courses => courses.filter(
                course => course.categories.includes("BEGINNER"))));
        
        this.advancedCourses$ = this.courses$.pipe(
            map(courses => courses.filter(
                course => course.categories.includes("ADVANCED"))));
    }

}
