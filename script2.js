loadJson()
var combinacoes;


function loadJson() {
  // Usando fetch para carregar o arquivo JSON
  fetch('combinations.json')  // Especifique o caminho do arquivo JSON
    .then(response => {
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo JSON.');
      }

      return response.json(); // Converter a resposta em JSON
    })
    .then(data => {
      // Manipular os dados do JSON
      combinacoes = data
      //alert(data)
    })
    .catch(error => {
      // Manipular erros
      console.error('Erro:', error);
    });
}

function filterByOptions() {

  loadJson()
  clearHTML()

  combinacoes = Object.values(combinacoes.combinacoes)

  var BaseUR = document.getElementById("baseUR")
  var Port = document.getElementById("Port")

  //var isPortAndUr = BaseUR.checked && Port.checked ? true : false

  var qtdLinhas = parseInt(document.getElementById("linhas").value);

  var totalValue = sumValues()

  combinacoes = filtrarPorLinhas(qtdLinhas)

  // Exibir os cards
  //document.querySelector('.card-container').classList.remove('hidden');

  buildCombo(combinacoes, totalValue, qtdLinhas)


}

function buildCombo(combinacoes, valor, qtdLinhas) {
  var op1 = opcao1(combinacoes, valor);
  var op2 = opcao2(combinacoes, valor, op1,qtdLinhas);
  var op3 = opcao3(combinacoes, valor, op1, op2,qtdLinhas);
  var op4 = opcao4(combinacoes, valor, op1, op2, op3,qtdLinhas);
  var op5 = opcao5(combinacoes, valor, op1, op2, op3, op4,qtdLinhas);

  op1 = addValorTotal(op1, qtdLinhas)
  op2 = addValorTotal(op2, qtdLinhas)
  op3 = addValorTotal(op3, qtdLinhas)
  op4 = addValorTotal(op4, qtdLinhas)
  op5 = addValorTotal(op5, qtdLinhas)

  showPlan(op1, op2, op3, op4, op5)
  updateImage(op1, op2, op3, op4, op5)
  calcDif(op1, op2, op3, op4, op5, valor)
  showCards();
}

function opcao1(combinacoes, valor) {
  let menorDiferenca = Infinity;
  let melhorCombinacao = null;

  combinacoes.forEach(combinacao => {
    const diferencaAtual = Math.abs(combinacao.vlr_total_portin - valor); // Calcula a diferença absoluta

    // Verifica se a diferença atual é menor que a menor diferença registrada
    if (diferencaAtual < menorDiferenca) {
      menorDiferenca = diferencaAtual; // Atualiza a menor diferença
      melhorCombinacao = combinacao; // Atualiza a melhor combinação
    }
  });
  return melhorCombinacao;
}

function opcao2(combinacoes, valor, op1, qtdLinhas) {
  let menorDiferenca = Infinity;
  let melhorCombinacao = null;

  // Converte o valor de internetMovel de op1 para número
  const internetMovelOp1 = parseInt(op1.internetMovel.replace(' GB', ''));

  combinacoes.forEach(combinacao => {
    let diferencaAtual;

    // Verifica qual campo de valor usar dependendo do isPortAndUr
    diferencaAtual = Math.abs(combinacao.vlr_total_portin - valor);

    // Converte o valor de internetMovel da combinação atual para número
    const internetMovelAtual = parseInt(combinacao.internetMovel.replace(' GB', ''));

    // Verifica se a diferença é menor e o internetMovel é maior que o da op1
    if (diferencaAtual < menorDiferenca && internetMovelAtual > internetMovelOp1 && combinacao.id != op1.id) {
      menorDiferenca = diferencaAtual; // Atualiza a menor diferença
      melhorCombinacao = combinacao;   // Atualiza a melhor combinação
    }

    if(qtdLinhas == 6){
      if (diferencaAtual < menorDiferenca && internetMovelAtual >= internetMovelOp1 && combinacao.id != op1.id) {
        menorDiferenca = diferencaAtual; // Atualiza a menor diferença
        melhorCombinacao = combinacao;   // Atualiza a melhor combinação
      }
    }
  });

  return melhorCombinacao;
}

