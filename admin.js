import {
    auth,
    db
}
from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================
   ELEMENTOS
========================================== */

const listaUsuarios =
    document.getElementById(
        "listaUsuarios"
    );

/* ==========================================
   FORMATAR DATA
========================================== */

function formatarData(data) {

    try {

        if (!data)
            return "-";

        return data
            .toDate()
            .toLocaleDateString(
                "pt-BR"
            );

    }

    catch {

        return "-";

    }

}

/* ==========================================
   FORMATAR DATA E HORA
========================================== */

function formatarDataHora(data) {

    try {

        if (!data)
            return "-";

        return data
            .toDate()
            .toLocaleString(
                "pt-BR"
            );

    }

    catch {

        return "-";

    }

}

/* ==========================================
   ALTERAR STATUS
========================================== */

window.alterarStatus =
async function (
    uid,
    status
) {

    try {

        await updateDoc(
            doc(
                db,
                "usuarios",
                uid
            ),
            {
                status
            }
        );

        carregarUsuarios();

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao atualizar status."
        );

    }

};

/* ==========================================
   ALTERAR PLANO
========================================== */

window.alterarPlano =
async function (
    uid,
    plano
) {

    try {

        await updateDoc(
            doc(
                db,
                "usuarios",
                uid
            ),
            {
                plano
            }
        );

        carregarUsuarios();

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao atualizar plano."
        );

    }

};

/* ==========================================
   ALTERAR PERFIL
========================================== */

window.alterarPerfil =
async function (
    uid,
    perfil
) {

    try {

        await updateDoc(
            doc(
                db,
                "usuarios",
                uid
            ),
            {
                perfil
            }
        );

        carregarUsuarios();

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao atualizar perfil."
        );

    }

};

/* ==========================================
   CARREGAR USUÁRIOS
========================================== */

async function carregarUsuarios() {

    listaUsuarios.innerHTML =
        "";

    const snapshot =
        await getDocs(
            collection(
                db,
                "usuarios"
            )
        );

    snapshot.forEach(
        (documento) => {

            const usuario =
                documento.data();

            const tr =
                document.createElement(
                    "tr"
                );

            tr.innerHTML = `

                <td>
                    ${usuario.nome || "-"}
                </td>

                <td>
                    ${usuario.email || "-"}
                </td>

                <td>
                    ${usuario.perfil || "-"}
                </td>

                <td>
                    ${usuario.plano || "-"}
                </td>

                <td>
                    ${usuario.status || "-"}
                </td>

                <td>
                    ${formatarData(
                        usuario.trialFim
                    )}
                </td>

                <td>
                    ${formatarDataHora(
                        usuario.ultimoLogin
                    )}
                </td>

                <td>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                        "
                        onclick="alterarStatus(
                            '${documento.id}',
                            'ativo'
                        )"
                    >
                        ✅ Ativar
                    </button>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                            background:#c0392b;
                        "
                        onclick="alterarStatus(
                            '${documento.id}',
                            'inativo'
                        )"
                    >
                        ⛔ Bloquear
                    </button>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                        "
                        onclick="alterarPlano(
                            '${documento.id}',
                            'trial'
                        )"
                    >
                        🧪 Trial
                    </button>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                        "
                        onclick="alterarPlano(
                            '${documento.id}',
                            'mensal'
                        )"
                    >
                        💰 Mensal
                    </button>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                        "
                        onclick="alterarPlano(
                            '${documento.id}',
                            'anual'
                        )"
                    >
                        📅 Anual
                    </button>

                    <button
                        class="btn"
                        style="
                            margin:2px;
                            width:auto;
                            padding:6px 10px;
                        "
                        onclick="alterarPerfil(
                            '${documento.id}',
                            'master'
                        )"
                    >
                        👑 Master
                    </button>

                </td>

            `;

            listaUsuarios.appendChild(
                tr
            );

        }
    );

}

/* ==========================================
   VALIDAR MASTER
========================================== */

async function validarMaster(
    user
) {

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
        !usuarioSnap.exists()
    ) {

        window.location.href =
            "index.html";

        return;

    }

    const dados =
        usuarioSnap.data();

    if (
        dados.perfil !==
        "master"
    ) {

        window.location.href =
            "index.html";

        return;

    }

    carregarUsuarios();

}

/* ==========================================
   LOGIN
========================================== */

onAuthStateChanged(

    auth,

    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }

        await validarMaster(
            user
        );

    }

);