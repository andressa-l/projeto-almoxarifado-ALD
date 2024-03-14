carregarCategorias();

document.querySelectorAll(".greenInput").forEach((input) => {
  input.addEventListener("focus", () => {
    input.style.border = "1px solid green";
  });
  input.addEventListener("focusout", () => {
    input.style.border = "1px solid  #e3e6eb";
  });
});

let nomeElement = document.getElementById("NomeFuncionario");
var idDepartamentoElement = document.getElementById("idDepartamento");
idDepartamentoElement.addEventListener("change", () => {
  if (idDepartamentoElement.value != "" && idDepartamentoElement.value != 0) {
    carregarDepartamento(idDepartamentoElement.value);
  } else {
    document.getElementById("departamento").value = "";
  }
});

document.querySelectorAll("input[data-isnumber='true']").forEach((input) => {
  input.addEventListener("keypress", (event) => {
    if (isNaN(event.key) || event.key < 0) {
      event.preventDefault();
    }
  });
});

let idFuncionarioElement = document.getElementById("idFuncionario");
idFuncionarioElement.addEventListener("blur", () => {
  if (idFuncionarioElement.value == null || idFuncionarioElement == "") return;
  const filtrarPorDepartamento = funcionarios.filter(
    (func) => func.idDepartamento == idDepartamentoElement.value
  );

  const funcionario = filtrarPorDepartamento.find(
    (x) => x.idFuncionario == idFuncionarioElement.value
  );

  if (!funcionario) {
    document.getElementById("NomeFuncionario").value = "";
    document.getElementById("cargo").value = "";
    return;
  }

  document.getElementById("NomeFuncionario").value = funcionario.Nome;
  document.getElementById("cargo").value = funcionario.Cargo;
});

function carregarDepartamento(idDepartamento) {
  var inputDepartamento = document.getElementById("departamento");
  const departamentoFiltrado = departamentos.filter(
    (d) => d.idDepartamento == idDepartamento
  );
  if (departamentoFiltrado.length == 0) {
    exibirErro("idDepartamento", "Departamento não encontrado");
    inputDepartamento.value = "";
    return;
  }
  inputDepartamento.value = departamentoFiltrado[0].Descricao;
  ocultarErro("idDepartamento");
}

function displayResults(results) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  // Exibir novos resultados
  results.forEach((result) => {
    const li = document.createElement("li");
    li.classList.add("result-item");
    li.textContent = result.Nome;
    li.setAttribute("data-id", result.idFuncionario);
    li.addEventListener("click", () => {
      document.getElementById("NomeFuncionario").value = result.Nome;
      document.getElementById("idFuncionario").value = result.idFuncionario;
      document.getElementById("cargo").value = result.Cargo;
      searchResults.innerHTML = "";
    });

    searchResults.appendChild(li);
  });
}

// ----------------- CATEGORIAS E MOTIVOS ----------------- //

function carregarCategorias() {
  const selectCategoria = document.getElementById("categoriaMotivo");
  selectCategoria.innerHTML = "";

  const optionFirst = document.createElement("option");
  optionFirst.value = -1;
  optionFirst.text = "";
  selectCategoria.appendChild(optionFirst);

  getAllCategorias().forEach(function (categoria) {
    let option = document.createElement("option");
    option.value = categoria.idCategoria;
    option.text = categoria.Descricao;
    selectCategoria.add(option);
  });
}

function carregarMotivos() {
  const selectMotivo = document.getElementById("Motivo");
  selectMotivo.innerHTML = "";

  const optionFirst = document.createElement("option");
  optionFirst.value = -1;
  optionFirst.text = "";
  selectMotivo.appendChild(optionFirst);

  const valorCategoria = document.getElementById("categoriaMotivo");
  const motivosFiltrados = motivos.filter(
    (m) => m.idCategoria == valorCategoria.value
  );

  motivosFiltrados.forEach(function (motivo) {
    let option = document.createElement("option");
    option.value = motivo.idMotivo;
    option.text = motivo.Descricao;
    selectMotivo.add(option);
  });
  document.getElementById("Motivo").disabled = false;
}

let categoriaMotivoElement = document.getElementById("categoriaMotivo");

categoriaMotivoElement.addEventListener("change", function () {
  if (categoriaMotivoElement.value == "-1") {
    document.getElementById("Motivo").disabled = true;

    document.getElementById("Motivo").value = "";

    return;
  }
  carregarMotivos();
});

