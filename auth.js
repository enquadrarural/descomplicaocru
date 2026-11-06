import {
    auth,
    db
}
from "./firebase-config.js";

import {

    signInWithEmailAndPassword,

    sendPasswordResetEmail,

    GoogleAuthProvider,

    signInWithPopup,

    onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

    doc,

    setDoc,

    getDoc

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   MENSAGENS
========================== */

function mostrarMensagem(texto) {

    const msg =
        document.getElementById(
            "mensagem"
        );

    if (msg) {

        msg.innerHTML = texto;

    }

}

/* ==========================
   LOGIN EMAIL
========================== */

window.loginEmail =
async function () {

    const email =
        document
            .getElementById("email")
            .value;

    const senha =
        document
            .getElementById("senha")
            .value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        window.location.href =
            "index.html";

    }

    catch (erro) {

        let mensagem =
            erro.message;

        if (
            erro.code ===
            "auth/invalid-credential"
        ) {

            mensagem =
                "E-mail ou senha inválidos.";

        }

        if (
            erro.code ===
            "auth/user-not-found"
        ) {

            mensagem =
                "Usuário não encontrado.";

        }

        mostrarMensagem(
            mensagem
        );

    }

};

/* ==========================
   LOGIN GOOGLE
========================== */

window.loginGoogle =
async function () {

    const provider =
        new GoogleAuthProvider();

    try {

        const resultado =
            await signInWithPopup(
                auth,
                provider
            );

        const uid =
            resultado.user.uid;

        const usuarioRef =
            doc(
                db,
                "usuarios",
                uid
            );

        const usuarioSnap =
            await getDoc(
                usuarioRef
            );

        if (!usuarioSnap.exists()) {

            await setDoc(
                usuarioRef,
                {

                    nome:
                        resultado.user.displayName,

                    email:
                        resultado.user.email,

                    plano:
                        "trial",

                    status:
                        "ativo",

                    diasTrial:
                        7,

                    criadoEm:
                        new Date()

                }
            );

        }

        window.location.href =
            "index.html";

    }

    catch (erro) {

        mostrarMensagem(
            erro.message
        );

    }

};

/* ==========================
   RECUPERAR SENHA
========================== */

window.recuperarSenha =
async function () {

    const email =
        document
            .getElementById("email")
            .value;

    if (!email) {

        mostrarMensagem(
            "Informe seu e-mail."
        );

        return;

    }

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        mostrarMensagem(
            "✅ E-mail de recuperação enviado."
        );

    }

    catch (erro) {

        mostrarMensagem(
            erro.message
        );

    }

};

/* ==========================
   SESSÃO
========================== */

onAuthStateChanged(
    auth,

    usuario => {

        if (
            usuario &&
            window.location.pathname
                .includes(
                    "login.html"
                )
        ) {

            window.location.href =
                "index.html";

        }

    }

);