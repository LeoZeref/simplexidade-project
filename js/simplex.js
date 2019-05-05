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

	// matrizToTable(matrizSimplex,"Inicial",varsOnHead,varsOnBase,rowsCount,allTables,0);
	// tablesCount++

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
			// matrizToTable(matrizSimplex,"Parcial"+stopConditionValue,varsOnHead,varsOnBase,rowsCount,allTables,tablesCount);
			tablesCount++
		}

	}while(hasNegativeOrPositive == true);


	// matrizToTable(matrizSimplex,"Final",varsOnHead,varsOnBase,rowsCount,allTables,tablesCount);
	// senseTable(matrizSimplex,varsOnHead,varsOnBase,quantDec,bValues)
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
		'background-color': 'rgb(240, 230, 240)'
	});
}

function getLowerNumberAndColumn(matriz,rowCount,columnCount){
	var column = 0;

	rowCount -= 1;// rowCount now has the correct value to use

	var lowerNumber = matriz[rowCount][0];

	//loop functionZ array to find the lower number value 
	for (let j = 1 , i = rowCount ; j < columnCount - 1 ; j++) {
		//make sure that lowerNumber has the lower value
		if(matriz[i][j] < lowerNumber){
			lowerNumber = matriz[i][j];
			column = j;
		}
	}
	return [lowerNumber , column] ;
}

//null the column elements 
function nullColumnElements(matriz, pivoRow, pivoColumn,rowsCount, columnsCount){

	for (let i = 0; i < rowsCount; i++) {

		// jumps pivo row and the already 0 values on the pivo column
		if(i==pivoRow || matriz[i][pivoColumn] == 0 ){
			continue;
		}
		//pivo aux receive  the next pivo column number
		pivoAux = matriz[i][pivoColumn];

		//loop to null pivo column
		for (let j = 0; j < columnsCount; j++) {
			//current matriz value = pivo row values multiplied for negative pivo aux plus actual matriz value
			matriz[i][j] = (matriz[pivoRow][j] * (pivoAux * -1)) + matriz[i][j] ;

		}
		
	}
	return matriz
}


//div each pivo row value / pivo value
function divPivoRow(matriz, columnsCount , pivoRow, pivoValue){
	for (var i = 0; i < columnsCount; i++) {
		matriz[pivoRow][i]  = matriz[pivoRow][i] / pivoValue;
	}

	return matriz;
}

function staticTableVars(quantDec,quantRes){
	base = [];
	head = [];

	//for each restriction adds a row into base
	for (let i = 0; i < quantRes ; i++) {
		base.push("f"+(i+1));
	}
	base.push("Z");


	head.push("Base");
	//for each restriction and decision var adds a row into head
	for (let i = 0; i < quantDec ; i++) {
		head.push("x"+(i+1));
	}
	for (let i = 0; i < quantRes ; i++) {
		head.push("f"+(i+1));
	}
	head.push("b");
	
	return [base, head];
}

function getRestrictionValues(quantDec,quantRes){
	var resValues = [];
	var xvalue = [];
	for (let i = 1; i <= quantRes; i++ ){
		xvalue = [];

		for (let j = 1; j <= quantDec; j++ ) {
			
			var input = $("input[name='X"+j+"_res"+i+"']").val();
			
			if(input.length == 0) {
				xvalue[j-1] = 0;
			} else {
				xvalue[j-1] = parseFloat(input);
			}


		}
		for (let j= 1; j <= quantRes; j++) {
			if(i==j){
				xvalue.push(1);
			}else{
				xvalue.push(0);
			}
		}
		
		var input_res = $("input[name='valRestriction"+i+"']").val();
		
		if(input_res.length == 0) {
			xvalue.push(0);	
		} else {
			xvalue.push(parseFloat(input_res));
		}
	
		resValues[i-1] = xvalue;
		
	}
	console.log(resValues);
	return resValues;
}