// ----------------- PRODUTOS ----------------- //
saideElement = document.getElementById("Saida");

document.getElementById("CodigoProduto").addEventListener("blur", function () {
  const idProduto = document.getElementById("CodigoProduto").value;
  const produtoFiltrado = produtos.filter((p) => p.idProduto == idProduto);

  if (produtoFiltrado.length == 0) {
    document.getElementById("DescricaoProduto").value = "";
    document.getElementById("Estoque").value = "";
    saideElement.value = "";
    saideElement.disabled = true;
    return;
  }
  document.getElementById("DescricaoProduto").value =
    produtoFiltrado[0].Descricao;
  document.getElementById("Estoque").value = produtoFiltrado[0].Estoque;

  acimaDe10(produtoFiltrado[0].Estoque, produtoFiltrado[0].EstoqueMinimo);
  if (produtoFiltrado[0].Estoque != 0) {
    saideElement.disabled = false;
  }
});

saideElement.addEventListener("blur", function () {
  if (
    parseInt(document.getElementById("Estoque").value) >=
      parseInt(saideElement.value) &&
    parseInt(saideElement.value) != 0 &&
    saideElement.value != ""
  ) {
    document.getElementById("BtnInserirItens").style.display = "flex";
    return;
  }

  document.getElementById("BtnInserirItens").style.display = "none";
});

function acimaDe10(estoque, estoqueMinimo) {
  let porcentagemEstoque = estoqueMinimo * 0.1;
  console.log(estoqueMinimo + "aqui " + porcentagemEstoque);

  let corEstoque = document.getElementById("corEstoque");
  if (estoque >= estoqueMinimo + porcentagemEstoque) {
    corEstoque.style.backgroundColor = "#00D222";
  }
  if (
    estoque < estoqueMinimo + porcentagemEstoque &&
    estoque >= estoqueMinimo
  ) {
    corEstoque.style.backgroundColor = "#FBF215";
    return;
  }
  if (estoque < estoqueMinimo) {
    corEstoque.style.backgroundColor = "#92030C";
  }
}

var divCorEstoque = document.getElementById("corEstoque");

divCorEstoque.addEventListener("mouseover", function () {
  document.querySelector(".modalEstoque").style.display = "block";
});

divCorEstoque.addEventListener("mouseout", function () {
  document.querySelector(".modalEstoque").style.display = "none";
});

let itensDaSecao = [];

function adicionarProduto() {
  event.preventDefault();
  const idProduto = document.getElementById("CodigoProduto").value;

  const produtoFiltrado = produtos.find((p) => p.idProduto == idProduto);

  if (!produtoFiltrado) {
    alert("Produto não encontrado");
    return;
  }

  if (varificarSeExisteProduto(idProduto)) {
    alert("Produto já adicionado");
    return;
  }

  const descricaoProduto = document.getElementById("DescricaoProduto").value;
  const quantidade = document.getElementById("Saida").value; // Suponho que você queira usar o campo Estoque
  const preco = produtoFiltrado.Preco;
  const total = quantidade * preco;

  if (quantidade > produtoFiltrado.Estoque) {
    alert("Quantidade maior que o estoque");
    return;
  }
  if (quantidade <= 0) {
    alert("Quantidade inválida");
    return;
  }

  const novoItem = {
    idProduto,
    descricaoProduto,
    quantidade,
    preco,
    total,
  };

  itensDaSecao.push(novoItem);

  let tabela = document.getElementById("tabela-body");

  let linha = document.createElement("tr");

  let divProduto = document.createElement("td");
  let divDescricao = document.createElement("td");
  divProduto.setAttribute("class", "codigo");
  divDescricao.setAttribute("class", "descricao");
  let divQuantidade = document.createElement("td");
  let divUnidade = document.createElement("td");
  let divPreco = document.createElement("td");
  let divTotal = document.createElement("td");
  let divExcluir = document.createElement("th");
  divExcluir.setAttribute("class", "excluir");

  divProduto.textContent = idProduto;
  divDescricao.textContent = descricaoProduto;
  divQuantidade.textContent = quantidade;
  divUnidade.textContent = `1`; // Substitua com a unidade real, se aplicável
  divPreco.textContent = preco;
  divTotal.textContent = total;
  divExcluir.textContent = "X";

  linha.appendChild(divProduto);
  linha.appendChild(divDescricao);
  linha.appendChild(divQuantidade);
  linha.appendChild(divUnidade);
  linha.appendChild(divPreco);
  linha.appendChild(divTotal);
  linha.appendChild(divExcluir);

  divExcluir.addEventListener("click", () => {
    tabela.removeChild(linha);
    removeItemDaSecao(idProduto, quantidade);
    atualizarTotal();
  });

  tabela.appendChild(linha);

  saidaDeProdutos(idProduto, quantidade);
  limparCampoProduto();
  saideElement.disabled = true;
  document.getElementById("BtnInserirItens").style.display = "none";

  atualizarTotal();
}

