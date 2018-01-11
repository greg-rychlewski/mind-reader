///////////////////////////////////////////////
//                                           //
//             Global Variables              //
//                                           //
///////////////////////////////////////////////

var computer = {
	scoreDiv: document.getElementById("computer-score"),
	coverDiv: document.getElementById("computer-cover"),
	shadowDiv: document.getElementById("computer-shadow"),
	prediction: null,
	wins: 0,
};
var human = {
	coverDiv: document.getElementById("human-cover"),
	shadowDiv: document.getElementById("human-shadow"),
	wins: 0,
};
var gameoverGroupDiv = document.getElementById("gameover-group");
var winnerMessageDiv = document.getElementById("winner-message");
var togglePredictionButton = document.getElementById("toggle-prediction");
var nextPredictionDiv = document.getElementById("next-predicted-value");
var showPrediction = false;
var maxWins = 100;

///////////////////////////////////////////////
//                                           //
//              Helper Functions             //
//                                           //
///////////////////////////////////////////////

function enableGame(){
	updatePrediction();
	document.onkeydown = nextMove;
}

function disableGame(){
	document.onkeydown = null;
}

function showWinnerMessage(){
	if (computer.wins == maxWins){
		updateWinnerMessage("AI Wins");
	}else if (human.wins == maxWins){
		updateWinnerMessage("You Win");
	}

	gameoverGroupDiv.style.display = "block";
}

function hideWinnerMessage(){
	gameoverGroupDiv.style.display = "none";
}

function updateWinnerMessage(msg){
	winnerMessageDiv.innerHTML = msg;
}

function resetGame(){
	hideWinnerMessage();
	ai.reset();
	computer.coverDiv.style.height = "100%";
	computer.shadowDiv.style.width = "0%";
	human.coverDiv.style.height = "100%";
	human.shadowDiv.style.width = "0%";
	computer.prediction = null;
	computer.wins = 0;
	human.wins = 0;
	if (showPrediction){
		togglePrediction()
	}
}

function newGame(){
	resetGame();
	enableGame();
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
	computer.prediction = ai.predict();
	nextPredictionDiv.innerHTML = formatPrediction(computer.prediction);
}

function togglePrediction(){
	if (showPrediction){
		togglePredictionButton.innerHTML = "Show AI's Next Prediction";
		nextPredictionDiv.style.opacity = 0;
	}else{
		togglePredictionButton.innerHTML = "Hide AI's Next Prediction";
		nextPredictionDiv.style.opacity = 1;
	}

	showPrediction = !showPrediction;
}

function increaseScore(player){
	player.wins++;
	player.coverDiv.style.height = (100 - player.wins) + "%";
	player.shadowDiv.style.width = Math.min(2 * player.wins, 100) + "%";
}

function updateScore(humanMove, predictedMove){
	if (humanMove == predictedMove){
		increaseScore(computer);
	}else{
		increaseScore(human);
	}
}

function processMove(key){
	if (key == "37"){
		return "L";	
	}else if (key == "39"){
		return "R";
	}else{
		return;
	}
}

function gameOver(){
	return human.wins == maxWins || computer.wins == maxWins
}

///////////////////////////////////////////////
//                                           //
//                Player Move                //
//                                           //
///////////////////////////////////////////////

function nextMove(e){
	var humanMove;

	disableGame();
	humanMove = processMove(e.keyCode);
	updateScore(humanMove, computer.prediction);
	ai.update(humanMove);

	if (gameOver()){
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