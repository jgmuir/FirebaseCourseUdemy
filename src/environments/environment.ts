// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //the following allows AngularFire to know which db to connect to
  //firebase is optimized for frequent reads, not frequent writes
  firebase: {
    apiKey: "AIzaSyAw-T7SOawmXHLN98SjmBH9AQdYek6Yu9M",
    authDomain: "fir-course-f9568.firebaseapp.com",
    databaseURL: "https://fir-course-f9568.firebaseio.com",
    projectId: "fir-course-f9568",
    storageBucket: "fir-course-f9568.appspot.com",
    messagingSenderId: "597430100518",
    appId: "1:597430100518:web:319371476d5d2358"
  }
};