function opcao3(combinacoes, valor, op1, op2,qtdLinhas) {
  let menorDiferenca = Infinity;
  let melhorCombinacao = null;

  // Função para converter internetBandaLarga para Megas
  function converterInternetBandaLarga(velocidade) {
    if (velocidade == "1") {
      return parseInt(velocidade) * 1000; // 1 Giga = 1000 Megas
    } else {
      return parseInt(velocidade);
    }
  }

  // Converte o valor de internetBandaLarga de op1 para Megas
  const bandaLargaOp1 = converterInternetBandaLarga(op1.internetBandaLarga);

  // Converte o valor de internetMovel da combinação atual para número
  //const internetMovelop1 = parseInt(op1.internetMovel.replace(' GB', ''));
  // Itera sobre as combinações
  combinacoes.forEach(combinacao => {
    let diferencaAtual;

    // Verifica qual campo de valor usar dependendo do isPortAndUr
    diferencaAtual = Math.abs(combinacao.vlr_total_portin - valor); // Normal

    // Converte o valor de internetBandaLarga da combinação atual para Megas
    const bandaLargaAtual = converterInternetBandaLarga(combinacao.internetBandaLarga);

    // Converte o valor de internetMovel da combinação atual para número
    const internetMovelAtual = parseInt(combinacao.internetMovel.replace(' GB', ''));

    // Verifica se a diferença é menor e internetBandaLarga é maior que a de op1
    if (diferencaAtual < menorDiferenca && bandaLargaAtual > op2.internetBandaLarga && combinacao.id != op1.id && combinacao.id != op2.id) {
      menorDiferenca = diferencaAtual; // Atualiza a menor diferença
      melhorCombinacao = combinacao;   // Atualiza a melhor combinação
    }

    if(qtdLinhas == 6){
      if (diferencaAtual < menorDiferenca && bandaLargaAtual >= op2.internetBandaLarga && combinacao.id != op1.id && combinacao.id != op2.id) {
        menorDiferenca = diferencaAtual; // Atualiza a menor diferença
        melhorCombinacao = combinacao;   // Atualiza a melhor combinação
      }
    }
  });

  return melhorCombinacao;
}

function opcao4(combinacoes, valor, op1, op2, op3,qtdLinhas) {
  let menorDiferenca = Infinity;
  let melhorCombinacao = null;

  // Função para converter internetBandaLarga para Megas
  function converterInternetBandaLarga(velocidade) {
    if (velocidade == "1") {
      return parseInt(velocidade) * 1000; // 1 Giga = 1000 Megas
    } else {
      return parseInt(velocidade);
    }
  }

  // Converte o valor de internetMovel de op1 para número
  const internetMovelOp2 = parseInt(op2.internetMovel.replace(' GB', ''));

  // Itera sobre as combinações
  combinacoes.forEach(combinacao => {
    let diferencaAtual;

    // Verifica qual campo de valor usar dependendo do isPortAndUr
    diferencaAtual = Math.abs(combinacao.vlr_total_portin - valor);

    // Converte o valor de internetBandaLarga da combinação atual para Megas
    const bandaLargaAtual = converterInternetBandaLarga(combinacao.internetBandaLarga);

    // Converte o valor de internetMovel da combinação atual para número
    const internetMovelAtual = parseInt(combinacao.internetMovel.replace(' GB', ''));

    // Verifica se a diferença é menor e o internetMovel é maior que o da op1
    if (diferencaAtual < menorDiferenca && combinacao.vlr_total_portin > op1.vlr_total_portin && combinacao.id != op1.id && combinacao.id != op2.id && combinacao.id != op3.id) {
      menorDiferenca = diferencaAtual; // Atualiza a menor diferença
      melhorCombinacao = combinacao;   // Atualiza a melhor combinação
    }

    if(qtdLinhas == 6){
      if (diferencaAtual < menorDiferenca && combinacao.vlr_total_portin >= op1.vlr_total_portin && combinacao.id != op1.id && combinacao.id != op2.id && combinacao.id != op3.id) {
        menorDiferenca = diferencaAtual; // Atualiza a menor diferença
        melhorCombinacao = combinacao;   // Atualiza a melhor combinação
      }
    }
  });

  return melhorCombinacao;
}

