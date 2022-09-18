import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByChild, onValue, orderByValue, set, update } from 'firebase/database';

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

const translation = {
    SetWord: function () {
        let randomWord = allWords[Math.floor(Math.random() * allWords.length)];

        const reference = ref(db, '/gameplay');
        update(reference, {
            word: randomWord,
        });

        return randomWord;
    },
    GetWord: function () {
        let word = "";
        const reference = ref(db, '/gameplay');
        onValue(reference, (snapshot) => {
            word = snapshot.val().word;
        });
        return word;
    },
    GetCorrectTranslation: function () {
        let translatedWord = "";
        let correctRef = ref(db, '/topics/Food/' + this.GetWord() + '/Translation');
        onValue(correctRef, (snapshot) => {
            translatedWord = snapshot.val();
        });
        return translatedWord;
    },
    GetIncorrectTranslation: function () {
        let wrongRandomWord = allWords[Math.floor(Math.random() * allWords.length)];
        let incorrectWord = "word";
        if (wrongRandomWord === this.GetWord) {
            this.GetIncorrectTranslation();
        } else {
            let incorrectRef = ref(db, '/topics/Food/' + wrongRandomWord + '/Translation');
            onValue(incorrectRef, (snapshot) => {
                incorrectWord = snapshot.val();
            });
        }
        return incorrectWord;
    },
    PilotStatus: function (status) {
        const reference = ref(db, '/gameplay/');
        let pilotStatus = status;
        if (pilotStatus === true || pilotStatus === false) {
            update(reference, {
                pilot: pilotStatus,
            });
        } else {
            onValue(reference, (snapshot) => {
                pilotStatus = snapshot.val().pilot;
            });
        }
        return pilotStatus;
    },
    GroundControlStatus: function (status) {
        const reference = ref(db, '/gameplay/');
        let gcStatus = status;
        if (gcStatus === true || gcStatus === false) {
            update(reference, {
                groundcontrol: gcStatus,
            });
        } else {
            onValue(reference, (snapshot) => {
                gcStatus = snapshot.val().groundcontrol;
            });
        }
        return gcStatus;
    },
    SetLives: function (lives) {
        const reference = ref(db, '/gameplay/');
        update(reference, {
            lives: lives,
        });
        return lives;
    },
    SetScore: function (score) {
        const reference = ref(db, '/gameplay/');
        update(reference, {
            score: score,
        });
        return score;
    }
}

export default translation;