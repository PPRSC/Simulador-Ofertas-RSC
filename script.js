
loadJson()
var Combinations;

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
            Combinations = data
            //alert(data)
        })
        .catch(error => {
            // Manipular erros
            console.error('Erro:', error);
        });
}


function filterByOptions(){

    loadJson()
    clearHTML()

    var BaseUR = document.getElementById("baseUR")
    var Port = document.getElementById("Port")

    var isPortAndUr = BaseUR.checked && Port.checked ? true : false

    var qtdLinhas = parseInt(document.getElementById("linhas").value);

    var totalValue = sumValues()

    var filterCombo

    if (isPortAndUr) {
        filterCombo = Object.values(Combinations.Combinations).map((x) => {
            switch (x.InternetMovel) {
                case "28GB":
                    x.vlr_movel = 49.90;
                    x.vlr_total = x.vlr_movel + x.vlr_bl
                    break;
                case "100GB":
                    x.vlr_movel = 79.90;
                    x.vlr_total = x.vlr_movel + x.vlr_bl
                    break;
                case "200GB":
                    x.vlr_movel = 139.90;
                    x.vlr_total = x.vlr_movel + x.vlr_bl
                    break;
                case "300GB":
                    x.vlr_movel = 189.90;
                    x.vlr_total = x.vlr_movel + x.vlr_bl
                    break;
                default:
                    // Caso não seja 28GB ou 100GB, manter o valor original ou adicionar outro tratamento
                    break;
            }
            return x;
        });
    }else{
        filterCombo = Object.values(Combinations.Combinations)
    }

    if(qtdLinhas > 1){
        filterCombo = filterCombo.filter((x) => x.Linhas.includes(qtdLinhas))
        updateValues(filterCombo,qtdLinhas)
    }

    var result = buildCombo(filterCombo,totalValue)
    
    showPlan(filterCombo)

}

function buildCombo(planos, valor) {
    const op1 = opcao1(planos, valor);
    const op2 = opcao2(planos, valor, op1);
    
    return { op1, op2 };
}

function opcao1(planos, valor) {
    let closestFaixa1 = null;
    let smallestDifference = Infinity;

    for (const faixa in planos) {
        const faixaInfo = planos[faixa];
        const difference = Math.abs(faixaInfo.vlr_total - valor);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestFaixa1 = faixaInfo;
        }
    }

    return closestFaixa1;
}

function opcao2(planos, valor, currentFaixa) {
    let closestFaixa = null;
    let smallestDifference = Infinity;

    const currentInternetMovelValue = parseInt(currentFaixa.InternetMovel.replace("GB", ""));
    const currentInternetBandaLargaValue = parseInt(currentFaixa.InternetBandaLarga.split(' ')[0]); // Convertendo a unidade de internet banda larga para número

    for (const faixa in planos) {
        const faixaInfo = planos[faixa];
        const difference = Math.abs(faixaInfo.vlr_total - valor);
        const internetMovelValue = parseInt(faixaInfo.InternetMovel.replace("GB", ""));
        const internetBandaLargaValue = parseInt(faixaInfo.InternetBandaLarga.split(' ')[0]); // Convertendo a unidade de internet banda larga para número

        // Verifica as condições:
        if (
            internetMovelValue > currentInternetMovelValue &&
            internetBandaLargaValue < currentInternetBandaLargaValue &&
            faixaInfo.vlr_total < valor && // Nova condição: valor total deve ser menor que o valor inserido
            (difference < smallestDifference || closestFaixa === null)
        ) {
            smallestDifference = difference;
            closestFaixa = faixaInfo;
        }
    }

    return closestFaixa;
}

function updateValues(filterCombo, qtdLinhas){
    filterCombo = Object.values(Combinations.Combinations).map((x) => {
        switch (qtdLinhas) {
            case 2:
                if(x.InternetMovel == "50GB")
                    x.vlr_total = x.vlr_total + 50.00

                if(x.InternetMovel == "100GB")
                    x.vlr_total = x.vlr_total + 50.00
                break;
            case 3:
                if(x.InternetMovel == "100GB")
                    x.vlr_total = x.vlr_total + 100.00
                break;
            case 4:
                if(x.InternetMovel == "200GB")
                    x.vlr_total = x.vlr_total + 50.00

                if(x.InternetMovel == "300GB")
                    x.vlr_total = x.vlr_total + 50.00

                if(x.InternetMovel == "600GB")
                    x.vlr_total = x.vlr_total + 50.00
                break;
            case 5:
                if(x.InternetMovel == "200GB")
                    x.vlr_total = x.vlr_total + 100.00

                if(x.InternetMovel == "300GB")
                    x.vlr_total = x.vlr_total + 100.00

                if(x.InternetMovel == "600GB")
                    x.vlr_total = x.vlr_total + 100.00
                break;
            case 6:
                if(x.InternetMovel == "200GB")
                    x.vlr_total = x.vlr_total + 150.00

                if(x.InternetMovel == "300GB")
                    x.vlr_total = x.vlr_total + 150.00
                break;
            default:
                // xxxx
                break;
        }
        return x;
    });
}


