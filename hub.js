/* ==========================================
   LINKS
========================================== */

const URL_CAR =
    "https://consulta.car.gov.br/";

const URL_ITR =
    "https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cib";

const URL_CCIR =
    "https://sncr.serpro.gov.br/ccir/emissao";

const URL_MODULO_FISCAL =
    "https://www.embrapa.br/codigo-florestal/area-de-reserva-legal-arl/modulo-fiscal";

const URL_CARTORIO =
    "https://ridigital.org.br/";

const URL_MAPBIOMAS =
    "https://plataforma.alerta.mapbiomas.org/";

const URL_PRODES =
    "https://terrabrasilis.dpi.inpe.br/app/map/deforestation?hl=pt-br";

const URL_RGP =
    "https://pesqbrasil-pescadorprofissional.mpa.gov.br/acesso-externo";

const URL_RECEITA =
    "https://servicos.receitafederal.gov.br/servico/certidoes/#/home";

const URL_IBAMA =
    "https://servicos.ibama.gov.br/sicafiext/";

const URL_SINTEGRA =
    "https://www.sintegra.gov.br/";

/* ==========================================
   CARREGAR LINKS
========================================== */

window.addEventListener(

    "DOMContentLoaded",

    () => {

        document.getElementById("link-car").href =
            URL_CAR;

        document.getElementById("link-itr").href =
            URL_ITR;

        document.getElementById("link-ccir").href =
            URL_CCIR;

        document.getElementById("link-mf").href =
            URL_MODULO_FISCAL;

        document.getElementById("link-cartorio").href =
            URL_CARTORIO;

        document.getElementById("link-mapbiomas").href =
            URL_MAPBIOMAS;

        document.getElementById("link-prodes").href =
            URL_PRODES;

        document.getElementById("link-rgp").href =
            URL_RGP;

        document.getElementById("link-receita").href =
            URL_RECEITA;

        document.getElementById("link-ibama").href =
            URL_IBAMA;

        document.getElementById("link-sintegra").href =
            URL_SINTEGRA;

    }

);

/* ==========================================
   PESQUISA
========================================== */

const search =
    document.getElementById(
        "search"
    );

search.addEventListener(

    "keyup",

    function () {

        const termo =
            this.value.toLowerCase();

        document
            .querySelectorAll(
                ".card"
            )
            .forEach(

                card => {

                    const texto =
                        card.textContent
                            .toLowerCase();

                    card.style.display =
                        texto.includes(
                            termo
                        )
                        ? "flex"
                        : "none";

                }

            );

    }

);