function removeItemDaSecao(idProduto, quantidade) {
  adicionaEstoqueProduto(idProduto, parseInt(quantidade));

  itensDaSecao = itensDaSecao.filter((item) => item.idProduto != idProduto);
}

function limparCampoProduto() {
  document.getElementById("CodigoProduto").value = "";
  document.getElementById("DescricaoProduto").value = "";
  document.getElementById("Estoque").value = "";
  document.getElementById("Saida").value = "";
}

function atualizarTotal() {
  let total = 0;

  for (let item of itensDaSecao) {
    total += item.total;
  }
  document.getElementById("totalItens").textContent = total;
}

function varificarSeExisteProduto(idProduto) {
  let existe = false;

  for (const item of itensDaSecao) {
    if (item.idProduto == idProduto) {
      existe = true;
    }
  }
  return existe;
}

function adicionaEstoqueProduto(idProduto, quantidade) {
  produtos[idProduto - 1].Estoque += quantidade;
}

// ----------------- REQUISIÇÃO ----------------- //
function salvarRequisicao() {
  event.preventDefault();
  if (!validarFormulario()) return;

  const idMotivo = document.getElementById("Motivo").value;
  const motivoFiltrado = motivos.find((m) => m.idMotivo == idMotivo);

  const idCategoria = document.getElementById("categoriaMotivo").value;
  const categoriaFiltrada = categorias.find(
    (c) => c.idCategoria == idCategoria
  );

  const idFuncionario = document.getElementById("idFuncionario").value;
  const funcionarioFiltrado = funcionarios.find(
    (f) => f.idFuncionario == idFuncionario
  );

  const nmrRequisisao = document.getElementById("inpNumero").value;

  const idDepartamento = document.getElementById("idDepartamento").value;

  const dataRequesicao = document.getElementById("dataRequesicao").value;

  const radioPrioridadeMarcado = document.querySelector(
    'input[name="prioridade"]:checked'
  );

  if (itensDaSecao.length == 0) {
    alert("Adicione pelo menos um produto");
    return;
  }

  const nivelDePrioridade = radioPrioridadeMarcado.value;

  const novoPedido = {
    nmrRequisisao,
    idDepartamento,
    dataRequesicao,
    funcionarioFiltrado,
    categoriaFiltrada,
    motivoFiltrado,
    nivelDePrioridade,
    itensDaSecao,
  };

  alert("Pedido salvo com sucesso!");
  setTimeout(() => {
    location.reload();
  }, 1300);
}

function cancelarRequisicao() {
  event.preventDefault();

  location.reload();
  alert("Pedido cancelado com sucesso!");
}

// ----------------- Responsive ----------------- //

function responsiveTexts() {
  var windowWidth = window.innerWidth;

  var labelEstoque = document.querySelector(".label-estoque");
  var labelDelete = document.getElementById("table-deletar");
  var buttonAdicionar = document.getElementById("button-add");

  if (windowWidth < 700) {
    labelEstoque.textContent = "Qtd.";
    labelDelete.textContent = "X";
    buttonAdicionar.textContent = "+";
  } else {
    labelEstoque.textContent = "Estoque";
    labelDelete.textContent = "Deletar";
    buttonAdicionar.textContent = "Adicionar";
  }
}

window.addEventListener("DOMContentLoaded", responsiveTexts);
window.addEventListener("resize", responsiveTexts);

// ----------------- header ----------------- //


var icon = document.getElementById("icon");
var icon1 = document.getElementById("a");
var icon2 = document.getElementById("b");
var icon3 = document.getElementById("c");
var nav = document.getElementById('nav');
var blue = document.getElementById("blue");

icon.addEventListener('click', function() {
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
  nav.classList.toggle('show');
  blue.classList.toggle('slide');
});