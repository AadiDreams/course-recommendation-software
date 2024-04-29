import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGnHliNxthPiirMurAyoo23mJsb7GOYD0",
    authDomain: "career-craft-96422.firebaseapp.com",
    projectId: "career-craft-96422",
    storageBucket: "career-craft-96422.appspot.com",
    messagingSenderId: "562722312371",
    appId: "1:562722312371:web:4504674defbe7d02ace0c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById('register');
submit.addEventListener("click",function(event) {
    event.preventDefault()

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Account Created! Please Sign In")
            window.location.href = "login.html";
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        });
})