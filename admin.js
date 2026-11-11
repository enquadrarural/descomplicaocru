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

        console.error(erro);

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

        console.error(erro);

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

        console.error(erro);

        alert(
            "Erro ao atualizar perfil."
        );

    }

};

/* ==========================================
   CARREGAR USUÁRIOS
========================================== */

async function carregarUsuarios() {

    listaUsuarios.innerHTML = "";

    let totalUsuarios = 0;

    let usuariosAtivos = 0;

    let usuariosBloqueados = 0;

    let trialsAtivos = 0;

    let trialsExpirados = 0;

    let usuariosMaster = 0;

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

            totalUsuarios++;

            if (
                usuario.status ===
                "ativo"
            ) {

                usuariosAtivos++;

            }

            if (
                usuario.status ===
                "inativo"
            ) {

                usuariosBloqueados++;

            }

            if (
                (
                    usuario.perfil ||
                    ""
                ).toLowerCase() ===
                "master"
            ) {

                usuariosMaster++;

            }

            if (
                (
                    usuario.plano ||
                    ""
                ).toLowerCase() ===
                "trial"
            ) {

                if (
                    usuario.trialFim
                ) {

                    const hoje =
                        new Date();

                    const dataFim =
                        usuario.trialFim.toDate();

                    if (
                        dataFim >=
                        hoje
                    ) {

                        trialsAtivos++;

                    }

                    else {

                        trialsExpirados++;

                    }

                }

                else {

                    trialsAtivos++;

                }

            }

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

                    <div class="acoes-admin">

                        <button
                            class="btn"
                            onclick="alterarStatus(
                                '${documento.id}',
                                'ativo'
                            )"
                        >
                            ✅ Ativar
                        </button>

                        <button
                            class="btn btn-bloquear"
                            onclick="alterarStatus(
                                '${documento.id}',
                                'inativo'
                            )"
                        >
                            ⛔ Bloquear
                        </button>

                        <button
                            class="btn"
                            onclick="alterarPlano(
                                '${documento.id}',
                                'trial'
                            )"
                        >
                            🧪 Trial
                        </button>

                        <button
                            class="btn"
                            onclick="alterarPlano(
                                '${documento.id}',
                                'mensal'
                            )"
                        >
                            💰 Mensal
                        </button>

                        <button
                            class="btn"
                            onclick="alterarPlano(
                                '${documento.id}',
                                'anual'
                            )"
                        >
                            📅 Anual
                        </button>

                        <button
                            class="btn"
                            onclick="alterarPerfil(
                                '${documento.id}',
                                'master'
                            )"
                        >
                            👑 Master
                        </button>

                    </div>

                </td>

            `;

            listaUsuarios.appendChild(
                tr
            );

        }
    );

    const totalUsuariosEl =
        document.getElementById(
            "totalUsuarios"
        );

    const usuariosAtivosEl =
        document.getElementById(
            "usuariosAtivos"
        );

    const usuariosBloqueadosEl =
        document.getElementById(
            "usuariosBloqueados"
        );

    const trialsAtivosEl =
        document.getElementById(
            "trialsAtivos"
        );

    const trialsExpiradosEl =
        document.getElementById(
            "trialsExpirados"
        );

    const usuariosMasterEl =
        document.getElementById(
            "usuariosMaster"
        );

    if (totalUsuariosEl)
        totalUsuariosEl.textContent =
            totalUsuarios;

    if (usuariosAtivosEl)
        usuariosAtivosEl.textContent =
            usuariosAtivos;

    if (usuariosBloqueadosEl)
        usuariosBloqueadosEl.textContent =
            usuariosBloqueados;

    if (trialsAtivosEl)
        trialsAtivosEl.textContent =
            trialsAtivos;

    if (trialsExpiradosEl)
        trialsExpiradosEl.textContent =
            trialsExpirados;

    if (usuariosMasterEl)
        usuariosMasterEl.textContent =
            usuariosMaster;

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
        (
            dados.perfil ||
            ""
        ).toLowerCase() !==
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