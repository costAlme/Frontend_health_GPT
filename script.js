const botaoGerar = document.getElementById("botao-gerar");
const loader = document.getElementById("c-loader");
const span = document.getElementById("texto-dieta");
const checkbox = document.getElementById("checkbox");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");

checkbox.addEventListener('change',  () => {
    document.body.classList.toggle('dark');
    moon.classList.toggle("hidden");
    sun.classList.toggle("hidden");
})

async function gerarDieta() {
    let idade = document.getElementById("idade").value;
    let peso = document.getElementById("peso").value;
    let altura = document.getElementById("altura").value;
    let select = document.getElementById("objetivo");
    let objetivo = select.options[select.selectedIndex].textContent;
    
    event.preventDefault();
    const body = {
        "idade": idade,
        "peso": peso,
        "altura": altura,
        "objetivo": objetivo 
    };
    
    desabilitarBotao(botaoGerar);
    gerandoDieta(span);

    try {
        const response = await fetch("https://healthgpt.vsportfolio.com.br/api/v1/diet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await (await response.text()).replace(/\n\n/g, "<br> <br>").replace("<br>", "");
            dietaGerada(span, data);
            habilitarBotao(botaoGerar);
        } else {
            throw new Error('Erro na requisição!');
        }
    } catch (error) {
        erroAoGerarDieta(span);
        habilitarBotao(botaoGerar);
        console.error(error);
    }
}

function habilitarBotao(botaoGerar){
    botaoGerar.classList.add("enabled");
    botaoGerar.classList.remove("disabled");
    botaoGerar.disabled = false;
}

function desabilitarBotao(botaoGerar){
    botaoGerar.classList.remove("enabled");
    botaoGerar.classList.add("disabled");
    botaoGerar.disabled = true;
}

function gerandoDieta(span){
    span.classList.remove("erro-gerando-dieta");
    span.classList.remove("dieta-gerada");
    span.classList.add("gerando-dieta");
    span.innerHTML = 'Gerando dieta...';
    loader.classList.remove("hidden");
}

function dietaGerada(span, data){
    span.classList.remove("texto-dieta")
    span.classList.remove("gerando-dieta")
    span.classList.remove("erro-gerando-dieta")
    span.classList.add("dieta-gerada")
    span.innerHTML = data.replace("<br>", "");
    loader.classList.add("hidden");
}

function erroAoGerarDieta(span){
    span.classList.remove("gerando-dieta")
    span.classList.remove("dieta-gerada")
    span.classList.add("erro-gerando-dieta")
    span.innerHTML = 'Houve um erro interno! <br> Por favor, tente novamente mais tarde...';
    loader.classList.add("hidden");
}