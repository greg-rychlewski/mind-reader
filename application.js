///////////////////////////////////////////////
//                                           //
//             Global Variables              //
//                                           //
///////////////////////////////////////////////

var maxWins = 100;
var rulesDiv = document.getElementById("rules");
var gameoverDiv = document.getElementById("gameover");
var winnerDiv = document.getElementById("winner");
var nextPredictionDiv = document.getElementById("next-predicted-value");
var togglePredictionDiv = document.getElementById("toggle-prediction");
var computer = {
	sphereDiv: document.getElementById("computer-sphere"),
	shadowDiv: document.getElementById("computer-shadow"),
	prediction: null,
	wins: 0,
};
var human = {
	sphereDiv: document.getElementById("human-sphere"),
	shadowDiv: document.getElementById("human-shadow"),
	wins: 0,
};
var toggleMessage = {
	show: "Hide AI's Next Prediction",
	hide: "Show AI's Next Prediction"
}

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
	computer.prediction = null;
	computer.wins = 0;
	human.wins = 0;
	hideWinnerMessage();
	resizeSphere(human, 100);
	resizeSphere(computer, 100);
	if (togglePredictionDiv.innerHTML == toggleMessage.show){
		togglePrediction()
	}
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

	rulesDiv.style.display = "none";
	gameoverDiv.style.display = "block";
}

function hideWinnerMessage(){
	gameoverDiv.style.display = "none";
	rulesDiv.style.display = "block";
}

function togglePrediction(){
	var showPrediction = (togglePredictionDiv.innerHTML == toggleMessage.show);

	if (showPrediction){
		togglePredictionDiv.innerHTML = toggleMessage.hide;
		nextPredictionDiv.style.opacity = 0;
	}else{
		togglePredictionDiv.innerHTML = toggleMessage.show;
		nextPredictionDiv.style.opacity = 1;
	}
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

function resizeSphere(player, newSize){
	player.sphereDiv.style.width = newSize + "px";
	player.sphereDiv.style.height = newSize + "px";
	player.shadowDiv.style.width = newSize + "%";
}

function updateScore(humanMove, predictedMove){
	if (humanMove == predictedMove){
		computer.wins++;
		resizeSphere(computer, 100 - computer.wins);
	}else{
		human.wins++;
		resizeSphere(human, 100 - human.wins);
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