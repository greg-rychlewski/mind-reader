///////////////////////////////////////////////
//                                           //
//             Global Variables              //
//                                           //
///////////////////////////////////////////////

var maxWins = 100;
var initialShadowAlpha = 0.1
var gameoverDiv = document.getElementById("gameover-container");
var winnerDiv = document.getElementById("winner");
var showPredictionButton = document.getElementById("prediction-container");
var nextPredictionDiv = document.getElementById("next-prediction");
var computer = {
	fillDiv: document.getElementById("computer-fill"),
	shadowDiv: document.getElementById("computer-shadow"),
	shadowAlpha: initialShadowAlpha,
	prediction: "",
	wins: 0,
	resetScore: function(){
		computer.wins = 0;
		computer.shadowAlpha = initialShadowAlpha;
	}
};
var human = {
	fillDiv: document.getElementById("human-fill"),
	shadowDiv: document.getElementById("human-shadow"),
	shadowAlpha: initialShadowAlpha,
	wins: 0,
	resetScore: function(){
		human.wins = 0;
		human.shadowAlpha = initialShadowAlpha;
	}
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
	human.resetScore();
	computer.resetScore();
	hideWinnerMessage();
	fillSphere(human, human.wins, human.shadowAlpha);
	fillSphere(computer, computer.wins, computer.shadowAlpha);
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

function fillSphere(player, newSize, newAlpha){
	player.shadowDiv.style.opacity = newAlpha;
	player.fillDiv.style.height = newSize + "px";
}

function updateScore(humanMove, predictedMove){
	if (humanMove == predictedMove){
		computer.wins++;
		computer.shadowAlpha += 0.015;
		fillSphere(computer, computer.wins, computer.shadowAlpha);
	}else{
		human.wins++;
		human.shadowAlpha += 0.02
		fillSphere(human, human.wins, human.shadowAlpha);
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