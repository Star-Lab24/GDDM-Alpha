/* =====================================================
   DELÍCIAS DO MILHO 2.0
   SCRIPT PRINCIPAL
   ----------------------------------
   Módulo 1 - Base do Sistema
===================================================== */

"use strict";

/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const APP = {

    nome: "Delícias do Milho",

    versao: "2.0",

    storage: "delicias-do-milho"

};


/* =====================================================
   BANCO DE DADOS
===================================================== */

let banco = {

    produtos: [],

    fechamentos: [],

    configuracoes: {

        tema: "claro"

    }

};


/* =====================================================
   CARREGAR BANCO
===================================================== */

function carregarBanco() {

    const dados = localStorage.getItem(APP.storage);

    if (!dados) {

        salvarBanco();

        return;

    }

    try {

        banco = JSON.parse(dados);

    }

    catch (erro) {

        console.error("Erro ao carregar banco.");

        salvarBanco();

    }

}


/* =====================================================
   SALVAR BANCO
===================================================== */

function salvarBanco() {

    localStorage.setItem(

        APP.storage,

        JSON.stringify(banco)

    );

}


/* =====================================================
   UTILITÁRIOS
===================================================== */

function gerarId() {

    return Date.now();

}



function formatarMoeda(valor) {

    return valor.toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}



function formatarData(data) {

    return new Date(data)

        .toLocaleDateString("pt-BR");

}


/* =====================================================
   ELEMENTOS
===================================================== */

const elementos = {};



function carregarElementos() {

    elementos.paginas =

        document.querySelectorAll(".page");



    elementos.menu =

        document.querySelectorAll(".menu-btn");



    elementos.dataAtual =

        document.getElementById("dataAtual");



    elementos.titulo =

        document.getElementById("tituloPagina");



    elementos.btnTema =

        document.getElementById("btnTema");



    elementos.nomeProduto =

        document.getElementById("nomeProduto");



    elementos.precoVenda =

        document.getElementById("precoVenda");



    elementos.precoCusto =

        document.getElementById("precoCusto");



    elementos.listaProdutos =

        document.getElementById("listaProdutos");

}


/* =====================================================
   DATA
===================================================== */

function atualizarData() {

    if (!elementos.dataAtual) return;

    elementos.dataAtual.textContent =

        new Date().toLocaleDateString(

            "pt-BR",

            {

                weekday: "long",

                day: "2-digit",

                month: "long",

                year: "numeric"

            }

        );

}


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function abrirPagina(nome) {

    elementos.paginas.forEach(pagina => {

        pagina.classList.remove("active-page");

    });

    elementos.menu.forEach(botao => {

        botao.classList.remove("active");

    });

    const pagina =

        document.getElementById(nome);

    if (pagina) {

        pagina.classList.add("active-page");

    }

    const botao =

        document.querySelector(

            `[data-page="${nome}"]`

        );

    if (botao) {

        botao.classList.add("active");

    }

}


/* =====================================================
   MENU
===================================================== */

function iniciarMenu() {

    elementos.menu.forEach(botao => {

        botao.addEventListener(

            "click",

            () => {

                abrirPagina(

                    botao.dataset.page

                );

            }

        );

    });

}


/* =====================================================
   TEMA
===================================================== */

function carregarTema() {

    if (

        banco.configuracoes.tema ===

        "escuro"

    ) {

        document.body.classList.add("dark");

    }

}



function alternarTema() {

    document.body.classList.toggle("dark");

    banco.configuracoes.tema =

        document.body.classList.contains("dark")

            ? "escuro"

            : "claro";

    salvarBanco();

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        carregarBanco();

        carregarElementos();

        atualizarData();

        carregarTema();

        iniciarMenu();

        if (elementos.btnTema) {

            elementos.btnTema.addEventListener(

                "click",

                alternarTema

            );

        }

    }

);

/* =====================================================
   MÓDULO 2 - PRODUTOS
===================================================== */

/* =========================
   CADASTRAR PRODUTO
========================= */

