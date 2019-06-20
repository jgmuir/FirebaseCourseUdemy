
import {COURSES, findLessonsForCourse} from './db-data';

import * as firebase from 'firebase';

//below is configuration for specific firebase database this app is using
var config = {
  apiKey: "AIzaSyAw-T7SOawmXHLN98SjmBH9AQdYek6Yu9M",
  authDomain: "fir-course-f9568.firebaseapp.com",
  databaseURL: "https://fir-course-f9568.firebaseio.com",
  projectId: "fir-course-f9568",
  storageBucket: "fir-course-f9568.appspot.com",
  messagingSenderId: "597430100518",
  appId: "1:597430100518:web:319371476d5d2358"
};

console.log("Uploading data to the database with the following config:\n");

console.log(JSON.stringify(config));

console.log("\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n");

firebase.initializeApp(config);

const db = firebase.firestore();

async function uploadData() {

  var batch = db.batch();

  const courses = db.collection('courses');


  Object.values(COURSES)
    .sort((c1:any, c2:any) => c1.seqNo - c2.seqNo)
    .forEach(async (course:any) => {

      const newCourse = removeId(course);

      const courseRef = await courses.add(newCourse);

      const lessons = courseRef.collection("lessons");

      const courseLessons = findLessonsForCourse(course.id);

      //console.log(`Adding ${courseLessons.length} lessons to ${course.description}`);

      courseLessons.forEach(async lesson => {

        const newLesson = removeId(lesson);

        await lessons.add(newLesson);

      });

    });

  return batch.commit();
}


function removeId(data:any) {

  const newData: any = {...data};

  delete newData.id;

  return newData;
}


uploadData()
  .then(() => {
    console.log("Writing data, exiting in 10 seconds ...\n\n");

    setTimeout(() => {

      console.log("\n\n\nData Upload Completed.\n\n\n");
      process.exit(0);

    }, 10000);

  })
  .catch(err => {
    console.log("Data upload failed, reason:", err, '\n\n\n');
    process.exit(-1);
  });


