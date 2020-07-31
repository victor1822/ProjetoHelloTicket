//=================================Criacao e declaracao de variaveis=================================

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
let tmpArr = [];

//=================================Funções de escrita e leitura de dados na memória local=================================

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
  
//=================================Funções de manipulação de data=================================

//Função que pega a data no formato do date do javascript e converte para o formato compativel com o input 'YYYY-MM-DD'
function nowDateToInputDateFormat(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

//converte string 'YYYY-MM-DD' e converte em data do javascript
function stringToDate(data) {

  //pega a primeira fatia da string que vem antes do primeiro traço
  var ano  = data.split("-")[0];
  //pega a primeira fatia da string que vem antes do segundo traço e depois do primeiro
  var mes  = data.split("-")[1];
  //pega a primeira fatia da string que vem antes do terceiro traço e depois do segundo
  var dia  = data.split("-")[2];

  return new Date(ano,mes-1,dia);
}

// converte uma data no formato 'YYYY-MM-DD' em string e retorna uma string no formato de data local 'DD/MM/YYYY'
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

//converte a data do formato 'DD/MM/YYYY' para 'YYYY/MM/DD'
function formatBackDate(data){
    //pega a primeira fatia da string que vem antes do primeiro traço
    var dia  = data.split("/")[0];
    //pega a primeira fatia da string que vem antes do segundo traço e depois do primeiro
    var mes  = data.split("/")[1];
    //pega a primeira fatia da string que vem antes do terceiro traço e depois do segundo
    var ano  = data.split("/")[2];
  
    return ano + "-" 
    + ("0" + (mes)).substr(-2) + "-" + ("0" + dia).substr(-2);
}

//=================================Funções de testes lógicos=================================

function emSituacao(situacao){
  return situacao == listaDeSituacoes[document.getElementById("filtroSituacao").value];
}

function emPeriodo(data){
  return data <= document.getElementById("fim").value && data >= document.getElementById("inicio").value;
}

function checkPlaca(p){
  let index = -1;
  for(carro of carros){
    if(carro.placa == p) index =  carros.indexOf(carro);
  }
  return (index >= 0);
}

//=================================Funções de manipulação de elementos da DOM=================================

// Atualiza as divs da lista de carros de acordo com os filtros de periodo e situacao
function reloadDivs(){
  tmpArr = [];
  loadCarsFromStorage();
  let tableList = document.querySelector("#display ul");
  tableList.innerHTML = "";
   if(document.getElementById("filtroSituacao").value == ""){
    tmpArr = carros.filter(function(car){
      return emPeriodo(car.dataDeCompra);
    });
   }else{
     tmpArr = carros.filter(function(car){
       return emSituacao(car.situacao) && emPeriodo(car.dataDeCompra);
     });
   }

  for(var i=0; i < tmpArr.length; i++){
    var DataDaCompra = tmpArr[i].stringDataCompra;
    var DataDaVenda = tmpArr[i].stringDataVenda;
    var placaDiv = document.createElement("h4");
    placaDiv.innerHTML = tmpArr[i].placa;
    var modeloDiv = document.createElement("h4");
    modeloDiv.innerHTML = tmpArr[i].modelo;
    var fabricanteDiv = document.createElement("h4");
    fabricanteDiv.innerHTML = tmpArr[i].fabricante;
    var dataDeCompraDiv = document.createElement("h4");
    dataDeCompraDiv.innerHTML = DataDaCompra;
    var dataDeVendaDiv = document.createElement("h4");
    dataDeVendaDiv.innerHTML = DataDaVenda;
    var situacaoDiv = document.createElement("h4");
    situacaoDiv.innerHTML = tmpArr[i].situacao;
    var novaDiv = document.createElement("div");
    var btns = `<button class = 'btnEdit' onclick = 'toggleModal2("${(tmpArr[i].placa)}")'>Editar</button> <button class = 'btnDel' onclick = 'removeElementAndReloadDivs("${(tmpArr[i].placa)}")'>Deletar</button>`
    novaDiv.innerHTML= btns;
    var liDiv = document.createElement("li");
    if(tmpArr[i].situacao=='Vendido'){
      liDiv.setAttribute("class","Vendido");
    }
    liDiv.appendChild(placaDiv);
    liDiv.appendChild(modeloDiv);
    liDiv.appendChild(fabricanteDiv);
    liDiv.appendChild(dataDeCompraDiv);
    liDiv.appendChild(dataDeVendaDiv);
    liDiv.appendChild(situacaoDiv);
    liDiv.appendChild(novaDiv);
    tableList.appendChild(liDiv);
  }
}

//alterar data maxima da divo do filtro de data do periodo e recarregar as divs da lista
function reloadDataInicioMaxDateAndReloadListDivs(){
  let dataInicio = document.getElementById("inicio");
  let dataFim = document.getElementById("fim");
  dataInicio.setAttribute("max",dataFim.value);
  reloadDivs();
}
//alterar data minima da div do filtro de data de fim do periodo e recarregar as divs da lista
function reloadDataFimMinDateAndReloadListDivs(){
  let dataInicio = document.getElementById("inicio");
  let dataFim = document.getElementById("fim");
  dataFim.setAttribute("min",dataInicio.value);
  reloadDivs();
}

// salva novo array no local storage e recarrega as divs 
function saveCarsToStorageAndReloadDivs(){
  saveCarsToStorage();
  reloadDivs();
}

//Funcao criada para editar um carro
function editCar(field){
  let carroEdit = carros[document.getElementById("editIndex").value];
  if(field == 'modelo') carroEdit.modelo = document.getElementById("editModelo").value;
  else if(field == 'datec') {
    carroEdit.dataDeCompra = stringToDate(document.getElementById("editDataCompra").value);
    carroEdit.stringDataCompra = formatDate(document.getElementById("editDataCompra").value);
  } 
  else if(field == 'datev') {
    carroEdit.dataDeVenda = stringToDate(document.getElementById("editDataVenda").value);
    carroEdit.stringDataVenda = formatDate(document.getElementById("editDataVenda").value);
  } 
  else if(field == 'situacao') carroEdit.situacao = listaDeSituacoes[document.getElementById("editSituacao").value];
  else{
    console.log("Erro com os parâmetros da função editCar()");
  }
  saveCarsToStorageAndReloadDivs();
}

// salva novo array com um elemento a menos no local storage e recarrega as divs 
function removeElementAndReloadDivs(i){
  for(carro of carros){
    if(carro.placa == i) i = carros.indexOf(carro);
  }
  carros.splice(i,1);
  saveCarsToStorageAndReloadDivs();
}

function loadOptions(){
  let dropdownFabricante = document.getElementById("fabricante");
  let dropdownSituacao = document.getElementById("situacao");
  let dropDownSituacaoEdit = document.getElementById("editSituacao");
  let filterDropdownSituacao = document.getElementById("filtroSituacao");
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
  for(var k = 0; k < listaDeSituacoes.length; k++){
    var novaOpcaoS = document.createElement("option");
    novaOpcaoS.setAttribute("value",k);
    novaOpcaoS.innerHTML=listaDeSituacoes[k];
    dropDownSituacaoEdit.appendChild(novaOpcaoS);
  }
  for(var w = 0; w < listaDeSituacoes.length; w++){
    var novaOpcaoS = document.createElement("option");
    novaOpcaoS.setAttribute("value",w);
    novaOpcaoS.innerHTML=listaDeSituacoes[w];
    filterDropdownSituacao.appendChild(novaOpcaoS);
  }
  document.getElementById("inicio").value = "1994-04-25";
  let now = new Date();
  document.getElementById("inicio").setAttribute("max",nowDateToInputDateFormat(now));
  document.getElementById("fim").value = nowDateToInputDateFormat(now);
  document.getElementById("fim").setAttribute("min","1994-04-25");
}

//funcao para acrescentar a classe hide ao modal para que o estilo do hide possa esconder o elemento
function toggleModal(){
  document.getElementById("modal").classList.toggle("hide");
}

function toggleModal2(i){
  for(carro of carros){
    if(carro.placa == i) i = carros.indexOf(carro);
  }
  if(!i && i != 0){
    document.getElementById("modal2").classList.toggle("hide");
  }
  else{
    document.getElementById("modal2").classList.toggle("hide");
    document.getElementById("editIndex").value = i;
    document.getElementById("editModelo").value = carros[i].modelo;
    document.getElementById("editDataCompra").value = formatBackDate(carros[i].stringDataCompra);
    document.getElementById("editDataVenda").value = formatBackDate(carros[i].stringDataVenda);
    document.getElementById("editSituacao").value = listaDeSituacoes.indexOf(carros[i].situacao);
  }
}

function saveNewCar(){

  let placaValue = document.getElementById("placa").value;
  let modeloValue = document.getElementById("modelo").value;
  let datacompraValue = stringToDate(document.getElementById("datacompra").value);
  let stringDataDaCompraValue = formatDate(document.getElementById("datacompra").value);
  let datavendaValue = stringToDate(document.getElementById("datavenda").value);
  let stringDataDaVendaValue = formatDate(document.getElementById("datavenda").value);
  let fabricanteValue = listaDeFabricantes[document.getElementById("fabricante").value];
  let situacaoValue = listaDeSituacoes[document.getElementById("situacao").value];
  if(checkPlaca(placaValue)){
    alert("Já existe um carro com esta placa cadastrado no sistema!");
  }
  else if(placaValue == "" || modeloValue == "" || document.getElementById("datacompra").value=="" || document.getElementById("datavenda").value == "" || fabricanteValue == undefined || situacaoValue == undefined){
    alert("Preencha todos os campos");
  }
  else{
    let novoCarro = new Carro(placaValue,modeloValue,fabricanteValue,datacompraValue,stringDataDaCompraValue,datavendaValue,stringDataDaVendaValue,situacaoValue);
    document.getElementById("placa").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("datacompra").value = "";
    document.getElementById("datavenda").value = "";
    document.getElementById("fabricante").value = "";
    document.getElementById("situacao").value = "";
    carros.push(novoCarro);
    saveCarsToStorageAndReloadDivs();
    document.getElementById("modal").classList.toggle("hide");
  }
}

loadOptions();
loadCarsFromStorage().then(()=>{
  reloadDivs();
});
