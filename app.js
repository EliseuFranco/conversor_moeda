let select = document.querySelectorAll("select");
let valor_origem = document.querySelector("#moeda_origem");
const btn_converter = document.querySelector("button");
const resultado = document.querySelector("#resultado");

const moedas = [
  { value: "", label: "Selecione..." },
  { value: "USD", label: "Dólar americano" },
  { value: "AOA", label: "Kwanza angolano" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "Libra Esterlina" },
  { value: "CAD", label: "Dólar Canadiano" },
  { value: "ZAR", label: "Rand Sul Africano" },
  { value: "XOF", label: "Franco CFA" },
];

function verificar_taxa(source, target = 1) {
  if (!source || !target) {
    return;
  }
}

async function get_coin(origem, destino) {
  try {
    const url = `https://economia.awesomeapi.com.br/last/${origem}-${destino}`;
    const resposta = await fetch(url);
    const data = await resposta.json();

    if (data.status == 404) {
      return false;
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function get_rate(origem, destino) {
  if (origem != "USD" && destino != "USD") {
    const source = await get_coin("USD", origem);
    const target = await get_coin("USD", destino);

    return [source, target];
  } else if (origem === "USD") {
    source = await get_coin(origem, destino);

    return [source, 0];
  } else {
    source = await get_coin(destino, origem);
    target = await get_coin("USD", destino);

    return [source, target];
  }
}

async function converter(origem, destino, valor) {
  const data = await get_rate(origem, destino);

  console.log(data);
  let target, source;

  if (!data) {
    alert("Impossível realizar a operação, tente novamente mais tarde");
    return;
  } else {
    if (data[1] == 0) {
      source = data[0][`USD${destino}`]["bid"];
      return valor * source;
    } else {
      source = data[0][`USD${origem}`]["bid"];
      target = data[1][`USD${destino}`]["bid"];
      return valor / (source / target);
    }
  }
}

function setCoin() {
  for (let c in select) {
    moedas.forEach((valor) => {
      const option = document.createElement("option");
      option.value = valor.value;
      option.textContent = valor.label;
      select[c].appendChild(option);
    });
  }
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
    resultado.innerHTML = `${valor} ${origem} Equivalem hoje a ${value.toFixed(
      2
    )} ${destino}`;
  }
}

btn_converter.addEventListener("click", get_value);
setCoin();
