/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 1
    Configuração • Banco • Utilitários • Inicialização
=====================================================*/

"use strict";

/*====================================================
    CONFIGURAÇÃO
=====================================================*/

const APP = {
    nome: "Delícias do Milho",
    versao: "3.0",
    storage: "delicias-do-milho"
};

/*====================================================
    BANCO DE DADOS
=====================================================*/

let banco = {
    produtos: [],
    fechamentos: [],
    configuracoes: {
        tema: "claro"
    }
};

/*====================================================
    LOCAL STORAGE
=====================================================*/

function carregarBanco() {

    const dados = localStorage.getItem(APP.storage);

    if (!dados) {

        salvarBanco();
        return;

    }

    try {

        banco = JSON.parse(dados);

    } catch (erro) {

        console.error("Erro ao carregar banco.");

        salvarBanco();

    }

}

function salvarBanco() {

    localStorage.setItem(
        APP.storage,
        JSON.stringify(banco)
    );

}

/*====================================================
    UTILITÁRIOS
=====================================================*/

function gerarId() {

    return Date.now() + Math.floor(Math.random() * 999);

}

function moeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}

function dataBR(data) {

    if (!data) return "";

    return new Date(data).toLocaleDateString("pt-BR");

}

/*====================================================
    ELEMENTOS
=====================================================*/

const el = {};

function carregarElementos() {

    document.querySelectorAll("[id]").forEach(item => {

        el[item.id] = item;

    });

}

/*====================================================
    NAVEGAÇÃO
=====================================================*/

function abrirPagina(nome) {

    document
        .querySelectorAll(".page")
        .forEach(pagina => {

            pagina.classList.remove("active-page");

        });

    document
        .querySelectorAll(".menu-btn")
        .forEach(botao => {

            botao.classList.remove("active");

        });

    document
        .getElementById(nome)
        ?.classList.add("active-page");

    document
        .querySelector(`[data-page="${nome}"]`)
        ?.classList.add("active");

    if (el.tituloPagina) {

        const texto = document
            .querySelector(`[data-page="${nome}"] span`);

        if (texto) {

            el.tituloPagina.textContent =
                texto.textContent;

        }

    }

}

/*====================================================
    MENU
=====================================================*/

function iniciarMenu() {

    document
        .querySelectorAll(".menu-btn")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                abrirPagina(botao.dataset.page);

            });

        });

}

/*====================================================
    DATA
=====================================================*/

