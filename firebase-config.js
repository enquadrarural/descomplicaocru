import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDQJwdRN_3lxM7bs6YVRiTnMDUGLHMojo0",

    authDomain: "descomplicaocru.firebaseapp.com",

    projectId: "descomplicaocru",

    storageBucket: "descomplicaocru.firebasestorage.app",

    messagingSenderId: "882021182112",

    appId: "1:882021182112:web:23878d82512344bb8b37c5",

    measurementId: "G-GRD4E443WX"

};

const app =
    initializeApp(firebaseConfig);

export const auth =
    getAuth(app);

export const db =
    getFirestore(app);