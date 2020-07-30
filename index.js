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

function emSituacao(situacao){
  return situacao == listaDeSituacoes[document.getElementById("filtroSituacao").value];
}

function emPeriodo(data){
  return data <= document.getElementById("fim").value && data >= document.getElementById("inicio").value;
}

// Atualiza as divs da lista de carros 
function reloadDivs(){
  let tableList = document.querySelector("#display ul");
  tableList.innerHTML = "";
   if(document.getElementById("filtroSituacao").value == ""){
     tmpArr = carros;
    // alert("sim");
   }else{
     tmpArr = carros.filter(function(car){
       return emSituacao(car.situacao) && emPeriodo(car.dataDeCompra);
     });
    // alert("nope.");
   }

  for(var i=0; i < tmpArr.length; i++){
    var DataDaCompra = tmpArr[i].stringDataCompra;
    var DataDaVenda = tmpArr[i].stringDataVenda;
    var placa = document.createElement("h4");
    placa.innerHTML = tmpArr[i].placa;
    var modelo = document.createElement("h4");
    modelo.innerHTML = tmpArr[i].modelo;
    var fabricante = document.createElement("h4");
    fabricante.innerHTML = tmpArr[i].fabricante;
    var dataDeCompra = document.createElement("h4");
    dataDeCompra.innerHTML = DataDaCompra;
    var dataDeVenda = document.createElement("h4");
    dataDeVenda.innerHTML = DataDaVenda;
    var situacao = document.createElement("h4");
    situacao.innerHTML = tmpArr[i].situacao;
    var novaDiv = document.createElement("div");
    var btns = `<button class = 'btnEdit' onclick = 'toggleModal2("${(tmpArr[i].placa)}")'>Editar</button> <button class = 'btnDel' onclick = 'removeElementAndReloadDivs("${(tmpArr[i].placa)}")'>Deletar</button>`
    novaDiv.innerHTML= btns;
    var li = document.createElement("li");
    if(tmpArr[i].situacao=='Vendido'){
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

function editCar(field){
  let carroEdit = carros[document.getElementById("editIndex").value];
  // alert(carroEdit.modelo);
  if(field == 'modelo') carroEdit.modelo = document.getElementById("editModelo").value;
  else if(field == 'datec') {
    carroEdit.DataDaCompra = stringToDate(document.getElementById("editDataCompra").value);
    carroEdit.stringDataCompra = formatDate(document.getElementById("editDataCompra").value);
  } 
  else if(field == 'datev') {
    carroEdit.DataDaVenda = stringToDate(document.getElementById("editDataVenda").value);
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
  document.getElementById("fim").value = nowDateToInputDateFormat(now);
}

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
