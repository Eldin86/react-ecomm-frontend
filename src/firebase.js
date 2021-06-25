import firebase from 'firebase'
import "firebase/auth";

// Your web app's Firebase configuration
//We get this data when we register and create new app in firebase
const firebaseConfig = {
    apiKey: "AIzaSyAYHv4Z8eyJV66RqWciNWHTopoCcvRs02o",
    authDomain: "ecommerce-9e089.firebaseapp.com",
    projectId: "ecommerce-9e089",
    storageBucket: "ecommerce-9e089.appspot.com",
    messagingSenderId: "673289479511",
    appId: "1:673289479511:web:ed1d660f98020d80210a12"
};
// initialize firebase app
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

//export 
//Allow to login and register user
export const auth = firebase.auth();
//Allows us to use Google login
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();