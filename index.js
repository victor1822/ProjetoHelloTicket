// estrutura da classe carro
class Carro {
    constructor(placa, modelo, fabricante, dataDeCompra, stringDataCompra, dataDeVenda, stringDataVenda, situacao) {
      this.placa = placa;
      this.modelo = modelo;
      this.fabricante = fabricante;
      this.dataDeCompra = dataDeCompra;
      this.dataDeVenda = dataDeVenda;
      this.situacao = situacao;
      this.stringDataCompra = stringDataCompra;
      this.stringDataVenda = stringDataVenda;
    }
  }

  // Arrays de possíveis estáticas para cadastro fabricantes, e de situações
  const listaDeFabricantes = ['Toyota','Honda','Fiat','VW'];
  const listaDeSituacoes = ['Em uso', 'Em manutenção', 'Vendido'];

  // Array de carros
  let carros = [];

  function loadCarsFromStorage(){
    // Pega os dados do navegador
    return new Promise((resolve, reject)=>{
        carros = JSON.parse(localStorage.getItem('cars')) || []; //caso o local storage esteja vazio, retornar array vazio
        resolve(carros);
    });
}

  // Salva os dados no navegador
function saveCarsToStorage(){
    localStorage.setItem('cars',JSON.stringify(carros));
}

// Atualiza as divs da lista de carros 
function reloadDivs(){
  let tableList = document.querySelector("#display ul");
  tableList.innerHTML = "";
  for(var i=0; i < carros.length; i++){
    var DataDaCompra = carros[i].stringDataCompra;
    var DataDaVenda = carros[i].stringDataVenda;
    var placa = document.createElement("h4");
    placa.innerHTML = carros[i].placa;
    var modelo = document.createElement("h4");
    modelo.innerHTML = carros[i].modelo;
    var fabricante = document.createElement("h4");
    fabricante.innerHTML = carros[i].fabricante;
    var dataDeCompra = document.createElement("h4");
    dataDeCompra.innerHTML = DataDaCompra;
    var dataDeVenda = document.createElement("h4");
    dataDeVenda.innerHTML = DataDaVenda;
    var situacao = document.createElement("h4");
    situacao.innerHTML = carros[i].situacao;
    var novaDiv = document.createElement("div");
    // var btnDel = document.createElement("button");
    // btnDel.innerHTML="Deletar";
    // btnDel.setAttribute("class","btnDel");
    // btnDel.onclick = () => {
      // removeElementAndReloadDivs(i);
    // };
    // var btnEdit = document.createElement("button");
    // btnEdit.setAttribute("class","btnEdit");
    // btnEdit.innerHTML="Editar";
    // btnEdit.onclick = toggleModal2;
    var btns = "<button class = 'btnEdit' onclick = 'toggleModal2(" + i + ")'>Editar</button> <button class = 'btnDel' onclick = 'removeElementAndReloadDivs(" + i + ")'>Deletar</button>";
    novaDiv.innerHTML= btns;
    // novaDiv.appendChild(btnEdit);
    // novaDiv.appendChild(btnDel);
    var li = document.createElement("li");
    if(carros[i].situacao=='Vendido'){
      li.setAttribute("class","Vendido");
    }
    li.appendChild(placa);
    li.appendChild(modelo);
    li.appendChild(fabricante);
    li.appendChild(dataDeCompra);
    li.appendChild(dataDeVenda);
    li.appendChild(situacao);
    li.appendChild(novaDiv);
    tableList.appendChild(li);
  }
}

// salva novo array no local storage e recarrega as divs 
function saveCarsToStorageAndReloadDivs(){
  saveCarsToStorage();
  reloadDivs();
}

// salva novo array com um elemento a menos no local storage e recarrega as divs 
function removeElementAndReloadDivs(i){
  carros.splice(i,1);
  saveCarsToStorageAndReloadDivs();
}

function loadOptions(){
  let dropdownFabricante = document.getElementById("fabricante");
  let dropdownSituacao = document.getElementById("situacao");
  for(var i = 0; i < listaDeFabricantes.length; i++){
    var novaOpcaoF = document.createElement("option");
    novaOpcaoF.setAttribute("value",i);
    novaOpcaoF.innerHTML=listaDeFabricantes[i];
    dropdownFabricante.appendChild(novaOpcaoF);
  }
  for(var j = 0; j < listaDeSituacoes.length; j++){
    var novaOpcaoS = document.createElement("option");
    novaOpcaoS.setAttribute("value",j);
    novaOpcaoS.innerHTML=listaDeSituacoes[j];
    dropdownSituacao.appendChild(novaOpcaoS);
  }
}

//converte string em data do javascript
function stringToDate(data) {

  //pega a primeira fatia da string que vem antes do primeiro traço
  var ano  = data.split("-")[0];
  //pega a primeira fatia da string que vem antes do segundo traço e depois do primeiro
  var mes  = data.split("-")[1];
  //pega a primeira fatia da string que vem antes do terceiro traço e depois do segundo
  var dia  = data.split("-")[2];

  return new Date(ano,mes-1,dia);
}

// converte uma data em string e retorna uma string no formato de data local
function formatDate(data) {

  //pega a primeira fatia da string que vem antes do primeiro traço
  var ano  = data.split("-")[0];
  //pega a primeira fatia da string que vem antes do segundo traço e depois do primeiro
  var mes  = data.split("-")[1];
  //pega a primeira fatia da string que vem antes do terceiro traço e depois do segundo
  var dia  = data.split("-")[2];

  return ("0" + dia).substr(-2) + "/" 
  + ("0" + (mes)).substr(-2) + "/" + ano;
}

//funcao para acrescentar a classe hide ao modal para que o estilo do hide possa esconder o elemento
function toggleModal(){
  document.getElementById("modal").classList.toggle("hide");
}

function toggleModal2(){
  document.getElementById("modal2").classList.toggle("hide");
}

function checkPlaca(p){
  let index = -1;
  for(carro of carros){
    if(carro.placa == p) index =  carros.indexOf(carro);
  }
  return (index >= 0);
}

function saveNewCar(){

  let placa = document.getElementById("placa").value;
  let modelo = document.getElementById("modelo").value;
  let datacompra = stringToDate(document.getElementById("datacompra").value);
  let stringDataDaCompra = formatDate(document.getElementById("datacompra").value);
  let datavenda = stringToDate(document.getElementById("datavenda").value);
  let stringDataDaVenda = formatDate(document.getElementById("datavenda").value);
  let fabricante = listaDeFabricantes[document.getElementById("fabricante").value];
  let situacao = listaDeSituacoes[document.getElementById("situacao").value];
  if(checkPlaca(placa)){
    alert("Já existe um carro com esta placa cadastrado no sistema!");
  }
  else if(placa == "" || modelo == "" || document.getElementById("datacompra").value=="" || document.getElementById("datavenda").value == "" || fabricante == undefined || situacao == undefined){
    alert("Preencha todos os campos");
  }
  else{
    let novoCarro = new Carro(placa,modelo,fabricante,datacompra,stringDataDaCompra,datavenda,stringDataDaVenda,situacao);
    carros.push(novoCarro);
    saveCarsToStorageAndReloadDivs();
    document.getElementById("modal").classList.toggle("hide");
  }
}

loadCarsFromStorage().then(()=>{
  reloadDivs();
});
loadOptions();