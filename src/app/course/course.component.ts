import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {tap, finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;

  lessons: Lesson[];

  lastPageLoaded = 0;

  loading = false; //flag for whether loading icon displays or not

  displayedColumns = ['seqNo', 'description', 'duration'];


  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService) {


  }

  ngOnInit() {

    this.course = this.route.snapshot.data['course'];

    this.loading = true;

    this.coursesService.findLessons(this.course.id)
      .pipe(
        finalize(() => this.loading = false) //failsafe to end loading both when finishes or errors out
      )
      .subscribe(
        lessons => this.lessons = lessons
      );

  }

  loadMore() {
    this.lastPageLoaded++; //increment last page loaded variable

    this.loading = true;
    //pass the values necessary for .findLessons() so that lastPageLoaded takes effect
    this.coursesService.findLessons(this.course.id, 'asc',
        this.lastPageLoaded)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe(lessons => this.lessons = this.lessons.concat(lessons))
  }


}
