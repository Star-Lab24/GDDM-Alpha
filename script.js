// ==============================
// DELÍCIAS DO MILHO
// SISTEMA DE GERENCIAMENTO
// ==============================


// ==============================
// ELEMENTOS
// ==============================

const app = document.getElementById("app");

const pageTitle = document.getElementById("page-title");

const pageDescription = document.getElementById("page-description");

const dataAtual = document.getElementById("dataAtual");

const menuItems = document.querySelectorAll(".menu-item");


// ==============================
// BANCO LOCAL
// ==============================


function bancoInicial(){

    if(!localStorage.getItem("produtos")){
        localStorage.setItem("produtos", JSON.stringify([]));
    }


    if(!localStorage.getItem("vendas")){
        localStorage.setItem("vendas", JSON.stringify([]));
    }


    if(!localStorage.getItem("relatorios")){
        localStorage.setItem("relatorios", JSON.stringify([]));
    }


    if(!localStorage.getItem("config")){
        localStorage.setItem("config", JSON.stringify({

            empresa:"Delícias do Milho",

            taxa:0,

            imposto:0

        }));
    }

}


bancoInicial();



// ==============================
// FUNÇÕES DO BANCO
// ==============================


function pegarDados(nome){

    return JSON.parse(
        localStorage.getItem(nome)
    ) || [];

}



function salvarDados(nome,dados){

    localStorage.setItem(

        nome,

        JSON.stringify(dados)

    );

}



// ==============================
// DATA ATUAL
// ==============================


const hoje = new Date();


