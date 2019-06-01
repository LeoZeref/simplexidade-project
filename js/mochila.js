function firstPhase(){
	$(document).ready(function () {
		
		//get amount of decisions variables
		var pesoMax = $("input[name=pesoMax]").val();
		if( pesoMax.length == 0 || pesoMax == '0') {
			alert('Você precisa inserir alguma quantia em variavel de decisão');	
			return;	
		} else {
			pesoMax = parseFloat(pesoMax);
			if(pesoMax < 1){
				return;
			}
		}

		//get amount of restrictions
		var quantObj = $("input[name=quantObj]").val();
		if( quantObj.length == 0 || quantObj == '0') {
			alert('Você precisa inserir alguma quantia em variavel de restrição');	
			return;	
		} else {
			quantObj = parseFloat(quantObj);
			if(quantObj < 1){
				return;
			}
		}

		//hide the first phase button
		$("#firstPhase").remove();
		$("#startInputs").hide();
		
		generateRestrictions(quantObj);
		
		//adds a button that calls the second phase of the process
		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-6 col-lg-6"><button id="solveSimplex" onclick="processData('+pesoMax+','+quantObj+',1)" class="btn btn-primary">Solução</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');
	});
}

function generateRestrictions(quantObj){
	$(".container").append('<div id="inputValues"></div>');
	$("#inputValues").append('<div class="row"><div class="col-md-12" id="divRestTitle"><h2>Objetos:</h2></div></div>');

	//adds the restrictions inputs to the body 
	for (let i = 1; i <= quantObj ; i++) {

		$("#inputValues").append('<div class="row justify-content-center" id="row'+i+'"></div>');

		$("#row"+i+"").append('<div class="row mt-5"><div class="col-md-4"> <div class="custom-control"><label>Nome</label><input placeholder="Nome" type="text" class="form-control m-2"  id="nome'+i+'" name="nome'+i+'"></div></div><div class="col-md-4"><div class="custom-control"><label>Peso:</label><input placeholder="Peso" type="text" class="form-control m-2" id="peso'+i+'" name="peso'+i+'"></div></div><div class="col-md-4"><div class="custom-control"><label>Valor:</label><input placeholder="Valor" type="text" class="form-control m-2" id="valor'+i+'" name="valor'+i+'"></div></div></div>');

	}

}

function knapsack(items, capacity){
	var memo = [];
  
	for (var i = 0; i < items.length; i++) {
	  var row = [];
	  for (var cap = 1; cap <= capacity; cap++) {
		row.push(getSolution(i,cap));
	  }
	  memo.push(row);
	}
  
	return(getLast());
  
	function getLast(){
	  var lastRow = memo[memo.length - 1];
	  return lastRow[lastRow.length - 1];
	}
  
	function getSolution(row,cap){
	  const NO_SOLUTION = {maxValue:0, subset:[]};
	  var col = cap - 1;
	  var lastItem = items[row];
	  var remaining = cap - lastItem.w;
  
	  var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
	  var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;
  
	  if(remaining < 0){
		return lastSolution;
	  }
  
	  var lastValue = lastSolution.maxValue;
	  var lastSubValue = lastSubSolution.maxValue;
  
	  var newValue = lastSubValue + lastItem.v;
	  if(newValue >= lastValue){
		var _lastSubSet = lastSubSolution.subset.slice();
		_lastSubSet.push(lastItem);
		return {maxValue: newValue, subset:_lastSubSet};
	  }else{
		return lastSolution;
	  }
	}
  }
  
function processData(capacidade, totalObjs) { 
	let arr = [];

	for (let i = 1; i <= totalObjs; i++) {
		let nome = $('#row'+ i).find('#nome'+ i).val();
		let peso = $('#row'+ i).find('#peso'+ i).val(); 
		let valor = $('#row'+ i).find('#valor'+ i).val();

		let w = parseInt(peso, 10);
		let v = parseInt(valor, 10)
		arr.push({nome, w, v});
	}
	let result = knapsack(arr, capacidade);
	console.log(result);

	var div = $('#inputValues').append('Itens a serem levados: ');

	for (let j = 0; j < result.subset.length; j++) {
		var res = result.subset[j].nome;
		$('#inputValues').append(res + ' ');
	}
}