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
let randomWord = allWords[Math.floor(Math.random() * allWords.length)];
let wrongRandomWord = allWords[Math.floor(Math.random() * allWords.length)];
const reference = ref(db, '/topics/Food/' + randomWord + "/Word");
const wrongRef = ref(db, '/topics/Food/' + wrongRandomWord + "/Translation");
let data = "";
let translatedWord = "";
let incorrectWord = "";

const translation = {
    GetWord: function () {
        onValue(reference, (snapshot) => {
            data = snapshot.val();

        });
        return data;
    },
    GetWrongWord: function () {
        if (wrongRandomWord != randomWord) {
            const wrongRef = ref(db, '/topics/Food/' + wrongRandomWord + "/Translation");
            onValue(wrongRef, (snapshot) => {
                incorrectWord = snapshot.val();
            });
        } else {
            this.GetWrongWord();
        }        
    },
    GetCorrectTranslation: function () {
        const correctRef = ref(db, '/topics/Food/' + randomWord + "/Translation");
        onValue(correctRef, (snapshot) => {
            translatedWord = snapshot.val();

        });
        return translatedWord;
    },
    GetIncorrectTranslation: function () {
        this.GetWrongWord();
        return incorrectWord;
    }
}

export default translation;