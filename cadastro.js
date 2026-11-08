import { auth, db }
from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================
   MENSAGEM
========================================== */

function mostrarMensagem(
    texto,
    cor = "#c0392b"
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );

    if (!mensagem) return;

    mensagem.style.color = cor;

    mensagem.innerHTML = texto;

}

/* ==========================================
   CRIAR CONTA
========================================== */

window.criarConta =
async function () {

    const nome =
        document.getElementById(
            "nome"
        ).value.trim();

    const cpf =
        document.getElementById(
            "cpf"
        ).value.trim();

    const telefone =
        document.getElementById(
            "telefone"
        ).value.trim();

    const cidade =
        document.getElementById(
            "cidade"
        ).value.trim();

    const estado =
        document.getElementById(
            "estado"
        ).value;

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const senha =
        document.getElementById(
            "senha"
        ).value;

    const confirmarSenha =
        document.getElementById(
            "confirmarSenha"
        ).value;

    const aceiteTermos =
        document.getElementById(
            "aceiteTermos"
        ).checked;

    /* ==========================
       VALIDAÇÕES
    ========================== */

    if (!nome) {
        mostrarMensagem(
            "Informe o nome completo."
        );
        return;
    }

    if (!cpf) {
        mostrarMensagem(
            "Informe o CPF."
        );
        return;
    }

    if (!telefone) {
        mostrarMensagem(
            "Informe o telefone."
        );
        return;
    }

    if (!cidade) {
        mostrarMensagem(
            "Informe a cidade."
        );
        return;
    }

    if (!estado) {
        mostrarMensagem(
            "Selecione o estado."
        );
        return;
    }

    if (!email) {
        mostrarMensagem(
            "Informe o e-mail."
        );
        return;
    }

    if (!senha) {
        mostrarMensagem(
            "Informe a senha."
        );
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem(
            "A senha deve possuir no mínimo 6 caracteres."
        );
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem(
            "As senhas não conferem."
        );
        return;
    }

    if (!aceiteTermos) {
        mostrarMensagem(
            "É necessário aceitar os termos de uso."
        );
        return;
    }

    try {

        /* ==========================
           CRIAR USUÁRIO FIREBASE
        ========================== */

        const credencial =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

        const usuario =
            credencial.user;

        /* ==========================
           SALVAR FIRESTORE
        ========================== */

/* ==========================
   TRIAL AUTOMÁTICO
========================== */

const agora =
    new Date();

const trialFim =
    new Date();

trialFim.setDate(
    trialFim.getDate() + 7
);

/* ==========================
   SALVAR FIRESTORE
========================== */

await setDoc(
    doc(
        db,
        "usuarios",
        usuario.uid
    ),
    {

        uid:
            usuario.uid,

        perfil:
            "usuario",

        nome:
            nome,

        cpf:
            cpf,

        telefone:
            telefone,

        cidade:
            cidade,

        estado:
            estado,

        email:
            email,

        plano:
            "trial",

        status:
            "ativo",

        trialDias:
            7,

        trialInicio:
            agora,

        trialFim:
            trialFim,

        criadoEm:
            serverTimestamp(),

        ultimoLogin:
            null

    }
);

        mostrarMensagem(
            "✅ Conta criada com sucesso!",
            "#2e7d32"
        );

        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            2000
        );

    }

    catch (erro) {

        let mensagem =
            erro.message;

        if (
            erro.code ===
            "auth/email-already-in-use"
        ) {

            mensagem =
                "Já existe uma conta cadastrada com este e-mail.";

        }

        if (
            erro.code ===
            "auth/invalid-email"
        ) {

            mensagem =
                "E-mail inválido.";

        }

        if (
            erro.code ===
            "auth/weak-password"
        ) {

            mensagem =
                "A senha é muito fraca.";

        }

        mostrarMensagem(
            mensagem
        );

        console.error(
            erro
        );

    }

};