function opcao5(combinacoes, valor, op1, op2, op3, op4, qtdLinhas) {
  if (op4 == null)
    return null;

  let menorDiferenca = Infinity;
  let melhorCombinacao = null;

  // Função para converter internetBandaLarga para Megas
  function converterInternetBandaLarga(velocidade) {
    if (velocidade == "1") {
      return parseInt(velocidade) * 1000; // 1 Giga = 1000 Megas
    } else {
      return parseInt(velocidade);
    }
  }

  // Converte o valor de internetBandaLarga de op1 para Megas
  const bandaLargaOp3 = converterInternetBandaLarga(op3.internetBandaLarga);

  // Converte o valor de internetMovel da combinação atual para número
  const internetMovelop3 = parseInt(op3.internetMovel.replace(' GB', ''));

  // Itera sobre as combinações
  combinacoes.forEach(combinacao => {
    let diferencaAtual;

    // Verifica qual campo de valor usar dependendo do isPortAndUr
    diferencaAtual = Math.abs(combinacao.vlr_total_portin - valor); // Normal

    // Converte o valor de internetBandaLarga da combinação atual para Megas
    const bandaLargaAtual = converterInternetBandaLarga(combinacao.internetBandaLarga);

    // Converte o valor de internetMovel da combinação atual para número
    const internetMovelAtual = parseInt(combinacao.internetMovel.replace(' GB', ''));

    // Verifica se a diferença é menor e internetBandaLarga é maior que a de op1
    if (diferencaAtual < menorDiferenca && combinacao.vlr_total_portin > op4.vlr_total_portin && combinacao.id != op1.id && combinacao.id != op2.id && combinacao.id != op3.id && combinacao.id != op4.id) {
      menorDiferenca = diferencaAtual; // Atualiza a menor diferença
      melhorCombinacao = combinacao;   // Atualiza a melhor combinação
    }

    if(qtdLinhas == 6){
      if (diferencaAtual < menorDiferenca && combinacao.vlr_total_portin >= op4.vlr_total_portin && combinacao.id != op1.id && combinacao.id != op2.id && combinacao.id != op3.id && combinacao.id != op4.id) {
        menorDiferenca = diferencaAtual; // Atualiza a menor diferença
        melhorCombinacao = combinacao;   // Atualiza a melhor combinação
      }
    }
  });

  return melhorCombinacao;
}

function filtrarPorLinhas(numLinhas) {
  const resultado = [];

  combinacoes.forEach(x => {
    if (numLinhas === 1) {
      resultado.push(x);
    }

    if (numLinhas === 2 && x.linhas >= 2) {
      resultado.push(x);
    } else
      if (numLinhas === 3 && x.linhas >= 3) {
        resultado.push(x);
      } else
        if (numLinhas === 4 && x.linhas >= 4) {
          resultado.push(x);
        } else if (numLinhas === 5 && x.linhas >= 5) {
          resultado.push(x);
        } else if (numLinhas === 6 && x.linhas == 6) {
          resultado.push(x);
        }
  });

  return resultado;
}

function addValorTotal(opcao, numLinhas) {

  if (numLinhas == 1) {
    return opcao;
  }

  if (numLinhas == 2 && opcao.internetMovel == "50") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 50).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 50).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 2 && opcao.internetMovel == "100") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 50).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 50).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 3 && opcao.internetMovel == "100") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 100).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 100).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 3 && opcao.internetMovel == "200") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 50).toFixed(2).replace('.', ',')
    opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 50).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 4 && opcao.internetMovel == "200") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 100).toFixed(2).replace('.', ',')
    opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 100).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 4 && opcao.internetMovel == "300") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 50).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 50).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 5 && opcao.internetMovel == "300") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 100).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 100).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 5 && opcao != null && opcao.internetMovel == "600") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 50).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 50).toFixed(2).replace('.', ',')
    return opcao;
  }

  if (numLinhas == 6 && opcao != null && opcao.internetMovel == "600") {
    opcao.vlr_total = (parseFloat(opcao.vlr_total) + 100).toFixed(2).replace('.', ','),
      opcao.vlr_total_portin = (parseFloat(opcao.vlr_total_portin) + 100).toFixed(2).replace('.', ',')
    return opcao;
  }

  return opcao;
}

function sumValues() {
  var vlrMovel = document.getElementById("vlrmovel").value;
  var vlrBl = document.getElementById("vlrbl").value;

  var result = parseFloat(vlrMovel) + parseFloat(vlrBl);

  document.getElementById("vfl").value = result;
  return result
}