function atualizarData() {

    if (!el.dataAtual) return;

    el.dataAtual.textContent =
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

/*====================================================
    TEMA
=====================================================*/

function aplicarTema() {

    document.body.classList.toggle(
        "dark",
        banco.configuracoes.tema === "escuro"
    );

}

function alternarTema() {

    banco.configuracoes.tema =
        banco.configuracoes.tema === "claro"
            ? "escuro"
            : "claro";

    aplicarTema();

    salvarBanco();

}

/*====================================================
    INICIAR SISTEMA
=====================================================*/

function iniciarSistema() {

    carregarBanco();

    carregarElementos();

    atualizarData();

    aplicarTema();

    iniciarMenu();

    if (el.btnTema) {

        el.btnTema.addEventListener(
            "click",
            alternarTema
        );

    }

    console.log(
        `${APP.nome} ${APP.versao} iniciado com sucesso.`
    );

}

/*====================================================
    INICIALIZAÇÃO
=====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 2
    CRUD DE PRODUTOS
=====================================================*/

/*====================================================
    ADICIONAR PRODUTO
=====================================================*/

function adicionarProduto() {

    const nome = el.nomeProduto.value.trim();

    const precoVenda = Number(el.precoVenda.value);

    const precoCusto = Number(el.precoCusto.value);

    if (
        nome === "" ||
        precoVenda <= 0 ||
        precoCusto <= 0
    ) {

        alert("Preencha todos os campos corretamente.");

        return;

    }

    banco.produtos.push({

        id: gerarId(),

        nome,

        precoVenda,

        precoCusto

    });

    salvarBanco();

    limparFormularioProduto();

    carregarProdutos();

}

/*====================================================
    LIMPAR FORMULÁRIO
=====================================================*/

function limparFormularioProduto() {

    el.nomeProduto.value = "";

    el.precoVenda.value = "";

    el.precoCusto.value = "";

    el.nomeProduto.focus();

}

/*====================================================
    CARREGAR PRODUTOS
=====================================================*/

function carregarProdutos() {

    if (!el.listaProdutos) return;

    el.listaProdutos.innerHTML = "";

    if (banco.produtos.length === 0) {

        el.listaProdutos.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;

    }

    banco.produtos.forEach(produto => {

        criarLinhaProduto(produto);

    });

}

/*====================================================
    CRIAR LINHA
=====================================================*/

function criarLinhaProduto(produto) {

    const lucro =
        produto.precoVenda - produto.precoCusto;

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td>${produto.nome}</td>

        <td>${moeda(produto.precoVenda)}</td>

        <td>${moeda(produto.precoCusto)}</td>

        <td>${moeda(lucro)}</td>

        <td>

            <button
                class="btn btn-warning btnEditar">

                ✏️

            </button>

            <button
                class="btn btn-danger btnExcluir">

                🗑️

            </button>

        </td>

    `;

    tr.querySelector(".btnEditar")
        .addEventListener("click", () => {

            editarProduto(produto.id);

        });

    tr.querySelector(".btnExcluir")
        .addEventListener("click", () => {

            excluirProduto(produto.id);

        });

    el.listaProdutos.appendChild(tr);

}

/*====================================================
    EDITAR PRODUTO
=====================================================*/

function editarProduto(id) {

    const produto = banco.produtos.find(

        p => p.id === id

    );

    if (!produto) return;

    const nome = prompt(
        "Nome do produto:",
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

/*====================================================
    EXCLUIR PRODUTO
=====================================================*/

function excluirProduto(id) {

    const confirmar = confirm(
        "Deseja excluir este produto?"
    );

    if (!confirmar) return;

    banco.produtos =
        banco.produtos.filter(

            produto => produto.id !== id

        );

    salvarBanco();

    carregarProdutos();

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarProdutos() {

    if (!el.btnSalvarProduto) return;

    el.btnSalvarProduto.addEventListener(

        "click",

        adicionarProduto

    );

    carregarProdutos();

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaOriginal = iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaOriginal();

    iniciarProdutos();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 3
    FECHAMENTO DO DIA
=====================================================*/

/*====================================================
    CARREGAR PRODUTOS NO FECHAMENTO
=====================================================*/

function carregarProdutosFechamento() {

    if (!el.produtosFechamento) return;

    el.produtosFechamento.innerHTML = "";

    if (banco.produtos.length === 0) {

        el.produtosFechamento.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;

    }

    banco.produtos.forEach(produto => {

        const tr = document.createElement("tr");

        tr.dataset.id = produto.id;

        tr.innerHTML = `

            <td>${produto.nome}</td>

            <td>
                <input
                    type="number"
                    class="qtdInicial"
                    min="0"
                    value="0">
            </td>

            <td>
                <input
                    type="number"
                    class="qtdFinal"
                    min="0"
                    value="0">
            </td>

            <td class="vendidos">0</td>

            <td class="receita">
                ${moeda(0)}
            </td>

            <td class="lucro">
                ${moeda(0)}
            </td>

        `;

        tr.querySelector(".qtdInicial")
            .addEventListener("input", atualizarLinha);

        tr.querySelector(".qtdFinal")
            .addEventListener("input", atualizarLinha);

        el.produtosFechamento.appendChild(tr);

    });

}

/*====================================================
    CALCULAR UMA LINHA
=====================================================*/

function atualizarLinha(evento) {

    const tr = evento.target.closest("tr");

    const id = Number(tr.dataset.id);

    const produto = banco.produtos.find(

        item => item.id === id

    );

    const inicial = Number(
        tr.querySelector(".qtdInicial").value
    );

    const final = Number(
        tr.querySelector(".qtdFinal").value
    );

    let vendidos = inicial - final;

    if (vendidos < 0)
        vendidos = 0;

    const receita =
        vendidos * produto.precoVenda;

    const lucro =
        vendidos *
        (produto.precoVenda - produto.precoCusto);

    tr.querySelector(".vendidos").textContent =
        vendidos;

    tr.querySelector(".receita").textContent =
        moeda(receita);

    tr.querySelector(".lucro").textContent =
        moeda(lucro);

    atualizarResumoFechamento();

}

/*====================================================
    RESUMO FINANCEIRO
=====================================================*/

function atualizarResumoFechamento() {

    let receita = 0;

    let custo = 0;

    let lucro = 0;

    document
        .querySelectorAll("#produtosFechamento tr")
        .forEach(tr => {

            const id = Number(tr.dataset.id);

            const produto = banco.produtos.find(

                p => p.id === id

            );

            if (!produto) return;

            const vendidos = Number(
                tr.querySelector(".vendidos")
                .textContent
            );

            receita +=
                vendidos * produto.precoVenda;

            custo +=
                vendidos * produto.precoCusto;

            lucro +=
                vendidos *
                (produto.precoVenda -
                 produto.precoCusto);

        });

    const despesas =
        Number(el.despesasExtras.value) || 0;

    const taxas =
        Number(el.taxas.value) || 0;

    const impostos =
        Number(el.impostos.value) || 0;

    const totalDespesas =
        despesas + taxas + impostos;

    const lucroLiquido =
        lucro - totalDespesas;

    el.receitaFechamento.textContent =
        moeda(receita);

    el.custoFechamento.textContent =
        moeda(custo);

    el.despesasTotal.textContent =
        moeda(totalDespesas);

    el.lucroFechamento.textContent =
        moeda(lucroLiquido);

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarFechamento() {

    carregarProdutosFechamento();

    [
        el.despesasExtras,
        el.taxas,
        el.impostos
    ].forEach(campo => {

        if (!campo) return;

        campo.addEventListener(
            "input",
            atualizarResumoFechamento
        );

    });

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaProdutos = iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaProdutos();

    iniciarFechamento();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 4
    SALVAR FECHAMENTO
=====================================================*/

/*====================================================
    SALVAR FECHAMENTO
=====================================================*/

function salvarFechamento() {

    if (!el.dataFechamento.value) {

        alert("Informe a data do fechamento.");
        return;

    }

    if (!el.local.value.trim()) {

        alert("Informe o local.");
        return;

    }

    let produtos = [];

    let receitaTotal = 0;
    let custoTotal = 0;
    let lucroBruto = 0;

    document
        .querySelectorAll("#produtosFechamento tr")
        .forEach(tr => {

            const id = Number(tr.dataset.id);

            const produto = banco.produtos.find(
                p => p.id === id
            );

            if (!produto) return;

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

            produtos.push({

                id: produto.id,

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
            lucroBruto += lucro;

        });

    const despesas =
        Number(el.despesasExtras.value) || 0;

    const taxas =
        Number(el.taxas.value) || 0;

    const impostos =
        Number(el.impostos.value) || 0;

    const lucroLiquido =
        lucroBruto -
        despesas -
        taxas -
        impostos;

    const fechamento = {

        id: gerarId(),

        data: el.dataFechamento.value,

        local: el.local.value.trim(),

        produtos,

        receitaTotal,

        custoTotal,

        lucroBruto,

        despesas,

        taxas,

        impostos,

        lucroLiquido,

        observacao:
            el.observacao.value.trim()

    };

    banco.fechamentos.push(fechamento);

    salvarBanco();

    atualizarDashboard();

    carregarHistorico();

    mostrarRelatorio(fechamento);

    limparFormularioFechamento();

    alert("Fechamento salvo com sucesso!");

}

/*====================================================
    LIMPAR FORMULÁRIO
=====================================================*/

function limparFormularioFechamento() {

    el.dataFechamento.value = "";

    el.local.value = "";

    el.despesasExtras.value = 0;

    el.taxas.value = 0;

    el.impostos.value = 0;

    el.observacao.value = "";

    carregarProdutosFechamento();

    atualizarResumoFechamento();

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarSalvarFechamento() {

    if (!el.btnSalvarFechamento) return;

    el.btnSalvarFechamento.addEventListener(

        "click",

        salvarFechamento

    );

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaFechamento = iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaFechamento();

    iniciarSalvarFechamento();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 5
    DASHBOARD
=====================================================*/

let graficoVendas = null;

/*====================================================
    ATUALIZAR DASHBOARD
=====================================================*/

function atualizarDashboard() {

    if (!el.vendaTotal) return;

    if (banco.fechamentos.length === 0) {

        el.vendaTotal.textContent = moeda(0);
        el.lucroTotal.textContent = moeda(0);
        el.produtosVendidos.textContent = "0";
        el.ultimoFechamento.textContent = "Nenhum";

        atualizarGrafico();
        atualizarAlertas();

        return;

    }

    const ultimo =
        banco.fechamentos[
            banco.fechamentos.length - 1
        ];

    el.vendaTotal.textContent =
        moeda(ultimo.receitaTotal);

    el.lucroTotal.textContent =
        moeda(ultimo.lucroLiquido);

    let vendidos = 0;

    ultimo.produtos.forEach(produto => {

        vendidos += produto.vendidos;

    });

    el.produtosVendidos.textContent =
        vendidos;

    el.ultimoFechamento.textContent =
        `${dataBR(ultimo.data)} • ${ultimo.local}`;

    atualizarGrafico();

    atualizarAlertas();

}

/*====================================================
    ALERTAS
=====================================================*/

function atualizarAlertas() {

    if (!el.alertasEstoque) return;

    el.alertasEstoque.innerHTML = "";

    if (banco.produtos.length === 0) {

        el.alertasEstoque.innerHTML = `
            <div class="alert-item">
                Nenhum produto cadastrado.
            </div>
        `;

        return;

    }

    const ultimo =
        banco.fechamentos[
            banco.fechamentos.length - 1
        ];

    if (!ultimo) {

        el.alertasEstoque.innerHTML = `
            <div class="alert-item">
                Nenhum fechamento realizado.
            </div>
        `;

        return;

    }

    let alerta = false;

    ultimo.produtos.forEach(item => {

        if (item.final <= 5) {

            alerta = true;

            const div =
                document.createElement("div");

            div.className = "alert-item";

            div.innerHTML = `
                ⚠ <strong>${item.nome}</strong>
                está com apenas
                ${item.final} unidade(s).
            `;

            el.alertasEstoque.appendChild(div);

        }

    });

    if (!alerta) {

        el.alertasEstoque.innerHTML = `
            <div class="alert-item">
                ✅ Estoque em ordem.
            </div>
        `;

    }

}

/*====================================================
    GRÁFICO
=====================================================*/

function atualizarGrafico() {

    const canvas =
        document.getElementById("graficoVendas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (graficoVendas) {

        graficoVendas.destroy();

    }

    const labels =
        banco.fechamentos.map(f => dataBR(f.data));

    const valores =
        banco.fechamentos.map(
            f => f.receitaTotal
        );

    graficoVendas = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "Receita",

                    data: valores,

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });

}

/*====================================================
    INICIAR DASHBOARD
=====================================================*/

function iniciarDashboard() {

    atualizarDashboard();

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaDashboard =
    iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaDashboard();

    iniciarDashboard();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 6
    HISTÓRICO
=====================================================*/

/*====================================================
    CARREGAR HISTÓRICO
=====================================================*/

function carregarHistorico() {

    if (!el.historicoTabela) return;

    el.historicoTabela.innerHTML = "";

    if (banco.fechamentos.length === 0) {

        el.historicoTabela.innerHTML = `
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

/*====================================================
    CRIAR LINHA
=====================================================*/

function criarLinhaHistorico(fechamento) {

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td>${dataBR(fechamento.data)}</td>

        <td>${fechamento.local}</td>

        <td>${moeda(fechamento.receitaTotal)}</td>

        <td>${moeda(fechamento.lucroLiquido)}</td>

        <td>

            <button class="btn btn-primary btnAbrir">
                Abrir
            </button>

            <button class="btn btn-warning btnEditar">
                Editar
            </button>

            <button class="btn btn-danger btnExcluir">
                Excluir
            </button>

        </td>

    `;

    tr.querySelector(".btnAbrir")
        .addEventListener("click", () => {

            abrirRelatorio(fechamento.id);

        });

    tr.querySelector(".btnEditar")
        .addEventListener("click", () => {

            editarFechamento(fechamento.id);

        });

    tr.querySelector(".btnExcluir")
        .addEventListener("click", () => {

            excluirFechamento(fechamento.id);

        });

    el.historicoTabela.appendChild(tr);

}

/*====================================================
    PESQUISA
=====================================================*/

function pesquisarHistorico() {

    const texto =
        el.pesquisaHistorico.value
        .toLowerCase()
        .trim();

    const data =
        el.filtroData.value;

    el.historicoTabela.innerHTML = "";

    banco.fechamentos

        .filter(item => {

            const pesquisa =

                item.local
                    .toLowerCase()
                    .includes(texto)

                ||

                item.data
                    .includes(texto);

            const filtroData =

                data === ""

                ||

                item.data === data;

            return pesquisa && filtroData;

        })

        .reverse()

        .forEach(item => {

            criarLinhaHistorico(item);

        });

}

/*====================================================
    EXCLUIR
=====================================================*/

function excluirFechamento(id) {

    if (!confirm(
        "Excluir este fechamento?"
    )) return;

    banco.fechamentos =
        banco.fechamentos.filter(

            item => item.id !== id

        );

    salvarBanco();

    atualizarDashboard();

    carregarHistorico();

}

/*====================================================
    EDITAR
=====================================================*/

function editarFechamento(id) {

    const fechamento =
        banco.fechamentos.find(

            item => item.id === id

        );

    if (!fechamento) return;

    const novoLocal = prompt(
        "Local:",
        fechamento.local
    );

    if (novoLocal === null) return;

    fechamento.local =
        novoLocal.trim();

    salvarBanco();

    carregarHistorico();

    atualizarDashboard();

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarHistorico() {

    carregarHistorico();

    if (el.pesquisaHistorico) {

        el.pesquisaHistorico
            .addEventListener(
                "input",
                pesquisarHistorico
            );

    }

    if (el.filtroData) {

        el.filtroData
            .addEventListener(
                "change",
                pesquisarHistorico
            );

    }

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaHistorico =
    iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaHistorico();

    iniciarHistorico();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 7
    RELATÓRIOS
=====================================================*/

/*====================================================
    ABRIR RELATÓRIO
=====================================================*/

function abrirRelatorio(id) {

    const fechamento =
        banco.fechamentos.find(

            item => item.id === id

        );

    if (!fechamento) return;

    mostrarRelatorio(fechamento);

    abrirPagina("relatorio");

}

/*====================================================
    MOSTRAR RELATÓRIO
=====================================================*/

function mostrarRelatorio(fechamento) {

    if (!el.areaRelatorio) return;

    let linhas = "";

    fechamento.produtos.forEach(produto => {

        linhas += `

            <tr>

                <td>${produto.nome}</td>

                <td>${produto.inicial}</td>

                <td>${produto.final}</td>

                <td>${produto.vendidos}</td>

                <td>${moeda(produto.receita)}</td>

                <td>${moeda(produto.lucro)}</td>

            </tr>

        `;

    });

    el.areaRelatorio.innerHTML = `

        <h2>
            🌽 Delícias do Milho
        </h2>

        <hr>

        <p>
            <strong>Data:</strong>
            ${dataBR(fechamento.data)}
        </p>

        <p>
            <strong>Local:</strong>
            ${fechamento.local}
        </p>

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

        <h3>
            Resumo Financeiro
        </h3>

        <p>
            <strong>Receita:</strong>
            ${moeda(fechamento.receitaTotal)}
        </p>

        <p>
            <strong>Custo:</strong>
            ${moeda(fechamento.custoTotal)}
        </p>

        <p>
            <strong>Lucro Bruto:</strong>
            ${moeda(fechamento.lucroBruto)}
        </p>

        <p>
            <strong>Despesas:</strong>
            ${moeda(fechamento.despesas)}
        </p>

        <p>
            <strong>Taxas:</strong>
            ${moeda(fechamento.taxas)}
        </p>

        <p>
            <strong>Impostos:</strong>
            ${moeda(fechamento.impostos)}
        </p>

        <hr>

        <h2>
            Lucro Líquido:
            ${moeda(fechamento.lucroLiquido)}
        </h2>

        <br>

        <p>
            <strong>Observações:</strong>
        </p>

        <p>
            ${fechamento.observacao ||
              "Nenhuma observação."}
        </p>

    `;

}

/*====================================================
    IMPRIMIR
=====================================================*/

function imprimirRelatorio() {

    if (!el.areaRelatorio) {

        alert(
            "Nenhum relatório disponível."
        );

        return;

    }

    window.print();

}

/*====================================================
    EXPORTAR PDF
=====================================================*/

function exportarPDF() {

    if (!el.areaRelatorio) {

        alert(
            "Nenhum relatório disponível."
        );

        return;

    }

    const janela = window.open(
        "",
        "_blank"
    );

    janela.document.write(`

        <html>

            <head>

                <title>
                    Relatório
                </title>

                <style>

                    body{
                        font-family:Arial,sans-serif;
                        padding:20px;
                    }

                    table{
                        width:100%;
                        border-collapse:collapse;
                    }

                    th,td{
                        border:1px solid #ccc;
                        padding:8px;
                        text-align:center;
                    }

                    h2,h3{
                        text-align:center;
                    }

                </style>

            </head>

            <body>

                ${el.areaRelatorio.innerHTML}

            </body>

        </html>

    `);

    janela.document.close();

    janela.focus();

    janela.print();

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarRelatorios() {

    if (el.btnImprimir) {

        el.btnImprimir
            .addEventListener(
                "click",
                imprimirRelatorio
            );

    }

    if (el.btnExportarPDF) {

        el.btnExportarPDF
            .addEventListener(
                "click",
                exportarPDF
            );

    }

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaRelatorio =
    iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaRelatorio();

    iniciarRelatorios();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 8
    BACKUP E RESTAURAÇÃO
=====================================================*/

/*====================================================
    EXPORTAR BACKUP
=====================================================*/

function exportarBackup() {

    const dados = JSON.stringify(
        banco,
        null,
        2
    );

    const blob = new Blob(
        [dados],
        {
            type: "application/json"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    const hoje =
        new Date()
        .toISOString()
        .slice(0,10);

    link.href = url;

    link.download =
        `backup-delicias-do-milho-${hoje}.json`;

    link.click();

    URL.revokeObjectURL(url);

}

/*====================================================
    RESTAURAR BACKUP
=====================================================*/

function restaurarBackup() {

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.addEventListener(

        "change",

        evento => {

            const arquivo =
                evento.target.files[0];

            if (!arquivo) return;

            const leitor =
                new FileReader();

            leitor.onload = () => {

                try {

                    const dados =
                        JSON.parse(
                            leitor.result
                        );

                    if (
                        !dados.produtos ||
                        !dados.fechamentos
                    ) {

                        throw "inválido";

                    }

                    banco = dados;

                    salvarBanco();

                    carregarProdutos();

                    carregarProdutosFechamento();

                    carregarHistorico();

                    atualizarDashboard();

                    aplicarTema();

                    alert(
                        "Backup restaurado com sucesso!"
                    );

                }

                catch {

                    alert(
                        "Arquivo inválido."
                    );

                }

            };

            leitor.readAsText(arquivo);

        }

    );

    input.click();

}

/*====================================================
    LIMPAR TODOS OS DADOS
=====================================================*/

function limparDados() {

    const confirmar = confirm(

        "Tem certeza que deseja apagar TODOS os dados?"

    );

    if (!confirmar) return;

    localStorage.removeItem(
        APP.storage
    );

    banco = {

        produtos: [],

        fechamentos: [],

        configuracoes: {

            tema: "claro"

        }

    };

    salvarBanco();

    carregarProdutos();

    carregarProdutosFechamento();

    carregarHistorico();

    atualizarDashboard();

    if (el.areaRelatorio) {

        el.areaRelatorio.innerHTML =
            "Nenhum relatório disponível.";

    }

    alert(
        "Todos os dados foram apagados."
    );

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarBackup() {

    if (el.btnExportarBackup) {

        el.btnExportarBackup
            .addEventListener(
                "click",
                exportarBackup
            );

    }

    if (el.btnRestaurarBackup) {

        el.btnRestaurarBackup
            .addEventListener(
                "click",
                restaurarBackup
            );

    }

    if (el.btnLimparDados) {

        el.btnLimparDados
            .addEventListener(
                "click",
                limparDados
            );

    }

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaBackup =
    iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaBackup();

    iniciarBackup();

};
/*====================================================
    DELÍCIAS DO MILHO 3.0
    PARTE 9
    CONFIGURAÇÕES E UTILIDADES
=====================================================*/

/*====================================================
    MENU MOBILE
=====================================================*/

function alternarMenuMobile() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("open");

}

/*====================================================
    FECHAR MENU AO CLICAR
=====================================================*/

function fecharMenuMobile() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    if (window.innerWidth <= 768) {

        sidebar.classList.remove("open");

    }

}

/*====================================================
    MELHORAR ABRIR PÁGINA
=====================================================*/

const abrirPaginaOriginal = abrirPagina;

abrirPagina = function (pagina) {

    abrirPaginaOriginal(pagina);

    switch (pagina) {

        case "dashboard":
            atualizarDashboard();
            break;

        case "produtos":
            carregarProdutos();
            break;

        case "fechamento":
            carregarProdutosFechamento();
            atualizarResumoFechamento();
            break;

        case "historico":
            carregarHistorico();
            break;

        case "relatorio":

            if (
                banco.fechamentos.length > 0
            ) {

                mostrarRelatorio(

                    banco.fechamentos[
                        banco.fechamentos.length - 1
                    ]

                );

            }

            break;

    }

    fecharMenuMobile();

};

/*====================================================
    DATA PADRÃO
=====================================================*/

function definirDataHoje() {

    if (!el.dataFechamento) return;

    const hoje =
        new Date()
        .toISOString()
        .split("T")[0];

    el.dataFechamento.value = hoje;

}

/*====================================================
    ATALHOS
=====================================================*/

function iniciarAtalhos() {

    document.addEventListener(

        "keydown",

        evento => {

            if (
                evento.ctrlKey &&
                evento.key === "s"
            ) {

                evento.preventDefault();

                if (

                    document
                        .getElementById("fechamento")
                        .classList.contains("active-page")

                ) {

                    salvarFechamento();

                }

            }

        }

    );

}

/*====================================================
    RESPONSIVIDADE
=====================================================*/

function iniciarResponsividade() {

    window.addEventListener(

        "resize",

        fecharMenuMobile

    );

}

/*====================================================
    EVENTOS
=====================================================*/

function iniciarConfiguracoes() {

    definirDataHoje();

    iniciarAtalhos();

    iniciarResponsividade();

    if (el.btnMenuMobile) {

        el.btnMenuMobile.addEventListener(

            "click",

            alternarMenuMobile

        );

    }

}

/*====================================================
    INTEGRAÇÃO
=====================================================*/

const iniciarSistemaConfig =
    iniciarSistema;

iniciarSistema = function () {

    iniciarSistemaConfig();

    iniciarConfiguracoes();

};
