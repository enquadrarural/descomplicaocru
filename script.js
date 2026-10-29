/* ==========================
   FUNÇÕES AUXILIARES
========================== */

function limparValor(valor) {
  return parseFloat(
    valor.replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  ) || 0;
}

function formatarMoeda(campo) {

  let valor = campo.value.replace(/\D/g, '');

  if (!valor) valor = '0';

  campo.value = (parseFloat(valor) / 100).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  );
}

/* ==========================
   MÁSCARA DE MOEDA
========================== */

document.querySelectorAll('.moeda').forEach(input => {

  input.addEventListener('input', () =>
    formatarMoeda(input)
  );

  input.addEventListener('blur', () =>
    formatarMoeda(input)
  );

  formatarMoeda(input);

});

/* ==========================
   MENU LATERAL
========================== */

function toggleMenu() {

  const sidebar =
    document.querySelector('.sidebar');

  if (!sidebar) return;

  sidebar.classList.toggle('collapsed');

  const menuRecolhido =
    sidebar.classList.contains('collapsed');

  localStorage.setItem(
    'menuRecolhido',
    menuRecolhido
  );
}

document.addEventListener('DOMContentLoaded', () => {

  const sidebar =
    document.querySelector('.sidebar');

  if (!sidebar) return;

  const menuRecolhido =
    localStorage.getItem('menuRecolhido') === 'true';

  if (menuRecolhido) {
    sidebar.classList.add('collapsed');
  }

});

/* ==========================
   ENQUADRAMENTO
========================== */

const formulario =
  document.getElementById('formEnquadramento');

if (formulario) {

  formulario.addEventListener(
    'submit',
    function (e) {

      e.preventDefault();

      const form = e.target;

      const caf = form.caf.value;

      const camposAgro = [
        'graos',
        'leite',
        'corte',
        'ovinos',
        'caprinos',
        'hortas',
        'frutas',
        'cafe',
        'bufalos',
        'outrosAgro'
      ];

      const valores = {};

      camposAgro.forEach(campo => {

        if (!form[campo]) {

          console.error(
            `Campo não encontrado: ${campo}`
          );

          valores[campo] = 0;
          return;
        }

        valores[campo] =
          limparValor(form[campo].value);

      });

      const rendaExtra = [
        'assalariado',
        'aposentadoria',
        'prolabore',
        'outrosRenda'
      ].reduce((total, campo) => {

        if (!form[campo]) {

          console.error(
            `Campo não encontrado: ${campo}`
          );

          return total;
        }

        return (
          total +
          limparValor(form[campo].value)
        );

      }, 0);

      const rendaAgro =
        Object.values(valores).reduce(
          (a, b) => a + b,
          0
        );

      const rendaTotal =
        rendaAgro + rendaExtra;

      const percentualAgro =
        rendaTotal > 0
          ? (rendaAgro / rendaTotal) * 100
          : 0;

      let porteProdutor =
        "Grande Produtor";

      if (rendaAgro <= 500000) {

        porteProdutor =
          "Pequeno Produtor";

      } else if (
        rendaAgro > 500000 &&
        rendaAgro <= 2500000
      ) {

        porteProdutor =
          "Médio Produtor";
      }

      let enquadramento =
        "Demais Produtores";

      if (caf === "SIM") {

        if (
          rendaAgro <= 500000 &&
          percentualAgro >= 50
        ) {

          enquadramento =
            "PRONAF";

        } else if (
          percentualAgro >= 80
        ) {

          enquadramento =
            "PRONAMP";
        }

      } else {

        if (
          percentualAgro >= 80
        ) {

          enquadramento =
            "PRONAMP";
        }
      }

      if (enquadramento === "PRONAF") {

        valores.leite *= 0.7;
        valores.frutas *= 0.7;
        valores.cafe *= 0.7;
      }

      const rendaAgroFinal =
        Object.values(valores).reduce(
          (a, b) => a + b,
          0
        );

      const rendaTotalFinal =
        rendaAgroFinal + rendaExtra;

      const formatado = valor =>
        valor.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }
        );

      document.getElementById(
        'resultado'
      ).innerHTML = `
        <strong>Renda Agropecuária Total:</strong> ${formatado(rendaAgroFinal)}<br>
        <strong>Demais Rendas:</strong> ${formatado(rendaExtra)}<br>
        <strong>Renda Total:</strong> ${formatado(rendaTotalFinal)}<br><br>

        <strong>Percentual da Renda Agropecuária:</strong> ${percentualAgro.toFixed(1)}%<br>
        <strong>Enquadramento (MCR):</strong> ${enquadramento}<br>
        <strong>Porte do Produtor:</strong> ${porteProdutor}
      `;

      const grafico =
        document.getElementById(
          'graficoPizza'
        );

      if (!grafico) return;

      const ctx =
        grafico.getContext('2d');

      if (
        window.graficoPizza instanceof Chart
      ) {

        window.graficoPizza.destroy();
      }

      window.graficoPizza =
        new Chart(ctx, {

          type: 'pie',

          data: {

            labels: [
              'Renda Agropecuária',
              'Demais Rendas'
            ],

            datasets: [{
              data: [
                rendaAgroFinal,
                rendaExtra
              ],

              backgroundColor: [
                '#3a7a3a',
                '#5bb85b'
              ],

              borderColor: '#ffffff',
              borderWidth: 2
            }]
          },

          options: {

            responsive: true,

            plugins: {

              legend: {
                position: 'bottom'
              },

              title: {
                display: true,
                text:
                  'Composição da Renda Total'
              }

            }
          }

        });

    }
  );

}

