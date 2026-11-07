import { auth }
from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ==========================================
   ELEMENTOS
========================================== */

const areaUsuario =
    document.getElementById(
        "areaUsuario"
    );

const menuEnquadramento =
    document.getElementById(
        "menuEnquadramento"
    );

const menuCredIA =
    document.getElementById(
        "menuCredIA"
    );

const btnHeroEnquadramento =
    document.getElementById(
        "btnHeroEnquadramento"
    );

const areaRestrita =
    document.getElementById(
        "areaRestrita"
    );

const conteudoProtegido =
    document.getElementById(
        "conteudoProtegido"
    );

/* ==========================================
   LOGOUT
========================================== */

window.logout =
async function () {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    }

    catch (erro) {

        console.error(
            erro
        );

    }

};

/* ==========================================
   USUÁRIO NÃO LOGADO
========================================== */

function configurarVisitante() {

    if (areaUsuario) {

        areaUsuario.innerHTML = `

            <button
                id="btnLogin"
                class="btn-login"
                onclick="window.location.href='login.html'"
            >
                👤 Entrar
            </button>

        `;

    }

    if (menuEnquadramento) {

        menuEnquadramento.classList.add(
            "menu-bloqueado"
        );

        menuEnquadramento.onclick =
            (e) => {

                e.preventDefault();

                window.location.href =
                    "login.html";

            };

    }

    if (menuCredIA) {

        menuCredIA.classList.add(
            "menu-bloqueado"
        );

        menuCredIA.onclick =
            (e) => {

                e.preventDefault();

                window.location.href =
                    "login.html";

            };

    }

    if (btnHeroEnquadramento) {

        btnHeroEnquadramento.onclick =
            (e) => {

                e.preventDefault();

                window.location.href =
                    "login.html";

            };

    }

    if (areaRestrita) {

        areaRestrita.style.display =
            "block";

    }

    if (conteudoProtegido) {

        conteudoProtegido.style.display =
            "none";

    }

}

/* ==========================================
   USUÁRIO LOGADO
========================================== */

function configurarUsuario(
    user
) {

    if (areaUsuario) {

        areaUsuario.innerHTML = `

            <div class="usuario-logado">

                <span>
                    👤
                    ${user.email}
                </span>

                <button
                    class="btn-sair"
                    onclick="logout()"
                >
                    🚪 Sair
                </button>

            </div>

        `;

    }

    if (menuEnquadramento) {

        menuEnquadramento.classList.remove(
            "menu-bloqueado"
        );

        menuEnquadramento.href =
            "enquadramento.html";

    }

    if (menuCredIA) {

        menuCredIA.classList.remove(
            "menu-bloqueado"
        );

        menuCredIA.href =
            "credia.html";

    }

    if (btnHeroEnquadramento) {

        btnHeroEnquadramento.href =
            "enquadramento.html";

    }

    if (areaRestrita) {

        areaRestrita.style.display =
            "none";

    }

    if (conteudoProtegido) {

        conteudoProtegido.style.display =
            "block";

    }

}

/* ==========================================
   MONITORAR LOGIN
========================================== */

onAuthStateChanged(

    auth,

    (user) => {

        if (user) {

            configurarUsuario(
                user
            );

        }

        else {

            configurarVisitante();

        }

    }

);