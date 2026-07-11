/* =====================================================
   DELÍCIAS DO MILHO
   SCRIPT PRINCIPAL - PARTE 1

   Módulos:
   - Banco de dados local
   - Navegação
   - Tema escuro
   - Produtos
===================================================== */



// =====================================================
// BANCO DE DADOS (LOCAL STORAGE)
// =====================================================


let produtos = JSON.parse(
    localStorage.getItem("produtos")
) || [];


let fechamentos = JSON.parse(
    localStorage.getItem("fechamentos")
) || [];



let configuracoes = JSON.parse(
    localStorage.getItem("configuracoes")
) || {

    tema: "claro"

};





// =====================================================
// NAVEGAÇÃO DO SISTEMA
// =====================================================


function mostrarPagina(pagina) {


    const paginas =
    document.querySelectorAll(".pagina");


    paginas.forEach(secao => {

        secao.classList.remove("ativa");

    });



    const selecionada =
    document.getElementById(pagina);



    if(selecionada){

        selecionada.classList.add("ativa");

    }


}





// =====================================================
// DATA AUTOMÁTICA
// =====================================================


function atualizarData(){


    const elemento =
    document.getElementById("dataAtual");


    if(elemento){


        const hoje =
        new Date();


        elemento.innerHTML =
        "📅 " +
        hoje.toLocaleDateString("pt-BR");


    }


}





// =====================================================
// SISTEMA DE TEMA
// =====================================================


function alternarTema(){


    document.body.classList.toggle("dark");



    if(
        document.body.classList.contains("dark")
    ){

        configuracoes.tema = "escuro";

    }

    else{

        configuracoes.tema = "claro";

    }



    salvarConfiguracoes();


}




function carregarTema(){


    if(
        configuracoes.tema === "escuro"
    ){

        document.body.classList.add("dark");

    }


}





function salvarConfiguracoes(){


    localStorage.setItem(

        "configuracoes",

        JSON.stringify(configuracoes)

    );


}






// =====================================================
// PRODUTOS
// =====================================================



function adicionarProduto(){


    const nome =
    document.getElementById("nomeProduto").value.trim();



    const venda =
    Number(
        document.getElementById("precoVenda").value
    );



    const custo =
    Number(
        document.getElementById("precoCusto").value
    );



    const estoque =
    Number(
        document.getElementById("estoque").value
    );





    if(
        nome === "" ||
        venda <= 0 ||
        custo <= 0
    ){


        alert(
            "Preencha todos os dados do produto."
        );


        return;


    }






    const produto = {


        id: Date.now(),


        nome:nome,


        precoVenda:venda,


        precoCusto:custo,


        estoqueInicial:estoque,


        estoqueAtual:estoque


    };





    produtos.push(produto);



    salvarProdutos();



    carregarProdutos();



    limparProduto();



    alert(
        "Produto cadastrado com sucesso!"
    );


}








function salvarProdutos(){


    localStorage.setItem(

        "produtos",

        JSON.stringify(produtos)

    );


}








function carregarProdutos(){


    const tabela =
    document.getElementById("listaProdutos");



    if(!tabela){

        return;

    }



    tabela.innerHTML = "";





    produtos.forEach(produto => {



        tabela.innerHTML += `


        <tr>


            <td>
            ${produto.nome}
            </td>



            <td>
            R$ ${produto.precoVenda.toFixed(2)}
            </td>



            <td>
            R$ ${produto.precoCusto.toFixed(2)}
            </td>



            <td>
            ${produto.estoqueAtual}
            </td>



            <td>


            <button onclick="
            editarProduto(${produto.id})
            ">
            ✏️
            </button>



            <button onclick="
            excluirProduto(${produto.id})
            ">
            🗑️
            </button>



            </td>



        </tr>


        `;


    });



}








function editarProduto(id){


    const produto =
    produtos.find(
        p => p.id === id
    );



    if(!produto){

        return;

    }





    const novoNome =
    prompt(
        "Nome do produto:",
        produto.nome
    );



    const novoEstoque =
    prompt(
        "Quantidade em estoque:",
        produto.estoqueAtual
    );



    if(novoNome){


        produto.nome =
        novoNome;


    }



    if(novoEstoque){


        produto.estoqueAtual =
        Number(novoEstoque);


    }




    salvarProdutos();


    carregarProdutos();



}








