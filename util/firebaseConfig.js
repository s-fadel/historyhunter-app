import { initializeApp } from "firebase/app"
// import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDdT-T2nPxKdxUDpST_4Y79mJPpefB7OWM",
  authDomain: "historyhunt-app.firebaseapp.com",
  databaseURL: "https://historyhunt-app-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "historyhunt-app",
  messagingSenderId: "270618766968",
  storageBucket: "historyhunt-app.appspot.com",
};

// Initialisera Firebase om det inte redan är initialiserat
initializeApp(firebaseConfig);
// Exportera Firebase-objektet
export default firebaseConfig;


/* import firebase from './firebase'; // Ange rätt sökväg

// Exempel på hur du hämtar data från Realtime Database
const database = firebase.database();

database.ref('users').once('value')
  .then(snapshot => {
    const usersData = snapshot.val();
    console.log(usersData);
  })
  .catch(error => {
    console.error(error);
  }); */
