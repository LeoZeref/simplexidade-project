function firstPhase(){
	$(document).ready(function () {
		
		//get amount of decisions variables
		var quantDec = $("input[name=pesoMax]").val();
		if( quantDec.length == 0 || quantDec == '0') {
			alert('Você precisa inserir alguma quantia em variavel de decisão');	
			return;	
		} else {
			quantDec = parseFloat(quantDec);
			if(quantDec < 1){
				return;
			}
		}

		//get amount of restrictions
		var quantRes = $("input[name=quantObj]").val();
		if( quantRes.length == 0 || quantRes == '0') {
			alert('Você precisa inserir alguma quantia em variavel de restrição');	
			return;	
		} else {
			quantRes = parseFloat(quantRes);
			if(quantRes < 1){
				return;
			}
		}


		//hide the first phase button
		$("#firstPhase").remove();
		$("#startInputs").hide();
		
		//adds a button that calls the second phase of the process
		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-6 col-lg-6"><button id="solveSimplex" onclick="solveSimplex('+quantDec+','+quantRes+',1)" class="btn btn-primary">Solução</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');

		$("#buttons").append('<div class="col-md-6"><button id="stepByStep" onclick="solveSimplex('+quantDec+','+quantRes+',2)" class="btn btn-primary">Passo a Passo</button></div>');

	});
}