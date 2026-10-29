/* ==========================
   CAMPO VALOR PRETENDIDO
========================== */

document.addEventListener('DOMContentLoaded', () => {

    const campoValor =
        document.getElementById('valorPretendido');

    if (!campoValor) return;

    campoValor.addEventListener('blur', () => {

        let valor = campoValor.value
            .replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^\d.]/g, '');

        valor = parseFloat(valor);

        if (isNaN(valor)) {
            campoValor.value = '';
            return;
        }

        campoValor.value =
            valor.toLocaleString(
                'pt-BR',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    });

});

/* ==========================
   CREDIA RURAL
========================== */

function analisarOperacao() {

    const descricao =
        document
            .getElementById('descricaoOperacao')
            ?.value
            .toLowerCase();

    const porte =
        document
            .getElementById('porte')
            ?.value;

    const valorPretendido =
        document
            .getElementById('valorPretendido')
            ?.value;

    const resultado =
        document.getElementById(
            'resultadoCredIA'
        );

    if (!resultado) return;

    if (!descricao || !descricao.trim()) {

        resultado.innerHTML = `
            <div class="alerta-credia">
                ⚠ Informe a necessidade do produtor.
            </div>
        `;

        return;
    }

    const respostas =
        baseCredIA.filter(item =>
            item.palavras.some(
                palavra =>
                    descricao.includes(
                        palavra.toLowerCase()
                    )
            )
        );

    if (respostas.length === 0) {

        resultado.innerHTML = `
            <div class="alerta-credia">
                Nenhuma linha foi encontrada para a descrição informada.
            </div>
        `;

        return;
    }

    resultado.innerHTML = `

        <div class="resultado-grid">

            ${respostas.map(item => `

                <div class="card-produto">

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Linha
                        </span>

                        <span class="valor-campo">
                            ${item.linha}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Programa
                        </span>

                        <span class="valor-campo">
                            ${item.programa}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Item Financiado
                        </span>

                        <span class="valor-campo">
                            ${item.item}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Porte
                        </span>

                        <span class="valor-campo">
                            ${porte}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Valor Pretendido
                        </span>

                        <span class="valor-campo">
                            R$ ${valorPretendido}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Taxa
                        </span>

                        <span class="valor-campo">
                            ${item.taxa}
                        </span>

                    </div>

                    <div class="campo-produto">

                        <span class="titulo-campo">
                            Prazo
                        </span>

                        <span class="valor-campo">
                            ${item.prazo}
                        </span>

                    </div>

                    <button
                        class="btn-simular"
                        onclick="simularOperacao()"
                    >
                        📊 Simular
                    </button>

                </div>

            `).join('')}

        </div>

    `;
}

/* ==========================
   SIMULAÇÃO
========================== */

function simularOperacao() {

    alert(
        "Módulo de simulação em desenvolvimento."
    );

}