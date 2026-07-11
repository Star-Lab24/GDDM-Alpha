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

function produtos() {

    pageTitle.innerHTML = "Produtos";
    pageDescription.innerHTML = "Cadastre os produtos vendidos.";

    app.innerHTML = `

    <div class="pagina">

        <div class="form-card">

            <h2>Novo Produto</h2>

            <div class="form-grid">

                <input id="nome" type="text" placeholder="Nome do produto">

                <input id="venda" type="number" placeholder="Valor de venda">

                <input id="custo" type="number" placeholder="Valor de custo">

                <textarea id="descricao" placeholder="Descrição"></textarea>

            </div>

            <button class="btn" id="salvarProduto">

                Salvar Produto

            </button>

        </div>

        <div class="lista-produtos" id="listaProdutos"></div>

    </div>

    `;

    carregarProdutos();

    document
        .getElementById("salvarProduto")
        .addEventListener("click", salvarProduto);

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

// ==============================
// LOCAL STORAGE
// ==============================

function pegarProdutos() {

    return JSON.parse(localStorage.getItem("produtos")) || [];

}

function salvarLista(produtos) {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}

// ==============================
// SALVAR PRODUTO
// ==============================

function salvarProduto() {

    const nome = document.getElementById("nome").value;

    const venda = document.getElementById("venda").value;

    const custo = document.getElementById("custo").value;

    const descricao = document.getElementById("descricao").value;

    if (nome == "") {

        alert("Informe o nome do produto.");

        return;

    }

    const produtos = pegarProdutos();

    produtos.push({

        id: Date.now(),

        nome,

        venda,

        custo,

        descricao

    });

    salvarLista(produtos);

    carregarProdutos();

    limparFormulario();

}

// ==============================
// LIMPAR
// ==============================

function limparFormulario() {

    document.getElementById("nome").value = "";

    document.getElementById("venda").value = "";

    document.getElementById("custo").value = "";

    document.getElementById("descricao").value = "";

}

// ==============================
// LISTAR PRODUTOS
// ==============================

function carregarProdutos() {

    const lista = document.getElementById("listaProdutos");

    if (!lista) return;

    const produtos = pegarProdutos();

    if (produtos.length == 0) {

        lista.innerHTML = `

        <div class="card">

            Nenhum produto cadastrado.

        </div>

        `;

        return;

    }

    lista.innerHTML = "";

    produtos.forEach(produto => {

        lista.innerHTML += `

        <div class="card produto-card">

            <div>

                <h3>${produto.nome}</h3>

                <small>${produto.descricao}</small>

            </div>

            <div>

                <strong>Venda</strong>

                <p>R$ ${produto.venda}</p>

            </div>

            <div>

                <strong>Custo</strong>

                <p>R$ ${produto.custo}</p>

            </div>

            <button
                class="btn excluir"
                onclick="excluirProduto(${produto.id})">

                Excluir

            </button>

        </div>

        `;

    });

}

// ==============================
// EXCLUIR
// ==============================

function excluirProduto(id) {

    let produtos = pegarProdutos();

    produtos = produtos.filter(produto => produto.id != id);

    salvarLista(produtos);

    carregarProdutos();

}
