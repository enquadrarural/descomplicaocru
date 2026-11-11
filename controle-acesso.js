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

const menuAdmin =
    document.getElementById(
        "menuAdmin"
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
   VISITANTE
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

    if (menuAdmin) {

        menuAdmin.style.display =
            "none";

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

async function configurarUsuario(
    user
) {

    let nomeUsuario =
        user.email;

    let informacaoPlano =
        "";

    let perfil =
        "usuario";

    let status =
        "ativo";

    let trialExpirado =
        false;

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

        if (
            usuarioSnap.exists()
        ) {

            const dados =
    usuarioSnap.data();

console.log(
    "Dados Firestore:",
    dados
);

console.log(
    "Perfil Firestore:",
    dados.perfil
);

console.log(
    "Menu Admin:",
    menuAdmin
);

            perfil =
                dados.perfil || "usuario";

            status =
                dados.status || "ativo";

            if (menuAdmin) {

                menuAdmin.style.display =
                    "none";

            }

            if (
                dados.nome &&
                dados.nome.trim() !== ""
            ) {

                nomeUsuario =
                    dados.nome;

            }

            /* ==========================
               MASTER
            ========================== */

            if (
                perfil === "master"
            ) {

                informacaoPlano =
                    "⭐ Master";

                if (menuAdmin) {

                    menuAdmin.style.display =
                        "flex";

                }

            }

            /* ==========================
               TRIAL
            ========================== */

            else if (
                dados.trialFim
            ) {

                const hoje =
                    new Date();

                const dataFim =
                    dados.trialFim.toDate();

                const diasRestantes =
                    Math.max(
                        0,
                        Math.ceil(
                            (
                                dataFim -
                                hoje
                            )
                            /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        )
                    );

                if (
                    diasRestantes <= 0
                ) {

                    trialExpirado =
                        true;

                    informacaoPlano =
                        "⚠ Trial Expirado";

                }

                else {

                    informacaoPlano =
                        `🕒 Trial: ${diasRestantes} dias restantes`;

                }

            }

            else {

                informacaoPlano =
                    "✅ Usuário Ativo";

            }

        }

    }

    catch (erro) {

        console.error(
            "Erro ao buscar usuário:",
            erro
        );

    }

    /* ==========================
       TOPO
    ========================== */

    if (areaUsuario) {

        areaUsuario.innerHTML = `

            <div class="usuario-logado">

                <div>

                    <div>
                        👤 ${nomeUsuario}
                    </div>

                    <div
                        style="
                            font-size:12px;
                            opacity:.85;
                        "
                    >
                        ${informacaoPlano}
                    </div>

                </div>

                <button
                    class="btn-sair"
                    onclick="logout()"
                >
                    🚪 Sair
                </button>

            </div>

        `;

    }

    /* ==========================
       VERIFICAR MÓDULO PROTEGIDO
    ========================== */

    const moduloAtual =
        document.body.dataset.modulo;

    const bloquearModulo =
        perfil !== "master" &&
        moduloAtual &&
        (
            trialExpirado ||
            status !== "ativo"
        );

    if (
        bloquearModulo
    ) {

        if (areaRestrita) {

            areaRestrita.style.display =
                "block";

            areaRestrita.innerHTML = `

                <h2>
                    🔒 Acesso Bloqueado
                </h2>

                <p style="margin-top:15px;">

                    Seu período de avaliação
                    expirou.

                </p>

                <p style="margin-top:10px;">

                    Entre em contato para
                    ativar uma assinatura
                    e continuar utilizando
                    o sistema.

                </p>

            `;

        }

        if (conteudoProtegido) {

            conteudoProtegido.style.display =
                "none";

        }

        return;

    }

    /* ==========================
       LIBERAR MÓDULOS
    ========================== */

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

    async (user) => {

        if (user) {

            await configurarUsuario(
                user
            );

        }

        else {

            configurarVisitante();

        }

    }

);