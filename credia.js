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
            .toLowerCase()
            .trim();

    const finalidade =
        document
            .getElementById('finalidade')
            ?.value;

    const atividade =
        document
            .getElementById('atividade')
            ?.value;

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

    if (!descricao) {

        resultado.innerHTML = `
            <div class="alerta-credia">
                ⚠ Informe a necessidade do produtor.
            </div>
        `;

        return;
    }

    if (!finalidade) {

        resultado.innerHTML = `
            <div class="alerta-credia">
                ⚠ Selecione a finalidade da operação.
            </div>
        `;

        return;
    }

    if (!atividade) {

        resultado.innerHTML = `
            <div class="alerta-credia">
                ⚠ Selecione a atividade da operação.
            </div>
        `;

        return;
    }

    const respostas =
        baseCredIA.filter(item =>

            item.finalidade === finalidade &&

            item.atividade === atividade &&

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
                Nenhuma linha foi encontrada para os critérios informados.
            </div>
        `;

        return;
    }

    resultado.innerHTML = `

        <div class="resultado-grid">

            ${respostas.map(item => `

                <div class="card-produto">

                    <div class="campo-produto">
                        <span class="titulo-campo">Linha</span>
                        <span class="valor-campo">${item.linha}</span>
                    </div>

                    <div class="campo-produto">
                        <span class="titulo-campo">Programa</span>
                        <span class="valor-campo">${item.programa}</span>
                    </div>

                    <div class="campo-produto">
                        <span class="titulo-campo">Item Financiado</span>
                        <span class="valor-campo">${item.item}</span>
                    </div>

                    <div class="campo-produto">
                        <span class="titulo-campo">Taxa</span>
                        <span class="valor-campo">${item.taxa}</span>
                    </div>

                    <div class="campo-produto">
                        <span class="titulo-campo">Prazo</span>
                        <span class="valor-campo">${item.prazo}</span>
                    </div>

                    <button
                        class="btn-simular"
                        onclick="simularOperacao(
                            '${item.programa}',
                            '${item.linha}',
                            '${item.item}',
                            '${item.taxa}',
                            '${item.prazo}',
                            '${porte}'
                        )"
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

function simularOperacao(
    programa,
    linha,
    item,
    taxa,
    prazo,
    porte
) {

    const modal =
        document.getElementById(
            'modalSimulacao'
        );

    const conteudo =
        document.getElementById(
            'conteudoSimulacao'
        );

    let valorTexto =
        document.getElementById(
            'valorPretendido'
        ).value;

    let valor =
        valorTexto
            .replace(/\./g, '')
            .replace(',', '.');

    valor = parseFloat(valor);

    if (isNaN(valor)) {
        valor = 0;
    }

    let taxaNumero =
        parseFloat(
            taxa
                .replace('%', '')
                .replace(',', '.')
        );

    if (isNaN(taxaNumero)) {
        taxaNumero = 0;
    }

    let meses =
        parseInt(prazo);

    if (isNaN(meses)) {
        meses = 12;
    }

    const juros =
        valor * (taxaNumero / 100);

    const valorFinal =
        valor + juros;

    const parcelaMedia =
        meses > 0
            ? valorFinal / meses
            : valorFinal;

    conteudo.innerHTML = `

        <div class="resultado-simulacao">

            <h3>Dados da Operação</h3>

            <div class="grid">

                <div>
                    <strong>Programa</strong><br>
                    ${programa}
                </div>

                <div>
                    <strong>Linha</strong><br>
                    ${linha}
                </div>

                <div>
                    <strong>Item</strong><br>
                    ${item}
                </div>

                <div>
                    <strong>Porte</strong><br>
                    ${porte}
                </div>

            </div>

        </div>

        <div class="resultado-simulacao">

            <h3>Condições</h3>

            <div class="grid">

                <div>
                    <strong>Valor Financiado</strong><br>
                    R$ ${valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                    })}
                </div>

                <div>
                    <strong>Taxa</strong><br>
                    ${taxa}
                </div>

                <div>
                    <strong>Prazo</strong><br>
                    ${prazo}
                </div>

            </div>

        </div>

        <div class="resultado-simulacao">

            <h3>Resultado da Simulação</h3>

            <div class="grid">

                <div>
                    <strong>Juros Estimados</strong><br>
                    R$ ${juros.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                    })}
                </div>

                <div>
                    <strong>Valor Total</strong><br>
                    R$ ${valorFinal.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                    })}
                </div>

                <div>
                    <strong>Parcela Média</strong><br>
                    R$ ${parcelaMedia.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                    })}
                </div>

            </div>

        </div>

    `;

    modal.style.display = 'block';

}

/* ==========================
   FECHAR MODAL
========================== */

function fecharSimulacao() {

    const modal =
        document.getElementById(
            'modalSimulacao'
        );

    if (modal) {
        modal.style.display = 'none';
    }

}

/* ==========================
   FECHAR AO CLICAR FORA
========================== */

window.addEventListener('click', function(event) {

    const modal =
        document.getElementById(
            'modalSimulacao'
        );

    if (event.target === modal) {
        fecharSimulacao();
    }

});