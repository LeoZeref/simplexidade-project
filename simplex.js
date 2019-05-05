function solveSimplex(quantDec,quantRes,choice){
	$("#inputValues").hide();

	var matrizSimplex = getRestrictionValues(quantDec,quantRes); //get the values of the restriction inputs
	matrizSimplex.push(getFunctionzValues(quantDec,quantRes)); //get the values of the functionZ inputs

	// console.log(matrizSimplex);
	//quantDec = 2
	//quantRes = 4

	var allTables = [];

	var tablesCount = 0;

	//condition value to stop the loop
	var stopConditionValue = 0;

	//max iterations
	var iMax = $('#iMax').val()
	if(iMax <= 0){
		iMax = 20;
	}
	console.log(iMax)

	var bValues = []

	//uncomment to test matriz 
	
	/*matrizSimplex = [[1,0,1,0,0,4],
					[0,1,0,1,0,6],
					[3,2,0,0,1,18],
					[-3,-5,0,0,0,0]] 
	matrizSimplex = [[1,0,1,0,0,4],
				[0,0,0,1,0,6],
				[3,0,0,0,1,18],
				[-3,-5,0,0,0,0]]*/


	//var matrizSimplex = [[10,12,1,0,0,0,1750],
	//[0.3,0.5,0,1,0,0,55],[0.2,0.2,0,0,1,0,30],
	//[12,17,0,0,0,1,10000],[-3.5,-5.2,0,0,0,0,0]]

	staticTblVars = staticTableVars(quantDec,quantRes);
	varsOnBase = staticTblVars[0];

	varsOnHead = staticTblVars[1];


	columnsCount = quantDec + quantRes + 1;
	rowsCount    = quantRes + 1 ;

	for(let i = 0 ; i < rowsCount; i++){
		console.log(matrizSimplex[i][columnsCount-1])
		bValues.push(matrizSimplex[i][columnsCount-1])
	}

	matrizToTable(matrizSimplex,"Inicial",varsOnHead,varsOnBase,rowsCount,allTables,0);
	tablesCount++

	do{

		//find the lower number in functionZ row and its column
		lowerNumberAndColumn = getLowerNumberAndColumn(matrizSimplex, rowsCount, columnsCount);
		lowerNumber = lowerNumberAndColumn[0];


		if(lowerNumber == 0){
			break;
		}
		columnLowerNumber = lowerNumberAndColumn[1];

		//get the lower result of the division between last column and the lower number(functionZ) column
		whoLeavesResults = whoLeavesBase(matrizSimplex, columnLowerNumber, columnsCount, rowsCount, varsOnBase);
		varsOnBase = whoLeavesResults[1];
		pivoRow    = whoLeavesResults[0]
		pivoColumn = columnLowerNumber;
		pivoValue  = matrizSimplex[pivoRow][pivoColumn];


		//get the matriz with pivo row update
		matrizSimplex = divPivoRow(matrizSimplex,columnsCount,pivoRow,pivoValue);

		//null all the other values on the pivo column
		matrizSimplex = nullColumnElements(matrizSimplex,pivoRow,pivoColumn,rowsCount,columnsCount);
		
		//funczValues receive the last row of the matriz('Z row')
		funczValues = matrizSimplex[rowsCount-1];
		
		hasNegativeOrPositive = funczValues.some(v => v < 0);
	
		//increments stop condition
		stopConditionValue += 1;

		if(stopConditionValue == iMax){
			break;
		}

		//show parcial matriz 
		if(hasNegativeOrPositive == true){
			matrizToTable(matrizSimplex,"Parcial"+stopConditionValue,varsOnHead,varsOnBase,rowsCount,allTables,tablesCount);
			tablesCount++
		}

	}while(hasNegativeOrPositive == true);


	matrizToTable(matrizSimplex,"Final",varsOnHead,varsOnBase,rowsCount,allTables,tablesCount);
	senseTable(matrizSimplex,varsOnHead,varsOnBase,quantDec,bValues)
	if(choice == 1){
		$(".container").append(allTables[stopConditionValue]);
		printResults(matrizSimplex,quantDec,quantRes,columnsCount,varsOnBase);
	}else{
		for (let i = 0 ; i < allTables.length; i++) {
			$(".container").append(allTables[i]);
		}	
		printResults(matrizSimplex,quantDec,quantRes,columnsCount,varsOnBase);
	}

	$(".container").append('<br><div class="row"><div class="col-md-12"><button id="again" class="btn btn-primary" onclick="location.reload();" >Recomeçar</button></div>	</div>')
	$('body').css({
		'background-color': 'rgb(46, 90, 110)'
	});
}

function printResults(matriz,quantDec,quantRes,columnsCount,base){

	if(($("#min").is(':checked'))){
		var zValue = matriz[matriz.length-1][columnsCount-1] * -1;
		
	}else{
		var zValue = matriz[matriz.length-1][columnsCount-1]
	}

	$("#solution").append('<div class="col-md-12">A solução ótima é Z = '+zValue+'</div><br>');

	//print the base vars values 
	for (let i = 0; i < quantRes ; i++) {
		var baseName = base[i];
		var baseValue = matriz[i][columnsCount-1];
		$("#results").append('<div>'+baseName+'='+baseValue+'</div>')
	}

}

function firstPhase(){
	$(document).ready(function () {
		
		//get amount of decisions variables
		var quantDec = $("input[name=quantDecision]").val();
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
		var quantRes = $("input[name=quantRestriction]").val();
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

		generateFunctionZ(quantDec);
		
		generateRestrictions(quantDec,quantRes);

		//adds a button that calls the second phase of the process
		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-6"><button id="solveSimplex" onclick="solveSimplex('+quantDec+','+quantRes+',1)" class="btn btn-primary">Solução direta</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');

		$("#buttons").append('<div class="col-md-6"><button id="stepByStep" onclick="solveSimplex('+quantDec+','+quantRes+',2)" class="btn btn-primary">Passo a Passo</button></div>');

	});
}