function excluirProduto(id){



    const confirmar =
    confirm(
        "Deseja remover este produto?"
    );



    if(!confirmar){

        return;

    }



    produtos =
    produtos.filter(

        produto =>
        produto.id !== id

    );



    salvarProdutos();



    carregarProdutos();



}







function limparProduto(){



    document.getElementById(
        "nomeProduto"
    ).value = "";



    document.getElementById(
        "precoVenda"
    ).value = "";



    document.getElementById(
        "precoCusto"
    ).value = "";



    document.getElementById(
        "estoque"
    ).value = "";


}





// =====================================================
// INICIALIZAÇÃO
// =====================================================



document.addEventListener(
"DOMContentLoaded",

()=>{


    atualizarData();


    carregarTema();


    carregarProdutos();


}

);

/* =====================================================
   DELÍCIAS DO MILHO
   SCRIPT PRINCIPAL - PARTE 2

   Módulos:
   - Fechamento do dia
   - Controle de estoque
   - Cálculo financeiro
   - Relatório
===================================================== */



// =====================================================
// CARREGAR PRODUTOS NO FECHAMENTO
// =====================================================


function carregarProdutosFechamento(){


    const area =
    document.getElementById("produtosFechamento");



    if(!area){

        return;

    }



    area.innerHTML = "";




    produtos.forEach(produto => {



        area.innerHTML += `

        <div class="produto-fechamento">


            <h3>
            ${produto.nome}
            </h3>


            <p>
            Estoque inicial:
            <strong>
            ${produto.estoqueAtual}
            </strong>
            </p>



            <label>
            Estoque final:
            </label>



            <input 
            type="number"
            min="0"
            value="${produto.estoqueAtual}"
            id="final-${produto.id}"
            >



        </div>

        `;


    });


}






// =====================================================
// GERAR RELATÓRIO DO DIA
// =====================================================



function gerarRelatorio(){



    const data =
    document.getElementById(
        "dataFechamento"
    ).value;



    const local =
    document.getElementById(
        "local"
    ).value;



    const despesasExtras =
    Number(
        document.getElementById(
            "despesasExtras"
        ).value
    ) || 0;



    const taxas =
    Number(
        document.getElementById(
            "taxas"
        ).value
    ) || 0;



    const impostos =
    Number(
        document.getElementById(
            "impostos"
        ).value
    ) || 0;



    const observacao =
    document.getElementById(
        "observacao"
    ).value;





    let produtosVendidos = [];

    let custoProdutos = 0;

    let receitaTotal = 0;






    produtos.forEach(produto => {



        const estoqueFinal = Number(

            document.getElementById(
                `final-${produto.id}`
            ).value

        );




        const estoqueInicial =
        produto.estoqueAtual;




        const quantidadeVendida =

        estoqueInicial - estoqueFinal;






        const custoTotal =

        quantidadeVendida *
        produto.precoCusto;






        const vendaTotal =

        quantidadeVendida *
        produto.precoVenda;







        if(quantidadeVendida > 0){



            produtosVendidos.push({


                nome:
                produto.nome,


                inicial:
                estoqueInicial,


                vendido:
                quantidadeVendida,


                final:
                estoqueFinal,


                custo:
                custoTotal,


                venda:
                vendaTotal


            });



        }







        custoProdutos += custoTotal;


        receitaTotal += vendaTotal;






        // Atualiza estoque

        produto.estoqueAtual =
        estoqueFinal;



    });







    const lucroBruto =

    receitaTotal - custoProdutos;






    const lucroLiquido =

    lucroBruto -
    despesasExtras -
    taxas -
    impostos;






    let margem = 0;



    if(receitaTotal > 0){


        margem =

        (
            lucroLiquido /
            receitaTotal
        ) * 100;


    }







    const fechamento = {



        id:
        Date.now(),



        data,



        local,



        produtos:
        produtosVendidos,



        receitaTotal,



        custoProdutos,



        despesasExtras,



        taxas,



        impostos,



        lucroBruto,



        lucroLiquido,



        margem,



        observacao


    };








    fechamentos.push(
        fechamento
    );





    salvarFechamentos();



    salvarProdutos();




    mostrarRelatorio(
        fechamento
    );




    atualizarDashboard();





    alert(
        "Fechamento realizado com sucesso!"
    );



}








// =====================================================
// SALVAR FECHAMENTOS
// =====================================================


function salvarFechamentos(){


    localStorage.setItem(

        "fechamentos",

        JSON.stringify(fechamentos)

    );


}








