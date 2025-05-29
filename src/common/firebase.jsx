import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDqIePMwCU1GPkOkwni98NIMKJ25xz74k0",
  authDomain: "react-js-blog-website-54638.firebaseapp.com",
  projectId: "react-js-blog-website-54638",
  storageBucket: "react-js-blog-website-54638.appspot.com",
  messagingSenderId: "277574148092",
  appId: "1:277574148092:web:62bdbd4df3d43f8a71dc79"
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () =>{
    let user = null;
    await signInWithPopup(auth, provider)
    .then((result)=> {
        user = result.user
    })
    .catch((error)=> {
        console.log("error here",error)
    })
    return user;
}