import {Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseEdited = new EventEmitter();

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = course;

        this.dialog.open(CourseDialogComponent, dialogConfig)
            .afterClosed() //.afterClosed() emits a value whenever the dialog gets closed
            .subscribe(val => {
                if(val) {
                    this.courseEdited.emit(); //emit event if some data has been modified
                }
            });

    }

}