// =====================================================
// MOSTRAR RELATÓRIO
// =====================================================


function mostrarRelatorio(relatorio){



    const area =
    document.getElementById(
        "areaRelatorio"
    );



    if(!area){

        return;

    }





    let produtosHTML = "";





    relatorio.produtos.forEach(produto => {



        produtosHTML += `


        <tr>


        <td>
        ${produto.nome}
        </td>


        <td>
        ${produto.inicial}
        </td>


        <td>
        ${produto.vendido}
        </td>


        <td>
        ${produto.final}
        </td>


        <td>
        R$ ${produto.custo.toFixed(2)}
        </td>


        </tr>


        `;



    });








    area.innerHTML = `



    <h2>
    🌽 DELÍCIAS DO MILHO
    </h2>


    <hr>



    <p>
    Data:
    ${relatorio.data}
    </p>



    <p>
    Local:
    ${relatorio.local}
    </p>



    <br>



    <h3>
    Produtos vendidos
    </h3>



    <table>


    <tr>

    <th>
    Produto
    </th>

    <th>
    Inicial
    </th>


    <th>
    Vendido
    </th>


    <th>
    Final
    </th>


    <th>
    Custo
    </th>


    </tr>


    ${produtosHTML}


    </table>



    <br>


    <h3>
    Resumo financeiro
    </h3>



    <p>
    Receita:
    R$ ${relatorio.receitaTotal.toFixed(2)}
    </p>



    <p>
    Custos dos produtos:
    R$ ${relatorio.custoProdutos.toFixed(2)}
    </p>



    <p>
    Despesas extras:
    R$ ${relatorio.despesasExtras.toFixed(2)}
    </p>



    <p>
    Taxas:
    R$ ${relatorio.taxas.toFixed(2)}
    </p>



    <p>
    Impostos:
    R$ ${relatorio.impostos.toFixed(2)}
    </p>



    <hr>



    <h3>
    Lucro Bruto:
    R$ ${relatorio.lucroBruto.toFixed(2)}
    </h3>



    <h3>
    Lucro Líquido:
    R$ ${relatorio.lucroLiquido.toFixed(2)}
    </h3>



    <h3>
    Margem:
    ${relatorio.margem.toFixed(2)}%
    </h3>



    <br>



    <p>
    Observações:
    ${relatorio.observacao}
    </p>


    `;



}







// Atualiza produtos no fechamento quando abrir a página

document.addEventListener(
"DOMContentLoaded",

()=>{


    carregarProdutosFechamento();


});

/* =====================================================
   DELÍCIAS DO MILHO
   SCRIPT PRINCIPAL - PARTE 3

   Módulos:
   - Dashboard automático
   - Histórico
   - Pesquisa
   - Backup
   - Restauração
   - Impressão
===================================================== */





// =====================================================
// ATUALIZAR DASHBOARD
// =====================================================


function atualizarDashboard(){



    const vendaElemento =
    document.getElementById(
        "vendaTotal"
    );



    const lucroElemento =
    document.getElementById(
        "lucroTotal"
    );



    const produtosElemento =
    document.getElementById(
        "produtosVendidos"
    );



    const ultimoElemento =
    document.getElementById(
        "ultimoFechamento"
    );





    if(!vendaElemento){

        return;

    }





    let vendaTotal = 0;

    let lucroTotal = 0;

    let quantidadeProdutos = 0;






    fechamentos.forEach(fechamento => {



        vendaTotal +=
        fechamento.receitaTotal;



        lucroTotal +=
        fechamento.lucroLiquido;



        fechamento.produtos.forEach(produto=>{


            quantidadeProdutos +=
            produto.vendido;


        });



    });







    vendaElemento.innerHTML =

    "R$ " +
    vendaTotal.toFixed(2);




    lucroElemento.innerHTML =

    "R$ " +
    lucroTotal.toFixed(2);





    produtosElemento.innerHTML =

    quantidadeProdutos;






    if(fechamentos.length > 0){



        const ultimo =

        fechamentos[
            fechamentos.length - 1
        ];



        ultimoElemento.innerHTML =

        ultimo.data;



    }




}









// =====================================================
// HISTÓRICO
// =====================================================


