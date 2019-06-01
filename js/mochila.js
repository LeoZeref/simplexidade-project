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
		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-6 col-lg-6"><button id="solveSimplex" onclick="solveSimplex('+pesoMax+','+quantObj+',1)" class="btn btn-primary">Solução</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');

		$("#buttons").append('<div class="col-md-6"><button id="stepByStep" onclick="solveSimplex('+pesoMax+','+quantObj+',2)" class="btn btn-primary">Passo a Passo</button></div>');

	});
}

function generateRestrictions(quantObj){
	$(".container").append('<div id="inputValues"></div>');
	$("#inputValues").append('<div class="row"><div class="col-md-12" id="divRestTitle"><h2>Objetos:</h2></div></div>');

	//adds the restrictions inputs to the body 
	for (let i = 1; i <= quantObj ; i++) {

		$("#inputValues").append('<div class="row justify-content-center" id="row'+i+'"></div>');



		$("#row"+i+"").append('<div class="row mt-5"><div class="col-md-4"> <div class="custom-control"><label>Nome</label><input placeholder="Nome" type="text" class="form-control m-2"  id="nome'+i+'" name="nome'+i+'"></div></div><div class="col-md-4"><div class="custom-control"><label>Peso:</label><input placeholder="Peso" type="text" class="form-control m-2" id="Peso'+i+'" name="Peso'+i+'"></div></div><div class="col-md-4"><div class="custom-control"><label>Valor:</label><input placeholder="Valor" type="text" class="form-control m-2" id="valor'+i+'" name="valor'+i+'"></div></div></div>');

	}

}