function showPlan(op1, op2, op3, op4, op5) {

  document.getElementById("faixaNome1").innerText = op1.internetMovel;
  //document.getElementById("vlr_movel1").innerText = op1.vlr_movel;
  document.getElementById("ibl1").innerText = op1.internetBandaLarga;
  document.getElementById("veloc1").innerText = op1.internetBandaLarga == 1 ? "Giga" : "Mega";
  //document.getElementById("vlrBl1").innerText = op1.vlr_bl;
  document.getElementById("totalFaixa1").innerText = formatToMoney(op1.vlr_total_portin)

  document.getElementById("faixaNome2").innerText = op2.internetMovel;
  //document.getElementById("vlr_movel2").innerText = op2.vlr_movel;
  document.getElementById("ibl2").innerText = op2.internetBandaLarga;
  document.getElementById("veloc2").innerText = op2.internetBandaLarga == 1 ? "Giga" : "Mega";
  //document.getElementById("vlrBl2").innerText = op2.vlr_bl;
  document.getElementById("totalFaixa2").innerText = formatToMoney(op2.vlr_total_portin)

  document.getElementById("faixaNome3").innerText = op3.internetMovel;
  //document.getElementById("vlr_movel3").innerText = op3.vlr_movel;
  document.getElementById("ibl3").innerText = op3.internetBandaLarga;
  document.getElementById("veloc3").innerText = op3.internetBandaLarga == 1 ? "Giga" : "Mega";
  //document.getElementById("vlrBl3").innerText = op3.vlr_bl;
  document.getElementById("totalFaixa3").innerText = formatToMoney(op3.vlr_total_portin)

  if (op4 != null) {
    document.getElementById("faixaNome4").innerText = op4.internetMovel;
    //document.getElementById("vlr_movel4").innerText = op4.vlr_movel;
    document.getElementById("ibl4").innerText = op4.internetBandaLarga;
    document.getElementById("veloc4").innerText = op4.internetBandaLarga == 1 ? "Giga" : "Mega";
    //document.getElementById("vlrBl4").innerText = op4.vlr_bl;
    document.getElementById("totalFaixa4").innerText = formatToMoney(op4.vlr_total_portin)
  }

  if (op5 != null) {
    document.getElementById("faixaNome5").innerText = op5.internetMovel;
    //document.getElementById("vlr_movel5").innerText = op5.vlr_movel;
    document.getElementById("ibl5").innerText = op5.internetBandaLarga;
    document.getElementById("veloc5").innerText = op5.internetBandaLarga == 1 ? "Giga" : "Mega";
    //document.getElementById("vlrBl5").innerText = op5.vlr_bl;
    document.getElementById("totalFaixa5").innerText = formatToMoney(op5.vlr_total_portin)
  }

}

function clearHTML() {
  document.getElementById("faixaNome1").innerText = "";
  //document.getElementById("vlr_movel1").innerText = "";
  document.getElementById("ibl1").innerText = "";
  //document.getElementById("vlrBl1").innerText = "";
  document.getElementById("totalFaixa1").innerText = "";

  document.getElementById("faixaNome2").innerText = "";
  //document.getElementById("vlr_movel2").innerText = "";
  document.getElementById("ibl2").innerText = "";
  //document.getElementById("vlrBl2").innerText = "";
  document.getElementById("totalFaixa2").innerText = "";

  document.getElementById("faixaNome3").innerText = "";
  //document.getElementById("vlr_movel3").innerText = "";
  document.getElementById("ibl3").innerText = "";
  //document.getElementById("vlrBl3").innerText = "";
  document.getElementById("totalFaixa3").innerText = "";

  document.getElementById("faixaNome4").innerText = "";
  //document.getElementById("vlr_movel4").innerText = "";
  document.getElementById("ibl4").innerText = "";
  //document.getElementById("vlrBl4").innerText = "";
  document.getElementById("totalFaixa4").innerText = "";

  document.getElementById("faixaNome5").innerText = "";
  //document.getElementById("vlr_movel5").innerText = "";
  document.getElementById("ibl5").innerText = "";
  //getElementById("vlrBl5").innerText = "";
  document.getElementById("totalFaixa5").innerText = "";
}

function toggleTheme() {
  const body = document.body;
  const button = document.getElementById('themeToggle');

  body.classList.toggle('dark-mode');
  document.querySelectorAll('.card').forEach(card => card.classList.toggle('dark-mode'));
  document.querySelectorAll('button').forEach(btn => btn.classList.toggle('dark-mode'));

  // Alterar o ícone do botão com base no tema
  if (body.classList.contains('dark-mode')) {
    button.textContent = '🌜';
  } else {
    button.textContent = '🌞';
  }
}

