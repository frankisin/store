import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSNA0U4qDihU4LU_seLn9jHbrAkBOAGvY",
  authDomain: "stockers-f1405.firebaseapp.com",
  projectId: "stockers-f1405",
  storageBucket: "stockers-f1405.appspot.com",
  messagingSenderId: "1078745352010",
  appId: "1:1078745352010:web:3af558e84fd6ca9e8aa3b3",
  measurementId: "G-PFEZ7CFZ31"
};

//Always add new components to Bootstrap Array!
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),provideHttpClient(), provideAnimations()]
}).catch((err)=>console.log(err));
