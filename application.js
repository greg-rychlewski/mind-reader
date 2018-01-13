///////////////////////////////////////////////
//                                           //
//             Global Variables              //
//                                           //
///////////////////////////////////////////////

var maxWins = 100;
var gameoverDiv = document.getElementById("gameover-container");
var winnerDiv = document.getElementById("winner");
var showPredictionButton = document.getElementById("prediction-container");
var nextPredictionDiv = document.getElementById("next-prediction");
var computer = {
	fillDiv: document.getElementById("computer-fill"),
	shadowDiv: document.getElementById("computer-shadow"),
	prediction: "",
	wins: 0,
};
var human = {
	fillDiv: document.getElementById("human-fill"),
	shadowDiv: document.getElementById("human-shadow"),
	wins: 0,
};

///////////////////////////////////////////////
//                                           //
//              Helper Functions             //
//                                           //
///////////////////////////////////////////////

function enableGame(){
	updatePrediction();
	document.onkeyup = nextMove;
}

function disableGame(){
	document.onkeyup = null;
}

function resetGame(){
	ai.reset();
	computer.wins = 0;
	human.wins = 0;
	hideWinnerMessage();
	fillSphere(human, 0);
	fillSphere(computer, 0);
}

function newGame(){
	resetGame();
	enableGame();
}

function showWinnerMessage(){
	if (computer.wins == maxWins){
		winnerDiv.innerHTML = "AI Wins";
	}else if (human.wins == maxWins){
		winnerDiv.innerHTML = "You Win";
	}

	gameoverDiv.style.display = "block";
	showPredictionButton.style.display = "none";
}

function hideWinnerMessage(){
	gameoverDiv.style.display = "none";
	showPredictionButton.style.display = "block";
}

function formatPrediction(value){
	if (value == "L"){
		return "Left";
	}else if (value == "R"){
		return "Right";
	}else{
		return "";
	}
}

function updatePrediction(){
	if (gameOver()){
		nextPredictionDiv.innerHTML = "";
	}else{
		computer.prediction = ai.predict();
		nextPredictionDiv.innerHTML = formatPrediction(computer.prediction);
	}
}

///////////////////////////////////////////////
//                                           //
//                Player Move                //
//                                           //
///////////////////////////////////////////////

function gameOver(){
	return human.wins == maxWins || computer.wins == maxWins
}

function fillSphere(player, newSize){
	player.fillDiv.style.height = newSize + "px";
}

function updateScore(humanMove, predictedMove){
	if (humanMove == predictedMove){
		computer.wins++;
		fillSphere(computer, computer.wins);
	}else{
		human.wins++;
		fillSphere(human, human.wins);
	}
}

function processMove(key){
	if (key == "37"){
		return "L";	
	}else if (key == "39"){
		return "R";
	}else{
		return false;
	}
}

function nextMove(e){
	disableGame();

	var humanMove = processMove(e.keyCode);
	
	if (humanMove){
		updateScore(humanMove, computer.prediction);
		ai.update(humanMove);
	}
	
	if (gameOver()){
		updatePrediction();
		showWinnerMessage();
	}else{
		enableGame();
	}		
}

///////////////////////////////////////////////
//                                           //
//            Enable Game Controls           //
//                                           //
///////////////////////////////////////////////

enableGame();