function adicionarProduto() {

    const nome = elementos.nomeProduto.value.trim();

    const precoVenda = Number(
        elementos.precoVenda.value
    );

    const precoCusto = Number(
        elementos.precoCusto.value
    );

    if (
        nome === "" ||
        precoVenda <= 0 ||
        precoCusto <= 0
    ) {

        alert("Preencha todos os campos.");

        return;

    }

    const produto = {

        id: gerarId(),

        nome,

        precoVenda,

        precoCusto

    };

    banco.produtos.push(produto);

    salvarBanco();

    limparFormularioProduto();

    carregarProdutos();

}


/* =========================
   LIMPAR FORMULÁRIO
========================= */

function limparFormularioProduto() {

    elementos.nomeProduto.value = "";

    elementos.precoVenda.value = "";

    elementos.precoCusto.value = "";

    elementos.nomeProduto.focus();

}


/* =========================
   CARREGAR PRODUTOS
========================= */

function carregarProdutos() {

    if (!elementos.listaProdutos) return;

    elementos.listaProdutos.innerHTML = "";

    banco.produtos.forEach(produto => {

        criarLinhaProduto(produto);

    });

}


/* =========================
   CRIAR LINHA
========================= */

function criarLinhaProduto(produto) {

    const tr = document.createElement("tr");

    /* Nome */

    const tdNome = document.createElement("td");

    tdNome.textContent = produto.nome;

    /* Venda */

    const tdVenda = document.createElement("td");

    tdVenda.textContent =
        formatarMoeda(produto.precoVenda);

    /* Lucro */

   const tdLucro = document.createElement("td");

   tdLucro.textContent = formatarMoeda(
     produto.precoVenda - produto.precoCusto);

   /*custo*/
   
    const tdCusto = document.createElement("td");

    tdCusto.textContent =
        formatarMoeda(produto.precoCusto);

    /* Ações */

    const tdAcoes = document.createElement("td");

    const btnEditar =
        document.createElement("button");

    btnEditar.textContent = "✏️";

    btnEditar.className = "btn-icon";

    btnEditar.addEventListener(

        "click",

        () => editarProduto(produto.id)

    );



    const btnExcluir =
        document.createElement("button");

    btnExcluir.textContent = "🗑️";

    btnExcluir.className = "btn-icon danger";

    btnExcluir.addEventListener(

        "click",

        () => excluirProduto(produto.id)

    );



    tdAcoes.append(

        btnEditar,

        btnExcluir

    );



    tr.append(

        tdNome,

        tdVenda,

        tdCusto,

        tdAcoes

    );



    elementos.listaProdutos.append(tr);

}


/* =========================
   EDITAR PRODUTO
========================= */

function editarProduto(id) {

    const produto = banco.produtos.find(

        item => item.id === id

    );

    if (!produto) return;

    const nome = prompt(

        "Nome:",

        produto.nome

    );

    if (nome === null) return;

    const venda = Number(

        prompt(

            "Preço de venda:",

            produto.precoVenda

        )

    );

    const custo = Number(

        prompt(

            "Preço de custo:",

            produto.precoCusto

        )

    );

    if (

        nome.trim() === "" ||

        venda <= 0 ||

        custo <= 0

    ) {

        alert("Dados inválidos.");

        return;

    }

    produto.nome = nome.trim();

    produto.precoVenda = venda;

    produto.precoCusto = custo;

    salvarBanco();

    carregarProdutos();

}


/* =========================
   EXCLUIR PRODUTO
========================= */

function excluirProduto(id) {

    const confirmar = confirm(

        "Deseja excluir este produto?"

    );

    if (!confirmar) return;

    banco.produtos = banco.produtos.filter(

        produto => produto.id !== id

    );

    salvarBanco();

    carregarProdutos();

}


/* =========================
   EVENTOS
========================= */

function iniciarProdutos() {

    const btn =

        document.getElementById(

            "btnSalvarProduto"

        );

    if (!btn) return;

    btn.addEventListener(

        "click",

        adicionarProduto

    );

       }

/* =====================================================
   MÓDULO 3 - FECHAMENTO
===================================================== */

/* =========================
   CARREGAR PRODUTOS
========================= */