if(dataAtual){

    dataAtual.innerHTML = hoje.toLocaleDateString(
        "pt-BR",
        {
            weekday:"long",
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    );

}



// ==============================
// MENU
// ==============================


menuItems.forEach(botao=>{


    botao.addEventListener(
        "click",
        ()=>{


            menuItems.forEach(item=>{

                item.classList.remove("active");

            });


            botao.classList.add("active");


            abrirPagina(
                botao.dataset.page
            );


        }
    );


});



// ==============================
// NAVEGAÇÃO
// ==============================


function abrirPagina(pagina){


    switch(pagina){


        case "dashboard":

            dashboard();

        break;



        case "produtos":

            produtos();

        break;



        case "vendas":

            vendas();

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


    pageDescription.innerHTML=
    "Resumo das operações do dia.";



    const produtos = pegarDados("produtos");


    const vendas = pegarDados("vendas");



    let totalVenda = 0;


    let totalProdutos = 0;



    vendas.forEach(v=>{


        totalVenda += v.valor;


        totalProdutos += v.quantidade;


    });



    let custo = 0;



    vendas.forEach(v=>{


        const produto = produtos.find(

            p=>p.id == v.produtoId

        );


        if(produto){

            custo += produto.custo * v.quantidade;

        }


    });



    const lucro = totalVenda - custo;



    app.innerHTML = `


    <div class="cards">


        <div class="card">

            <h3>Venda do Dia</h3>

            <h2>
            R$ ${totalVenda.toFixed(2)}
            </h2>

        </div>



        <div class="card">

            <h3>Lucro</h3>

            <h2>
            R$ ${lucro.toFixed(2)}
            </h2>

        </div>



        <div class="card">

            <h3>Produtos Vendidos</h3>

            <h2>
            ${totalProdutos}
            </h2>

        </div>



        <div class="card">

            <h3>Produtos Cadastrados</h3>

            <h2>
            ${produtos.length}
            </h2>

        </div>


    </div>


    `;


}



// ==============================
// INICIAR
// ==============================


dashboard();

// ==============================
// PRODUTOS
// ==============================


function produtos(){


    pageTitle.innerHTML="Produtos";

    pageDescription.innerHTML=
    "Cadastro e controle de estoque.";



    app.innerHTML = `


    <div class="pagina">


        <div class="form-card">


            <h2>Novo Produto</h2>


            <div class="form-grid">


                <input 
                id="nomeProduto"
                placeholder="Nome do produto">


                <input 
                id="valorVenda"
                type="number"
                placeholder="Valor de venda">


                <input 
                id="valorCusto"
                type="number"
                placeholder="Valor de custo">


                <input 
                id="estoqueProduto"
                type="number"
                placeholder="Quantidade estoque">


                <textarea
                id="descricaoProduto"
                placeholder="Descrição">
                </textarea>


            </div>



            <button 
            class="btn"
            onclick="salvarProduto()">

            Salvar Produto

            </button>



        </div>



        <div id="listaProdutos"></div>


    </div>


    `;



    carregarProdutos();


}




// ==============================
// SALVAR PRODUTO
// ==============================


function salvarProduto(){


    const nome =
    document.getElementById("nomeProduto").value;


    const venda =
    Number(document.getElementById("valorVenda").value);


    const custo =
    Number(document.getElementById("valorCusto").value);



    const estoque =
    Number(document.getElementById("estoqueProduto").value);



    const descricao =
    document.getElementById("descricaoProduto").value;



    if(!nome){

        alert("Digite o nome do produto.");

        return;

    }



    const produtos = pegarDados("produtos");



    produtos.push({


        id:Date.now(),

        nome,

        venda,

        custo,

        estoque,

        descricao


    });



    salvarDados(
        "produtos",
        produtos
    );



    carregarProdutos();



    limparProduto();


}





// ==============================
// LISTAR PRODUTOS
// ==============================


function carregarProdutos(){


    const lista =
    document.getElementById("listaProdutos");


    if(!lista)
    return;



    const produtos =
    pegarDados("produtos");



    if(produtos.length===0){


        lista.innerHTML=`

        <div class="card">

        Nenhum produto cadastrado.

        </div>

        `;


        return;

    }




    lista.innerHTML="";



    produtos.forEach(produto=>{


        lista.innerHTML += `


        <div class="card produto-card">


            <h3>
            ${produto.nome}
            </h3>



            <p>
            ${produto.descricao}
            </p>



            <p>
            Venda:
            R$ ${produto.venda.toFixed(2)}
            </p>



            <p>
            Custo:
            R$ ${produto.custo.toFixed(2)}
            </p>



            <p>
            Estoque:
            ${produto.estoque}
            unidades
            </p>



            <button
            class="btn excluir"
            onclick="
            excluirProduto(${produto.id})
            ">

            Excluir

            </button>


        </div>


        `;


    });


}





// ==============================
// EXCLUIR PRODUTO
// ==============================


function excluirProduto(id){


    let produtos =
    pegarDados("produtos");



    produtos =
    produtos.filter(
        produto=>produto.id !== id
    );



    salvarDados(
        "produtos",
        produtos
    );



    carregarProdutos();


}





// ==============================
// LIMPAR FORMULÁRIO
// ==============================


function limparProduto(){


    document.getElementById("nomeProduto").value="";


    document.getElementById("valorVenda").value="";


    document.getElementById("valorCusto").value="";


    document.getElementById("estoqueProduto").value="";


    document.getElementById("descricaoProduto").value="";


}




// ==============================
// VENDAS
// ==============================


function vendas(){


    pageTitle.innerHTML="Vendas";


    pageDescription.innerHTML=
    "Registro das vendas realizadas.";



    const produtos =
    pegarDados("produtos");



    app.innerHTML=`


    <div class="form-card">


        <h2>Registrar Venda</h2>



        <select id="produtoVenda">


        ${
            produtos.map(p=>`

            <option value="${p.id}">

            ${p.nome}
            -
            R$ ${p.venda.toFixed(2)}

            </option>

            `).join("")
        }


        </select>




        <input 
        id="quantidadeVenda"
        type="number"
        placeholder="Quantidade">





        <button
        class="btn"
        onclick="registrarVenda()">


        Registrar


        </button>



    </div>



    <div id="listaVendas"></div>


    `;



    carregarVendas();


}





// ==============================
// REGISTRAR VENDA
// ==============================


function registrarVenda(){


    const produtoId =
    Number(
    document.getElementById("produtoVenda").value
    );


    const quantidade =
    Number(
    document.getElementById("quantidadeVenda").value
    );



    const produtos =
    pegarDados("produtos");



    const produto =
    produtos.find(
        p=>p.id===produtoId
    );



    if(!produto)
    return;



    if(produto.estoque < quantidade){

        alert(
        "Estoque insuficiente."
        );

        return;

    }




    produto.estoque -= quantidade;



    salvarDados(
        "produtos",
        produtos
    );



    const vendas =
    pegarDados("vendas");



    vendas.push({


        id:Date.now(),

        produtoId,

        produto:produto.nome,

        quantidade,

        valor:
        produto.venda * quantidade,


        data:
        new Date().toLocaleDateString(
        "pt-BR"
        )


    });



    salvarDados(
        "vendas",
        vendas
    );



    carregarVendas();


}





// ==============================
// LISTAR VENDAS
// ==============================


function carregarVendas(){


    const lista =
    document.getElementById("listaVendas");



    if(!lista)
    return;



    const vendas =
    pegarDados("vendas");



    lista.innerHTML="";



    vendas.forEach(v=>{


        lista.innerHTML += `


        <div class="card">


        <h3>
        ${v.produto}
        </h3>


        <p>
        Quantidade:
        ${v.quantidade}
        </p>


        <p>
        Total:
        R$ ${v.valor.toFixed(2)}
        </p>


        <small>
        ${v.data}
        </small>


        </div>


        `;


    });


}

// ==============================
// FECHAMENTO DO DIA
// ==============================


function fechamento(){


    pageTitle.innerHTML="Fechamento";

    pageDescription.innerHTML=
    "Finalize o movimento do dia.";



    const vendas =
    pegarDados("vendas");


    const produtos =
    pegarDados("produtos");


    const config =
    JSON.parse(
        localStorage.getItem("config")
    );



    let vendaTotal = 0;

    let custoTotal = 0;



    vendas.forEach(v=>{


        vendaTotal += v.valor;



        const produto =
        produtos.find(
            p=>p.id === v.produtoId
        );



        if(produto){

            custoTotal +=
            produto.custo * v.quantidade;

        }


    });



    const taxa =
    vendaTotal * (config.taxa / 100);



    const imposto =
    vendaTotal * (config.imposto / 100);



    const lucro =
    vendaTotal -
    custoTotal -
    taxa -
    imposto;



    app.innerHTML = `


    <div class="cards">


        <div class="card">

            <h3>Total Vendido</h3>

            <h2>
            R$ ${vendaTotal.toFixed(2)}
            </h2>

        </div>



        <div class="card">

            <h3>Custo dos Produtos</h3>

            <h2>
            R$ ${custoTotal.toFixed(2)}
            </h2>

        </div>



        <div class="card">

            <h3>Taxas</h3>

            <h2>
            R$ ${taxa.toFixed(2)}
            </h2>

        </div>



        <div class="card">

            <h3>Lucro Final</h3>

            <h2>
            R$ ${lucro.toFixed(2)}
            </h2>

        </div>


    </div>



    <button 
    class="btn"
    onclick="salvarFechamento()">

    Finalizar Dia

    </button>


    `;


}




// ==============================
// SALVAR FECHAMENTO
// ==============================


function salvarFechamento(){


    const vendas =
    pegarDados("vendas");


    const produtos =
    pegarDados("produtos");



    const config =
    JSON.parse(
        localStorage.getItem("config")
    );



    let total = 0;

    let custo = 0;



    vendas.forEach(v=>{


        total += v.valor;



        const produto =
        produtos.find(
            p=>p.id === v.produtoId
        );


        if(produto){

            custo +=
            produto.custo * v.quantidade;

        }


    });



    const relatorios =
    pegarDados("relatorios");



    relatorios.push({


        id:Date.now(),


        data:
        new Date().toLocaleDateString(
            "pt-BR"
        ),


        vendas:total,


        custo,


        lucro:
        total -
        custo,


        produtosVendidos:
        vendas.length


    });



    salvarDados(
        "relatorios",
        relatorios
    );



    // limpa vendas do dia

    salvarDados(
        "vendas",
        []
    );



    alert(
    "Fechamento realizado com sucesso!"
    );


    dashboard();


}




// ==============================
// HISTÓRICO
// ==============================


function historico(){


    pageTitle.innerHTML="Histórico";


    pageDescription.innerHTML=
    "Relatórios anteriores.";



    const relatorios =
    pegarDados("relatorios");



    app.innerHTML="";



    if(relatorios.length===0){


        app.innerHTML=`

        <div class="card">

        Nenhum fechamento realizado.

        </div>

        `;


        return;

    }




    relatorios.forEach(r=>{


        app.innerHTML += `


        <div class="card">


            <h3>
            ${r.data}
            </h3>


            <p>
            Venda:
            R$ ${r.vendas.toFixed(2)}
            </p>


            <p>
            Custo:
            R$ ${r.custo.toFixed(2)}
            </p>


            <p>
            Lucro:
            R$ ${r.lucro.toFixed(2)}
            </p>


            <p>
            Produtos vendidos:
            ${r.produtosVendidos}
            </p>


        </div>


        `;


    });


}





// ==============================
// CONFIGURAÇÕES
// ==============================


function configuracoes(){


    pageTitle.innerHTML="Configurações";


    pageDescription.innerHTML=
    "Dados do estabelecimento.";



    const config =
    JSON.parse(
        localStorage.getItem("config")
    );



    app.innerHTML=`


    <div class="form-card">


        <h2>
        Configurações
        </h2>



        <input
        id="empresa"
        value="${config.empresa}"
        placeholder="Nome da empresa">



        <input
        id="taxa"
        type="number"
        value="${config.taxa}"
        placeholder="Taxa %">



        <input
        id="imposto"
        type="number"
        value="${config.imposto}"
        placeholder="Imposto %">




        <button
        class="btn"
        onclick="salvarConfiguracoes()">


        Salvar


        </button>



    </div>


    `;



}




// ==============================
// SALVAR CONFIGURAÇÕES
// ==============================


function salvarConfiguracoes(){


    const config = {


        empresa:
        document.getElementById("empresa").value,


        taxa:
        Number(
        document.getElementById("taxa").value
        ),


        imposto:
        Number(
        document.getElementById("imposto").value
        )


    };



    localStorage.setItem(

        "config",

        JSON.stringify(config)

    );



    alert(
    "Configurações salvas!"
    );


}
