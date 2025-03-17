let select = document.querySelectorAll("select");
let valor_origem = document.querySelector("#moeda_origem");
const btn_converter = document.querySelector("button");
const resultado = document.querySelector("#resultado");

const api_key =
  "76bbefa8e7632369b8fa0b6101a7dee4dab9658e02dff35220d46f24207ece70";

const moedas = [
  { value: "", label: "Selecione..." },
  { value: "USD", label: "Dólar americano" },
  { value: "AOA", label: "Kwanza angolano" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "Libra Esterlina" },
  { value: "CAD", label: "Dólar Canadiano" },
  { value: "ZAR", label: "Rand Sul Africano" },
  { value: "XOF", label: "Franco CFA" },
  { value: "BRL", label: "Real Brasileiro" },
];

function verificar_taxa(source, target = 1) {
  if (!source || !target) {
    return;
  }
}

async function get_coin(origem, destino) {
  try {
    const url = `https://economia.awesomeapi.com.br/json/last/${origem}-${destino}?token=${api_key}`;
    const resposta = await fetch(url);
    const data = await resposta.json();

    if (!data || data.status == 404) {
      console.error("Erro ao buscar dados na API");
      return false;
    }
    return data;
  } catch (error) {
    console.log("Erro na requisição ", error);
    return null;
  }
}

async function get_rate(origem, destino) {
  if (origem != "USD" && destino != "USD") {
    const source = await get_coin("USD", origem);
    const target = await get_coin("USD", destino);
    return [source, target];
  } else {
    const source =
      origem === "USD"
        ? await get_coin("USD", destino)
        : await get_coin("USD", origem);

    return [source, null];
  }
}

async function converter(origem, destino, valor) {
  const data = await get_rate(origem, destino);

  if (!data) {
    alert("Impossível realizar a operação, tente novamente mais tarde");
    return;
  }

  let target, source;

  if (data[1] === null) {
    const source = data[0][`USD${origem === "USD" ? destino : origem}`]["bid"];
    return origem === "USD" ? valor * source : valor / source;
  } else {
    source = data[0][`USD${origem}`]["bid"];
    target = data[1][`USD${destino}`]["bid"];

    return valor / (source / target);
  }
}

function setCoin() {
  select.forEach((s) => {
    moedas.forEach((valor) => {
      const option = document.createElement("option");
      option.value = valor.value;
      option.textContent = valor.label;
      s.appendChild(option);
    });
  });
}

async function get_value() {
  const valor = Number(valor_origem.value);
  const origem = document.getElementById("select_origem").value;
  const destino = document.getElementById("select_destino").value;

  if (!origem || !destino) {
    alert("Por favor selecione a moeda de origem e a de destino");
  } else if (!valor) {
    alert("Insira o valor antes de converter");
  } else {
    const value = await converter(origem, destino, valor);
    resultado.textContent = `${valor} ${origem} equivalem hoje a ${value.toFixed(
      2
    )} ${destino}`;
  }
}

btn_converter.addEventListener("click", get_value);
setCoin();
