import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyAZ3Dh-ZqqJS1D-clidxADI7hinoetibwc",
    authDomain: "sigelo-pass.firebaseapp.com",
    projectId: "sigelo-pass",
    storageBucket: "sigelo-pass.appspot.com",
    messagingSenderId: "282139028582",
    appId: "1:282139028582:web:a37ca817af2eee7483d1a7",
    measurementId: "G-VVB2ZJFFD2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;