/* ==========================
   CREDIA RURAL
========================== */

function analisarOperacao() {

  const descricao =
    document
      .getElementById('descricaoOperacao')
      ?.value
      .toLowerCase();

  const resultado =
    document.getElementById(
      'resultadoCredIA'
    );

  if (!resultado) return;

  if (!descricao || !descricao.trim()) {

    resultado.innerHTML = `
      <strong>⚠ Atenção</strong><br>
      Informe a necessidade do produtor.
    `;

    return;
  }

  const linhasCredito = [

    {
      palavras: [
        'trator',
        'colheitadeira',
        'máquina',
        'maquina',
        'implemento'
      ],
      linha: 'Moderfrota',
      finalidade:
        'Aquisição de máquinas e equipamentos agrícolas',
      prazo: 'Até 7 anos',
      observacao:
        'Indicado para modernização da frota agrícola.'
    },

    {
      palavras: [
        'energia solar',
        'fotovoltaica',
        'placa solar'
      ],
      linha: 'Inovagro',
      finalidade:
        'Inovação e modernização tecnológica',
      prazo: 'Até 10 anos',
      observacao:
        'Financiamento para energia solar.'
    },

    {
      palavras: [
        'compost barn',
        'ordenha',
        'curral',
        'galpao',
        'galpão'
      ],
      linha:
        'Pronaf Mais Alimentos',
      finalidade:
        'Infraestrutura pecuária',
      prazo:
        'Até 10 anos',
      observacao:
        'Muito utilizado para atividade leiteira.'
    },

    {
      palavras: [
        'irrigação',
        'irrigacao',
        'pivo',
        'pivô'
      ],
      linha: 'Proirriga',
      finalidade:
        'Projetos de irrigação',
      prazo:
        'Até 10 anos',
      observacao:
        'Financiamento para sistemas de irrigação.'
    },

    {
      palavras: [
        'armazenagem',
        'silo',
        'armazem',
        'armazém'
      ],
      linha: 'PCA',
      finalidade:
        'Armazenagem agrícola',
      prazo:
        'Até 12 anos',
      observacao:
        'Voltado para silos e estruturas de armazenagem.'
    },

    {
      palavras: [
        'novilha',
        'matriz',
        'gado',
        'bovino',
        'vaca'
      ],
      linha:
        'Pronamp Investimento',
      finalidade:
        'Aquisição de animais',
      prazo:
        'Até 8 anos',
      observacao:
        'Expansão ou melhoria do rebanho.'
    }

  ];

  const resposta =
    linhasCredito.find(item =>
      item.palavras.some(
        palavra =>
          descricao.includes(palavra)
      )
    );

  if (!resposta) {

    resultado.innerHTML = `
      <strong>✅ Análise concluída</strong><br><br>

      Nenhuma linha específica foi encontrada.<br><br>

      Descreva melhor a operação pretendida.
    `;

    return;
  }

  resultado.innerHTML = `
    <strong>✅ Linha Sugerida:</strong><br>
    ${resposta.linha}<br><br>

    <strong>🎯 Finalidade:</strong><br>
    ${resposta.finalidade}<br><br>

    <strong>📅 Prazo:</strong><br>
    ${resposta.prazo}<br><br>

    <strong>📌 Observações:</strong><br>
    ${resposta.observacao}
  `;
}