function updateImage(op1, op2, op3, op4, op5) {
  var imgCombo1 = document.getElementById("imgCombo1");
  imgCombo1.style.width = "200px";

  var imgCombo2 = document.getElementById("imgCombo2");
  imgCombo2.style.width = "200px";

  var imgCombo3 = document.getElementById("imgCombo3");
  imgCombo3.style.width = "200px";

  var imgCombo4 = document.getElementById("imgCombo4");
  imgCombo4.style.width = "200px";

  var imgCombo5 = document.getElementById("imgCombo5");
  imgCombo5.style.width = "200px";


  var imgPosPre1 = document.getElementById("imgPosPre1");
  imgPosPre1.src = "img/claroPos.png"
  imgPosPre1.style.width = "100px";

  var imgPosPre2 = document.getElementById("imgPosPre2");
  imgPosPre2.src = "img/claroPos.png"
  imgPosPre2.style.width = "100px";

  var imgPosPre3 = document.getElementById("imgPosPre3");
  imgPosPre3.src = "img/claroPos.png"
  imgPosPre3.style.width = "100px";

  var imgPosPre4 = document.getElementById("imgPosPre4");
  imgPosPre4.src = "img/claroPos.png"
  imgPosPre4.style.width = "100px";

  var imgPosPre5 = document.getElementById("imgPosPre5");
  imgPosPre5.src = "img/claroPos.png"
  imgPosPre5.style.width = "100px";

  var bonus1 = document.getElementById("bonus1");
  bonus1.src = "img/10GBblack.png"
  var bonus2 = document.getElementById("bonus2");
  bonus2.src = "img/10GBblack.png"
  var bonus3 = document.getElementById("bonus3");
  bonus3.src = "img/10GBblack.png"
  var bonus4 = document.getElementById("bonus4");
  bonus4.src = "img/10GBblack.png"
  var bonus5 = document.getElementById("bonus5");
  bonus5.src = "img/10GBblack.png"

  switch (op1.internetMovel) {
    case "20":
      imgCombo1.src = "img/20gb.jpg";
      imgPosPre1.src = "img/claroControle.png"
      break;
    case "25":
      imgCombo1.src = "img/25gb.jpg";
      imgPosPre1.src = "img/claroControle.png"
      break;
    case "50":
      imgCombo1.src = "img/50gb.png";
      break;
    case "100":
      imgCombo1.src = "img/100gb.png";
      bonus1.src = "img/30GBblack.png"
      break;
    case "200":
      imgCombo1.src = "img/200gb.png";
      bonus1.src = "img/50GBblack.png"
      break;
    case "300":
      imgCombo1.src = "img/300gb.png";
      bonus1.src = "img/50GBblack.png"
      break;
    case "600":
      imgCombo1.src = "img/600gb.png";
      bonus1.src = "img/50GBblack.png"
      break;
    default:
      imgCombo1.src = "img/nada.jpg";
      // Opcional: código para imagem padrão ou ação alternativa
      break;
  }

  switch (op2.internetMovel) {
    case "20":
      imgCombo2.src = "img/20gb.jpg";
      imgPosPre2.src = "img/claroControle.png"
      break;
    case "25":
      imgCombo2.src = "img/25gb.jpg";
      imgPosPre2.src = "img/claroControle.png"
      break;
    case "50":
      imgCombo2.src = "img/50gb.png";
      break;
    case "100":
      imgCombo2.src = "img/100gb.png";
      bonus2.src = "img/30GBblack.png"
      break;
    case "200":
      imgCombo2.src = "img/200gb.png";
      bonus2.src = "img/50GBblack.png"
      break;
    case "300":
      imgCombo2.src = "img/300gb.png";
      bonus2.src = "img/50GBblack.png"
      break;
    case "600":
      imgCombo2.src = "img/600gb.png";
      bonus2.src = "img/50GBblack.png"
      break;
    default:
      // Opcional: código para imagem padrão ou ação alternativa
      break;
  }

  switch (op3.internetMovel) {
    case "20":
      imgCombo3.src = "img/20gb.jpg";
      imgPosPre3.src = "img/claroControle.png"
      break;
    case "25":
      imgCombo3.src = "img/25gb.jpg";
      imgPosPre3.src = "img/claroControle.png"
      break;
    case "50":
      imgCombo3.src = "img/50gb.png";
      break;
    case "100":
      imgCombo3.src = "img/100gb.png";
      bonus3.src = "img/30GBblack.png"
      break;
    case "200":
      imgCombo3.src = "img/200gb.png";
      bonus3.src = "img/50GBblack.png"
      break;
    case "300":
      imgCombo3.src = "img/300gb.png";
      bonus3.src = "img/50GBblack.png"
      break;
    case "600":
      imgCombo3.src = "img/600gb.png";
      bonus3.src = "img/50GBblack.png"
      break;
    default:
      // Opcional: código para imagem padrão ou ação alternativa
      break;
  }

  if (op4 != null) {
    switch (op4.internetMovel) {
      case "20":
        imgCombo4.src = "img/20gb.jpg";
        imgPosPre4.src = "img/claroControle.png"
        break;
      case "25":
        imgCombo4.src = "img/25gb.jpg";
        imgPosPre4.src = "img/claroControle.png"
        break;
      case "50":
        imgCombo4.src = "img/50gb.png";
        break;
      case "100":
        imgCombo4.src = "img/100gb.png";
        bonus4.src = "img/30GBblack.png"
        break;
      case "200":
        imgCombo4.src = "img/200gb.png";
        bonus4.src = "img/50GBblack.png"
        break;
      case "300":
        imgCombo4.src = "img/300gb.png";
        bonus4.src = "img/50GBblack.png"
        break;
      case "600":
        imgCombo4.src = "img/600gb.png";
        bonus4.src = "img/50GBblack.png"
        break;
      default:
        // Opcional: código para imagem padrão ou ação alternativa
        break;
    }
  }

  if (op5 != null) {
    switch (op5.internetMovel) {
      case "20":
        imgCombo5.src = "img/20gb.jpg";
        imgPosPre5.src = "img/claroControle.png"
        break;
      case "25":
        imgCombo5.src = "img/25gb.jpg";
        imgPosPre5.src = "img/claroControle.png"
        break;
      case "50":
        imgCombo5.src = "img/50gb.png";
        break;
      case "100":
        imgCombo5.src = "img/100gb.png";
        bonus5.src = "img/30GBblack.png"
        break;
      case "200":
        imgCombo5.src = "img/200gb.png";
        bonus5.src = "img/50GBblack.png"
        break;
      case "300":
        imgCombo5.src = "img/300gb.png";
        bonus5.src = "img/50GBblack.png"
        break;
      case "600":
        imgCombo5.src = "img/600gb.png";
        bonus5.src = "img/50GBblack.png"
        break;
      default:
        // Opcional: código para imagem padrão ou ação alternativa
        break;
    }
  }
}


