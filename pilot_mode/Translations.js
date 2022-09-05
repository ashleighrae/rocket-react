import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByChild, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAd7AjsLt-KBNi0DpJMiEMlWyqOnxCIQ0I",
    authDomain: "rocketreact-156bb.firebaseapp.com",
    projectId: "rocketreact-156bb",
    storageBucket: "rocketreact-156bb.appspot.com",
    messagingSenderId: "374595628032",
    appId: "1:374595628032:web:ef9f7b69a768575e9a7ce5",
    measurementId: "G-2LCWT5DSCK"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getDatabase();
const allWords = ["Bread", "Chicken", "Fish", "Potatoes", "Yoghurt"];
let randomWord = "";
let translatedWord = "";
let incorrectWord = "";
let wrongRandomWord = "";

const translation = {
    GetWord: function () {
        randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (randomWord.length <= 0) {
            this.GetWord();
        }
        return randomWord;
    },
    GetCorrectTranslation: function () {
        if (randomWord.length <= 0) {
            GetCorrectTranslation();
        } else {
            let correctRef = ref(db, '/topics/Food/' + randomWord + '/Translation');
            onValue(correctRef, (snapshot) => {
                translatedWord = snapshot.val();

            });
        }
        return translatedWord;
    },
    GetIncorrectTranslation: function () {
        wrongRandomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (wrongRandomWord === randomWord || wrongRandomWord.length <= 0) {
            this.GetIncorrectTranslation();
        } else {
            let incorrectRef = ref(db, '/topics/Food/' + wrongRandomWord + '/Translation');
            onValue(incorrectRef, (snapshot) => {
                incorrectWord = snapshot.val();
            });
        }
        return incorrectWord;
    }
}

export default translation;