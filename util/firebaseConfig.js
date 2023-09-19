import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyDdT-T2nPxKdxUDpST_4Y79mJPpefB7OWM",
  authDomain: "historyhunt-app.firebaseapp.com",
  databaseURL: "https://historyhunt-app-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "historyhunt-app",
  messagingSenderId: "270618766968",
  storageBucket: "historyhunt-app.appspot.com",
};

initializeApp(firebaseConfig);
export default firebaseConfig;

