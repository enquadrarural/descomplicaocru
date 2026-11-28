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

      /* ==========================
   PORTE DO PRODUTOR
========================== */

let porteProdutor;

if (rendaAgro <= 500000) {

    porteProdutor =
        "Pequeno Produtor";

} else if (rendaAgro <= 3500000) {

    porteProdutor =
        "Médio Produtor";

} else {

    porteProdutor =
        "Grande Produtor";

}

/* ==========================
   ENQUADRAMENTO (MCR)
========================== */

let enquadramento =
    "Demais Produtores";

/* PRONAF */

if (

    caf === "SIM" &&
    rendaAgro <= 500000 &&
    percentualAgro >= 50

) {

    enquadramento =
        "PRONAF";

}

/* PRONAMP */

else if (

    (
        caf === "NAO" ||
        rendaAgro > 500000
    )

    &&

    percentualAgro >= 80

) {

    enquadramento =
        "PRONAMP";

}

/* DEMAIS PRODUTORES */

else {

    enquadramento =
        "Demais Produtores";

}

      const rendaAgroFinal =
        Object.values(valores).reduce(
          (a, b) => a + b,
          0
        );

      const rendaTotalFinal =
        rendaAgroFinal + rendaExtra;

      const formatado =
        valor => valor.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }
        );

      document.getElementById('resultado').innerHTML = `
        <strong>Renda Agropecuária Total:</strong> ${formatado(rendaAgroFinal)}<br>
        <strong>Demais Rendas:</strong> ${formatado(rendaExtra)}<br>
        <strong>Renda Total:</strong> ${formatado(rendaTotalFinal)}<br><br>

        <strong>Percentual da Renda Agropecuária:</strong> ${percentualAgro.toFixed(1)}%<br>
        <strong>Enquadramento (MCR):</strong> ${enquadramento}<br>
        <strong>Porte do Produtor:</strong> ${porteProdutor}
      `;

      gerarGrafico(rendaAgroFinal, rendaExtra);

    }
  );

}

function gerarGrafico(rendaAgro, rendaExtra) {

  const grafico =
    document.getElementById('graficoPizza');

  if (!grafico) return;

  const ctx = grafico.getContext('2d');

  if (
    window.graficoPizza instanceof Chart
  ) {
    window.graficoPizza.destroy();
  }

  window.graficoPizza = new Chart(ctx, {

    type: 'pie',

    data: {

      labels: [
        'Renda Agropecuária',
        'Demais Rendas'
      ],

      datasets: [{
        data: [
          rendaAgro,
          rendaExtra
        ],

        backgroundColor: [
          '#3a7a3a',
          '#5bb85b'
        ]
      }]
    }
  });
}