function carregarHistorico(){



    const tabela =

    document.getElementById(
        "historicoTabela"
    );



    if(!tabela){

        return;

    }



    tabela.innerHTML = "";





    fechamentos
    .slice()
    .reverse()
    .forEach(relatorio=>{


        tabela.innerHTML += `


        <tr>


        <td>
        ${relatorio.data}
        </td>



        <td>
        ${relatorio.local}
        </td>



        <td>
        R$ ${relatorio.receitaTotal.toFixed(2)}
        </td>



        <td>
        R$ ${relatorio.lucroLiquido.toFixed(2)}
        </td>



        <td>


        <button onclick="
        abrirRelatorio(${relatorio.id})
        ">
        🔍
        </button>



        </td>



        </tr>


        `;



    });



}








function abrirRelatorio(id){



    const relatorio =

    fechamentos.find(

        item =>
        item.id === id

    );



    if(relatorio){


        mostrarRelatorio(
            relatorio
        );


        mostrarPagina(
            "relatorio"
        );


    }



}








// =====================================================
// PESQUISA NO HISTÓRICO
// =====================================================


function pesquisarHistorico(texto){



    const tabela =

    document.getElementById(
        "historicoTabela"
    );



    if(!tabela){

        return;

    }





    tabela.innerHTML = "";





    const resultado =

    fechamentos.filter(

        item =>

        item.data.includes(texto)

        ||

        item.local
        .toLowerCase()
        .includes(
            texto.toLowerCase()
        )


    );







    resultado.forEach(relatorio=>{



        tabela.innerHTML += `


        <tr>

        <td>
        ${relatorio.data}
        </td>


        <td>
        ${relatorio.local}
        </td>


        <td>
        R$ ${relatorio.receitaTotal.toFixed(2)}
        </td>


        <td>
        R$ ${relatorio.lucroLiquido.toFixed(2)}
        </td>


        </tr>



        `;


    });



}







// =====================================================
// EXPORTAR BACKUP
// =====================================================


function exportarBackup(){



    const backup = {


        produtos,


        fechamentos,


        configuracoes



    };





    const arquivo =

    JSON.stringify(
        backup,
        null,
        2
    );






    const blob =

    new Blob(

        [arquivo],

        {

            type:
            "application/json"

        }


    );






    const link =

    document.createElement(
        "a"
    );




    link.href =

    URL.createObjectURL(
        blob
    );





    link.download =

    "backup-delicias-do-milho.json";





    link.click();



}








// =====================================================
// RESTAURAR BACKUP
// =====================================================


function restaurarBackup(){



    const input =

    document.createElement(
        "input"
    );



    input.type = "file";

    input.accept =
    ".json";





    input.onchange = evento => {



        const arquivo =

        evento.target.files[0];



        const leitor =

        new FileReader();






        leitor.onload = e => {



            const dados =

            JSON.parse(
                e.target.result
            );




            produtos =
            dados.produtos || [];



            fechamentos =
            dados.fechamentos || [];



            configuracoes =
            dados.configuracoes || {};






            salvarProdutos();


            salvarFechamentos();


            salvarConfiguracoes();




            location.reload();



        };




        leitor.readAsText(
            arquivo
        );



    };




    input.click();



}








// =====================================================
// LIMPAR SISTEMA
// =====================================================


function limparDados(){



    const confirmar =

    confirm(

    "Deseja apagar todos os dados?"

    );





    if(confirmar){



        localStorage.clear();



        location.reload();



    }



}








// =====================================================
// IMPRIMIR RELATÓRIO
// =====================================================


function imprimirRelatorio(){


    window.print();


}








// =====================================================
// ALERTA DE ESTOQUE BAIXO
// =====================================================


function verificarEstoque(){



    const alerta =

    document.getElementById(
        "alertasEstoque"
    );



    if(!alerta){

        return;

    }




    let mensagens = [];





    produtos.forEach(produto=>{



        if(

            produto.estoqueAtual <= 10

        ){



            mensagens.push(

            `⚠ ${produto.nome}
            está com estoque baixo`

            );


        }



    });





    if(mensagens.length > 0){



        alerta.innerHTML =

        mensagens.join("<br>");



    }

    else{


        alerta.innerHTML =

        "Nenhum alerta";


    }



}








// =====================================================
// INICIALIZAÇÃO FINAL
// =====================================================


document.addEventListener(
"DOMContentLoaded",

()=>{


    atualizarData();


    carregarTema();


    carregarProdutos();


    carregarProdutosFechamento();


    atualizarDashboard();


    carregarHistorico();


    verificarEstoque();



});