function toggleSidebar() {
  // Função para mostrar/ocultar o menu lateral
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  sidebar.classList.toggle('hidden');
  mainContent.classList.toggle('expanded');
}

function calcDif(op1, op2, op3, op4, op5, valor) {
  var vlrDif1 = document.getElementById("vlrDif1");
  var vlrDif2 = document.getElementById("vlrDif2");
  var vlrDif3 = document.getElementById("vlrDif3");
  var vlrDif4 = document.getElementById("vlrDif4");
  var vlrDif5 = document.getElementById("vlrDif5");

  // Função para definir o valor e cor de acordo com o valor negativo ou positivo
  function setVlrDif(element, difference) {
    element.innerText = null;
    element.innerText = formatToMoney(difference.toFixed(2))
    element.style.color = difference < 0 ? "red" : "black";
    element.style.fontWeight = "bold"
  }

  setVlrDif(vlrDif1, parseFloat(op1.vlr_total_portin) - valor);
  setVlrDif(vlrDif2, parseFloat(op2.vlr_total_portin) - valor);
  setVlrDif(vlrDif3, parseFloat(op3.vlr_total_portin) - valor);
  if (op4) {
    setVlrDif(vlrDif4, parseFloat(op4.vlr_total_portin) - valor);
  }
  if (op5) {
    setVlrDif(vlrDif5, parseFloat(op5.vlr_total_portin) - valor);
  }

}

function showCards() {
  document.getElementById('main-content')
  // Seleciona o container dos cards
  const cardContainer = document.querySelector('.main-content');

  // Alterna a visibilidade dos cards
  if (cardContainer.style.display === 'none' || cardContainer.style.display === '') {
    cardContainer.style.display = 'block'; // Mostra os cards
  }
}

function formatToMoney(valor) {
  return valor.replace('.', ',')
}

