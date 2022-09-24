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

const translation = {
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
    },
    SetTopic: function (topic) {
        const reference = ref(db, '/gameplay/');
        update(reference, {
            topic: topic,
        });
        return topic;
    },
    SetGameOver (isGameOver) {
        const reference = ref(db, '/gameplay/');
        update(reference, {
            isGameOver: isGameOver,
        });
        return isGameOver;
    }
}

export default translation;