function sumValues() {
    var vlrMovel = document.getElementById("vlrmovel").value;
    var vlrBl = document.getElementById("vlrbl").value;

    var result = parseFloat(vlrMovel) + parseFloat(vlrBl);

    document.getElementById("vfl").value = result;
    return result
    //showPlan()
}

function showPlan(filterCombo) {

    document.getElementById("faixaNome1").innerText = filterCombo[0].InternetMovel;
    document.getElementById("vlr_movel1").innerText = filterCombo[0].vlr_movel;
    document.getElementById("ibl1").innerText = filterCombo[0].InternetBandaLarga;
    document.getElementById("vlrBl1").innerText = filterCombo[0].vlr_bl;
    document.getElementById("totalFaixa1").innerText = filterCombo[0].vlr_total

    document.getElementById("faixaNome2").innerText = filterCombo[1].InternetMovel;
    document.getElementById("vlr_movel2").innerText = filterCombo[1].vlr_movel;
    document.getElementById("ibl2").innerText = filterCombo[1].InternetBandaLarga;
    document.getElementById("vlrBl2").innerText = filterCombo[1].vlr_bl;
    document.getElementById("totalFaixa2").innerText = filterCombo[1].vlr_total

    document.getElementById("faixaNome3").innerText = filterCombo[2].InternetMovel;
    document.getElementById("vlr_movel3").innerText = filterCombo[2].vlr_movel;
    document.getElementById("ibl3").innerText = filterCombo[2].InternetBandaLarga;
    document.getElementById("vlrBl3").innerText = filterCombo[2].vlr_bl;
    document.getElementById("totalFaixa3").innerText = filterCombo[2].vlr_total

    document.getElementById("faixaNome4").innerText = filterCombo[3].InternetMovel;
    document.getElementById("vlr_movel4").innerText = filterCombo[3].vlr_movel;
    document.getElementById("ibl4").innerText = filterCombo[3].InternetBandaLarga;
    document.getElementById("vlrBl4").innerText = filterCombo[3].vlr_bl;
    document.getElementById("totalFaixa4").innerText = filterCombo[3].vlr_total

    document.getElementById("faixaNome5").innerText = filterCombo[4].InternetMovel;
    document.getElementById("vlr_movel5").innerText = filterCombo[4].vlr_movel;
    document.getElementById("ibl5").innerText = filterCombo[4].InternetBandaLarga;
    document.getElementById("vlrBl5").innerText = filterCombo[4].vlr_bl;
    document.getElementById("totalFaixa5").innerText = filterCombo[4].vlr_total
}

function clearHTML(){
    document.getElementById("faixaNome1").innerText = "";
    document.getElementById("vlr_movel1").innerText = "";
    document.getElementById("ibl1").innerText = "";
    document.getElementById("vlrBl1").innerText = "";
    document.getElementById("totalFaixa1").innerText = "";

    document.getElementById("faixaNome2").innerText = "";
    document.getElementById("vlr_movel2").innerText = "";
    document.getElementById("ibl2").innerText = "";
    document.getElementById("vlrBl2").innerText = "";
    document.getElementById("totalFaixa2").innerText = "";

    document.getElementById("faixaNome3").innerText = "";
    document.getElementById("vlr_movel3").innerText = "";
    document.getElementById("ibl3").innerText = "";
    document.getElementById("vlrBl3").innerText = "";
    document.getElementById("totalFaixa3").innerText = "";

    document.getElementById("faixaNome4").innerText = "";
    document.getElementById("vlr_movel4").innerText = "";
    document.getElementById("ibl4").innerText = "";
    document.getElementById("vlrBl4").innerText = "";
    document.getElementById("totalFaixa4").innerText = "";

    document.getElementById("faixaNome5").innerText = "";
    document.getElementById("vlr_movel5").innerText = "";
    document.getElementById("ibl5").innerText = "";
    document.getElementById("vlrBl5").innerText = "";
    document.getElementById("totalFaixa5").innerText = "";
}
