// ==============================
// DELÍCIAS DO MILHO
// ==============================

// Elementos principais
const app = document.getElementById("app");
const pageTitle = document.getElementById("page-title");
const pageDescription = document.getElementById("page-description");
const menuItems = document.querySelectorAll(".menu-item");
const dataAtual = document.getElementById("dataAtual");

// ==============================
// DATA
// ==============================

const hoje = new Date();

dataAtual.innerHTML = hoje.toLocaleDateString("pt-BR",{
    weekday:"long",
    day:"2-digit",
    month:"long",
    year:"numeric"
});

// ==============================
// MENU
// ==============================

menuItems.forEach(botao=>{

    botao.addEventListener("click",()=>{

        menuItems.forEach(item=>item.classList.remove("active"));

        botao.classList.add("active");

        abrirPagina(botao.dataset.page);

    });

});

// ==============================
// TROCA DE TELAS
// ==============================

function abrirPagina(pagina){

    switch(pagina){

        case "dashboard":
            dashboard();
            break;

        case "produtos":
            produtos();
            break;

        case "fechamento":
            fechamento();
            break;

        case "historico":
            historico();
            break;

        case "configuracoes":
            configuracoes();
            break;

    }

}

// ==============================
// DASHBOARD
// ==============================

function dashboard(){

pageTitle.innerHTML="Dashboard";

pageDescription.innerHTML="Resumo do dia.";

app.innerHTML=`

<div class="cards">

<div class="card">

<h3>Venda do Dia</h3>

<h2>R$ 0,00</h2>

</div>

<div class="card">

<h3>Lucro</h3>

<h2>R$ 0,00</h2>

</div>

<div class="card">

<h3>Produtos Vendidos</h3>

<h2>0</h2>

</div>

<div class="card">

<h3>Relatórios</h3>

<h2>0</h2>

</div>

</div>

`;

}

// ==============================
// PRODUTOS
// ==============================

function produtos(){

pageTitle.innerHTML="Produtos";

pageDescription.innerHTML="Cadastro de produtos.";

app.innerHTML=`

<h2>Em desenvolvimento...</h2>

`;

}

// ==============================
// FECHAMENTO
// ==============================

function fechamento(){

pageTitle.innerHTML="Fechamento";

pageDescription.innerHTML="Fechamento do dia.";

app.innerHTML=`

<h2>Em desenvolvimento...</h2>

`;

}

// ==============================
// HISTÓRICO
// ==============================

function historico(){

pageTitle.innerHTML="Histórico";

pageDescription.innerHTML="Relatórios anteriores.";

app.innerHTML=`

<h2>Em desenvolvimento...</h2>

`;

}

// ==============================
// CONFIGURAÇÕES
// ==============================

function configuracoes(){

pageTitle.innerHTML="Configurações";

pageDescription.innerHTML="Preferências do sistema.";

app.innerHTML=`

<h2>Em desenvolvimento...</h2>

`;

}

// ==============================
// INICIAR SISTEMA
// ==============================

dashboard();
