import {
    auth,
    db
}
from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   PROTEÇÃO DE PÁGINAS
========================== */

onAuthStateChanged(
    auth,

    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }

        try {

            const usuarioRef =
                doc(
                    db,
                    "usuarios",
                    user.uid
                );

            const usuarioSnap =
                await getDoc(
                    usuarioRef
                );

            if (!usuarioSnap.exists()) {

                await signOut(auth);

                window.location.href =
                    "login.html";

                return;

            }

            const dados =
                usuarioSnap.data();

            document.body.style.display =
                "block";

            console.log(
                "Usuário autenticado:",
                dados.email
            );

            console.log(
                "Plano:",
                dados.plano
            );

            console.log(
                "Status:",
                dados.status
            );

            /* ==========================
               VALIDAÇÃO FUTURA
            ========================== */

            if (
                dados.status &&
                dados.status !== "ativo"
            ) {

                alert(
                    "Sua assinatura está inativa."
                );

                await signOut(auth);

                window.location.href =
                    "login.html";

                return;

            }

        }

        catch (erro) {

            console.error(
                erro
            );

            await signOut(auth);

            window.location.href =
                "login.html";

        }

    }

);

/* ==========================
   LOGOUT
========================== */

window.logout =
async function () {

    try {

        await signOut(auth);

        window.location.href =
            "login.html";

    }

    catch (erro) {

        console.error(
            erro
        );

    }

};