function carregarProdutosFechamento() {

    const tbody =
        document.getElementById("produtosFechamento");

    if (!tbody) return;

    tbody.innerHTML = "";

    banco.produtos.forEach(produto => {

        const tr = document.createElement("tr");

        tr.dataset.id = produto.id;

        tr.innerHTML = `
            <td>${produto.nome}</td>

            <td>
                <input
                    type="number"
                    min="0"
                    value="0"
                    class="qtdInicial">
            </td>

            <td>
                <input
                    type="number"
                    min="0"
                    value="0"
                    class="qtdFinal">
            </td>

            <td class="vendidos">
                0
            </td>

            <td class="receita">
                ${formatarMoeda(0)}
            </td>

            <td class="lucro">
                ${formatarMoeda(0)}
            </td>
        `;

        tbody.append(tr);

        const inicial =
            tr.querySelector(".qtdInicial");

        const final =
            tr.querySelector(".qtdFinal");

        inicial.addEventListener(
            "input",
            calcularLinha
        );

        final.addEventListener(
            "input",
            calcularLinha
        );

    });

}


/* =========================
   CALCULAR LINHA
========================= */

function calcularLinha(evento) {

    const tr =
        evento.target.closest("tr");

    const id =
        Number(tr.dataset.id);

    const produto =
        banco.produtos.find(
            p => p.id === id
        );

    const inicial =
        Number(
            tr.querySelector(".qtdInicial").value
        );

    const final =
        Number(
            tr.querySelector(".qtdFinal").value
        );

    let vendidos = inicial - final;

    if (vendidos < 0) vendidos = 0;

    const receita =
        vendidos * produto.precoVenda;

    const custo =
        vendidos * produto.precoCusto;

    const lucro =
        receita - custo;

    tr.querySelector(".vendidos").textContent =
        vendidos;

    tr.querySelector(".receita").textContent =
        formatarMoeda(receita);

    tr.querySelector(".lucro").textContent =
        formatarMoeda(lucro);

    atualizarResumoFechamento();

}


/* =========================
   RESUMO
========================= */

function atualizarResumoFechamento() {

    let receita = 0;

    let custo = 0;

    let lucro = 0;

    document.querySelectorAll(
        "#produtosFechamento tr"
    ).forEach(tr => {

        const id =
            Number(tr.dataset.id);

        const produto =
            banco.produtos.find(
                p => p.id === id
            );

        const vendidos =
            Number(
                tr.querySelector(".vendidos").textContent
            );

        receita +=
            vendidos * produto.precoVenda;

        custo +=
            vendidos * produto.precoCusto;

        lucro +=
            (produto.precoVenda - produto.precoCusto)
            * vendidos;

    });

    document.getElementById(
        "receitaFechamento"
    ).textContent =
        formatarMoeda(receita);

    document.getElementById(
        "custoFechamento"
    ).textContent =
        formatarMoeda(custo);

    document.getElementById(
        "lucroFechamento"
    ).textContent =
        formatarMoeda(lucro);

               }
/* =====================================================
   MÓDULO 4 - SALVAR FECHAMENTO
===================================================== */

function salvarFechamento() {

    const data = document.getElementById("dataFechamento").value;

    const local = document.getElementById("local").value.trim();

    if (data === "") {

        alert("Informe a data.");

        return;

    }

    if (local === "") {

        alert("Informe o local.");

        return;

    }

    const despesas = Number(
        document.getElementById("despesasExtras").value
    ) || 0;

    const taxas = Number(
        document.getElementById("taxas").value
    ) || 0;

    const impostos = Number(
        document.getElementById("impostos").value
    ) || 0;

    const observacao =
        document.getElementById("observacao").value.trim();

    let itens = [];

    let receitaTotal = 0;

    let custoTotal = 0;

    let lucroTotal = 0;

    document
        .querySelectorAll("#produtosFechamento tr")
        .forEach(tr => {

            const id = Number(tr.dataset.id);

            const produto = banco.produtos.find(
                p => p.id === id
            );

            const inicial = Number(
                tr.querySelector(".qtdInicial").value
            );

            const final = Number(
                tr.querySelector(".qtdFinal").value
            );

            const vendidos = Math.max(
                0,
                inicial - final
            );

            const receita =
                vendidos * produto.precoVenda;

            const custo =
                vendidos * produto.precoCusto;

            const lucro =
                receita - custo;

            itens.push({

                produtoId: produto.id,

                nome: produto.nome,

                inicial,

                final,

                vendidos,

                receita,

                custo,

                lucro

            });

            receitaTotal += receita;

            custoTotal += custo;

            lucroTotal += lucro;

        });

    const lucroLiquido =

        lucroTotal -

        despesas -

        taxas -

        impostos;

    const fechamento = {

        id: gerarId(),

        data,

        local,

        produtos: itens,

        despesas,

        taxas,

        impostos,

        receitaTotal,

        custoTotal,

        lucroBruto: lucroTotal,

        lucroLiquido,

        observacao

    };

    banco.fechamentos.push(fechamento);

    salvarBanco();

    atualizarDashboard();

    carregarHistorico();

    mostrarRelatorio(fechamento);

    alert("Fechamento salvo com sucesso!");

}
/* =====================================================
   MÓDULO 5 - DASHBOARD
===================================================== */

