import {
    auth,
    db
}
from "./firebase-config.js";

import {

    createUserWithEmailAndPassword,

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
   CRIAR CONTA
========================== */

window.criarConta =
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

        const cred =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        await setDoc(
            doc(
                db,
                "usuarios",
                cred.user.uid
            ),
            {

                email,

                plano: "teste",

                status: "ativo",

                criadoEm:
                    new Date()

            }
        );

        mostrarMensagem(
            "✅ Conta criada com sucesso."
        );

    }

    catch (erro) {

        mostrarMensagem(
            erro.message
        );

    }

};

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

        mostrarMensagem(
            erro.message
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

                    email:
                        resultado.user.email,

                    plano:
                        "teste",

                    status:
                        "ativo",

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