function getFunctionzValues(quantDec,quantRes){
	var funcValues = [];
	var xvalue = [];

	var maxOrMin = (($("#max").is(':checked')) ? -1 : 1);

	for (let i = 1; i <= quantDec; i++ ) {
		var input = $("input[name='valX"+i+"']").val()

		if( input.length == 0) {
			xvalue[i-1] = 0;			
		} else {
			xvalue[i-1] = parseFloat(input) * maxOrMin;
		}

	}
	funcValues = xvalue ;

	for (let i = 0; i <= quantRes; i++) {
		funcValues.push(0);
	}

	return funcValues;
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
		$("#inputValues").append('<div id="buttons" class="row"><div class="col-md-12 col-lg-12"><button id="solveSimplex" align="center" onclick="solveSimplex('+quantDec+','+quantRes+',1)" class="btn btn-primary">Solução</button></div></div>');

		$(".container").append('<div id="solution" class="row"></div>')
		$(".container").append('<br><div class="row"><div id="results" class="col-md"></div></div>');

		// $("#buttons").append('<div class="col-md-6"><button id="stepByStep" onclick="solveSimplex('+quantDec+','+quantRes+',2)" class="btn btn-primary">Passo a Passo</button></div>');

	});
}

//dev obs:`String text ${var}` = print var inside a string

// generate functionZ inputs
function generateFunctionZ(quantDec){


	$(".container").append('<div id="inputValues"></div>');
	$("#inputValues").append('<br><div class="row"><div class="input-group d-flex justify-content-center mb-3" id="funcZ"></div></div>');

	
	$("#funcZ").append('<span>Z =</span><span class="px-2">');
	// adds the function Z inputs to the body of the page 	
	for (let i = 1; i <= quantDec; i++) {

		$("#funcZ").append('<input type="number" name="valX'+i+'">');
		if(i != quantDec){
			$("#funcZ").append('<span class="m-1">x'+ i +'</span><span class="px-2"><span><div tabindex=-1 class="">+</div>');
		}else{
			$("#funcZ").append('<span class="m-1">x'+ i +'</span>');
		}
	}
	var input = $('input[name="valX1"]');

	var input = $('input[name="valX1"]');

	input.focus();
}


//generate restrictions inputs
function generateRestrictions(quantDec,quantRes){

	$("#inputValues").append('<div class="row"><div class="col-md-12 mb-3" id="divRestTitle"><h2>Restrições:</h2></div></div>');

	//adds the restrictions inputs to the body 
	for (let i = 1; i <= quantRes ; i++) {

			$("#inputValues").append('<div class="row"><div class="input-group d-flex justify-content-center mb-3" id=divRes'+i+'></div></div>');

			for (let j = 1; j <= quantDec; j++) {
				$("#divRes"+i+"").append('<input type="number" name="X'+j+'_res'+i+'" " >');
				if(j != quantDec){
					$("#divRes"+i).append('<span class="m-1">x'+ j +'</span><span class="px-2"><span><div tabindex=-1 class="">+</div>');
				}else{
					$("#divRes"+i).append('<span class="m-1">x'+ j +' </span>');
				}
			}
		//adds to the body the '<=' expression and the restriction value input
		$("#divRes"+i).append('<span class="px-2"></span><div class="input-group-prepend"><span class="mx-2"><b>&le;</b></span></div><input type="number" name="valRestriction'+i+'">');
	}

	
}

// division of b column and the lower number Column
// adds the var to the base column and returns the lower result row
function whoLeavesBase(matriz, columnLowerNumber, columnsCount, rowsCount, varsOnBase){
	var lowerResult = 99999999999999999999999;
	var lowerResultRow;

	//loop until the last not function Z row
	for(let i = 0; i < rowsCount-1 ; i++){
		//not allow div by 0
		if(!(matriz[i][columnLowerNumber] == 0)){
			currentValue = 0;
			currentValue = matriz[i][columnsCount-1] / matriz[i][columnLowerNumber]
			
			//make sure that x is positive and lowerResult has the lower value 
			if(currentValue > 0){
				if(currentValue < lowerResult){
					lowerResult    = currentValue;
					lowerResultRow = i;
				}
			}

		}
	}
	if(lowerResultRow == undefined){
		pauseSolution()
	}else{
		//adds decision var to the base 
		
		varsOnBase[lowerResultRow] = "x"+(columnLowerNumber+1)
		return [ lowerResultRow, varsOnBase];
	}
	
}