function atualizarDashboard() {

    const venda = document.getElementById("vendaTotal");
    const lucro = document.getElementById("lucroTotal");
    const vendidos = document.getElementById("produtosVendidos");
    const ultimo = document.getElementById("ultimoFechamento");

    if (!venda) return;

    if (banco.fechamentos.length === 0) {

        venda.textContent = formatarMoeda(0);

        lucro.textContent = formatarMoeda(0);

        vendidos.textContent = "0";

        ultimo.textContent = "Nenhum";

        return;

    }

    const fechamento = banco.fechamentos[
        banco.fechamentos.length - 1
    ];

    venda.textContent =
        formatarMoeda(fechamento.receitaTotal);

    lucro.textContent =
        formatarMoeda(fechamento.lucroLiquido);

    let totalVendidos = 0;

    fechamento.produtos.forEach(produto => {

        totalVendidos += produto.vendidos;

    });

    vendidos.textContent = totalVendidos;

    ultimo.textContent =
        `${fechamento.data} - ${fechamento.local}`;

}

/* =====================================================
   MÓDULO 6 - HISTÓRICO
===================================================== */

/* ==========================
   CARREGAR HISTÓRICO
========================== */

function carregarHistorico() {

    const tabela =
        document.getElementById("historicoTabela");

    if (!tabela) return;

    tabela.innerHTML = "";

    if (banco.fechamentos.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum fechamento cadastrado.
                </td>
            </tr>
        `;

        return;

    }

    [...banco.fechamentos]

        .reverse()

        .forEach(fechamento => {

            criarLinhaHistorico(fechamento);

        });

}


/* ==========================
   LINHA DA TABELA
========================== */

function criarLinhaHistorico(fechamento) {

    const tr = document.createElement("tr");

    /* Data */

    const tdData =
        document.createElement("td");

    tdData.textContent =
        fechamento.data;

    /* Local */

    const tdLocal =
        document.createElement("td");

    tdLocal.textContent =
        fechamento.local;

    /* Receita */

    const tdReceita =
        document.createElement("td");

    tdReceita.textContent =
        formatarMoeda(
            fechamento.receitaTotal
        );

    /* Lucro */

    const tdLucro =
        document.createElement("td");

    tdLucro.textContent =
        formatarMoeda(
            fechamento.lucroLiquido
        );

    /* Botões */

    const tdAcoes =
        document.createElement("td");

    const btnAbrir =
        document.createElement("button");

    btnAbrir.textContent = "Abrir";

    btnAbrir.className = "btn btn-primary";

    btnAbrir.addEventListener(

        "click",

        () => abrirRelatorio(fechamento.id)

    );

    tdAcoes.append(btnAbrir);

    tr.append(

        tdData,

        tdLocal,

        tdReceita,

        tdLucro,

        tdAcoes

    );

    document

        .getElementById("historicoTabela")

        .append(tr);

}


/* ==========================
   ABRIR RELATÓRIO
========================== */

function abrirRelatorio(id) {

    const fechamento =

        banco.fechamentos.find(

            item => item.id === id

        );

    if (!fechamento) return;

    mostrarRelatorio(fechamento);

    abrirPagina("relatorio");

}


/* ==========================
   PESQUISAR
========================== */

function pesquisarHistorico(texto) {

    const tabela =

        document.getElementById("historicoTabela");

    if (!tabela) return;

    tabela.innerHTML = "";

    texto = texto.toLowerCase();

    const resultado =

        banco.fechamentos.filter(item =>

            item.data.toLowerCase().includes(texto)

            ||

            item.local.toLowerCase().includes(texto)

        );

    resultado

        .reverse()

        .forEach(fechamento => {

            criarLinhaHistorico(fechamento);

        });

}

/* =====================================================
   MÓDULO 7 - RELATÓRIOS
===================================================== */

/* ==========================
   MOSTRAR RELATÓRIO
========================== */

function mostrarRelatorio(fechamento) {

    const area = document.getElementById("areaRelatorio");

    if (!area) return;

    let linhas = "";

    fechamento.produtos.forEach(produto => {

        linhas += `
            <tr>

                <td>${produto.nome}</td>

                <td>${produto.inicial}</td>

                <td>${produto.final}</td>

                <td>${produto.vendidos}</td>

                <td>${formatarMoeda(produto.receita)}</td>

                <td>${formatarMoeda(produto.lucro)}</td>

            </tr>
        `;

    });

    area.innerHTML = `

        <h2>🌽 Delícias do Milho</h2>

        <hr>

        <p><strong>Data:</strong> ${fechamento.data}</p>

        <p><strong>Local:</strong> ${fechamento.local}</p>

        <br>

        <table>

            <thead>

                <tr>

                    <th>Produto</th>

                    <th>Inicial</th>

                    <th>Final</th>

                    <th>Vendidos</th>

                    <th>Receita</th>

                    <th>Lucro</th>

                </tr>

            </thead>

            <tbody>

                ${linhas}

            </tbody>

        </table>

        <br>

        <h3>Resumo Financeiro</h3>

        <p><strong>Receita:</strong> ${formatarMoeda(fechamento.receitaTotal)}</p>

        <p><strong>Custo:</strong> ${formatarMoeda(fechamento.custoTotal)}</p>

        <p><strong>Lucro Bruto:</strong> ${formatarMoeda(fechamento.lucroBruto)}</p>

        <p><strong>Despesas:</strong> ${formatarMoeda(fechamento.despesas)}</p>

        <p><strong>Taxas:</strong> ${formatarMoeda(fechamento.taxas)}</p>

        <p><strong>Impostos:</strong> ${formatarMoeda(fechamento.impostos)}</p>

        <hr>

        <h2>

            Lucro Líquido:
            ${formatarMoeda(fechamento.lucroLiquido)}

        </h2>

        <br>

        <p>

            <strong>Observações:</strong>

        </p>

        <p>

            ${fechamento.observacao || "Nenhuma observação."}

        </p>

    `;

}


/* ==========================
   IMPRIMIR
========================== */

function imprimirRelatorio() {

    window.print();

}

/* =====================================================
   MÓDULO 8 - BACKUP E CONFIGURAÇÕES
===================================================== */

/* ==========================
   EXPORTAR BACKUP
========================== */

function exportarBackup() {

    const dados = JSON.stringify(banco, null, 2);

    const blob = new Blob(
        [dados],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "backup-delicias-do-milho.json";

    link.click();

    URL.revokeObjectURL(url);

}


/* ==========================
   RESTAURAR BACKUP
========================== */

function restaurarBackup() {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.addEventListener("change", event => {

        const arquivo = event.target.files[0];

        if (!arquivo) return;

        const leitor = new FileReader();

        leitor.onload = () => {

            try {

                banco = JSON.parse(leitor.result);

                salvarBanco();

                iniciarSistema();

                alert("Backup restaurado com sucesso.");

            }

            catch {

                alert("Arquivo inválido.");

            }

        };

        leitor.readAsText(arquivo);

    });

    input.click();

}


/* ==========================
   LIMPAR DADOS
========================== */

function limparDados() {

    const confirmar = confirm(

        "Deseja realmente apagar todos os dados?"

    );

    if (!confirmar) return;

    localStorage.removeItem(APP.storage);

    banco = {

        produtos: [],

        fechamentos: [],

        configuracoes: {

            tema: "claro"

        }

    };

    salvarBanco();

    iniciarSistema();

}

function iniciarSistema(){

    carregarBanco();

    carregarTema();

    atualizarData();

    carregarProdutos();

    carregarProdutosFechamento();

    carregarHistorico();

    atualizarDashboard();

}
