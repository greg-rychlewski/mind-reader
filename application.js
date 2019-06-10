///////////////////////////////////////////////
//                                           //
//             Global Variables              //
//                                           //
///////////////////////////////////////////////

var maxScore = 100;
var initialShadowAlpha = 0.1
var computer = {
	fillDiv: document.getElementById("computer-fill"),
	shadowDiv: document.getElementById("computer-shadow"),
	shadowAlpha: initialShadowAlpha,
	prediction: "",
	score: 0,
	resetScore: function(){
		this.score= 0;
		this.shadowAlpha = initialShadowAlpha;
	}
};
var human = {
	fillDiv: document.getElementById("human-fill"),
	shadowDiv: document.getElementById("human-shadow"),
	shadowAlpha: initialShadowAlpha,
	score: 0,
	resetScore: function(){
		this.score = 0;
		this.shadowAlpha = initialShadowAlpha;
	}
};

///////////////////////////////////////////////
//                                           //
//              Helper Functions             //
//                                           //
///////////////////////////////////////////////

function enableGame(){
	document.onkeyup = nextMove;
	document.getElementById("new-game").onclick = newGame;
	document.getElementById("computer").ontouchstart = function(){mobileMove("L")};
	document.getElementById("human").ontouchstart = function(){mobileMove("R")};
}

function disableGame(){
	document.onkeyup = null;
	document.getElementById("computer").ontouchstart = null;
	document.getElementById("human").ontouchstart = null;
}

function resetGame(){
	ai.reset();
	human.resetScore();
	computer.resetScore();
	hideWinnerMessage();
	fillSphere(human, human.score, human.shadowAlpha);
	fillSphere(computer, computer.score, computer.shadowAlpha);
	document.getElementById("human-score").innerHTML = human.score;
	document.getElementById("computer-score").innerHTML = computer.score;
}

function newGame(){
	resetGame();
	updatePrediction();
	enableGame();
}

function showWinnerMessage(){
	if (computer.score == maxScore){
		document.getElementById("winner").innerHTML = "AI Wins";
	}else if (human.score == maxScore){
		document.getElementById("winner").innerHTML = "You Win";
	}

	document.getElementById("gameover-container").style.display = "block";
	document.getElementById("prediction-container").style.display = "none";
}

function hideWinnerMessage(){
	document.getElementById("gameover-container").style.display = "none";
	document.getElementById("prediction-container").style.display = "block";
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
	document.getElementById("next-prediction").innerHTML = formatPrediction(computer.prediction);
}

///////////////////////////////////////////////
//                                           //
//                Player Move                //
//                                           //
///////////////////////////////////////////////

function gameOver(){
	return human.score == maxScore || computer.score == maxScore
}

function fillSphere(player, newSize, newAlpha){
	player.shadowDiv.style.opacity = newAlpha;
	player.fillDiv.style.height = newSize + "px";
}

function updateScore(humanMove, predictedMove){
	if (humanMove == predictedMove){
		computer.score++;
		computer.shadowAlpha += 0.015;
		fillSphere(computer, computer.score, computer.shadowAlpha);
		document.getElementById("computer-score").innerHTML = computer.score;
	}else{
		human.score++;
		human.shadowAlpha += 0.02;
		fillSphere(human, human.score, human.shadowAlpha);
		document.getElementById("human-score").innerHTML = human.score;
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
		showWinnerMessage();
	}else{
		updatePrediction();
		enableGame();
	}		
}

///////////////////////////////////////////////
//                                           //
//            Player Move (Mobile)           //
//                                           //
///////////////////////////////////////////////

function mobileMove(humanMove){
	var mobileWidth = 425;

	if (window.innerWidth > mobileWidth){
		return;
	}

	disableGame();
	updateScore(humanMove, computer.prediction);
	ai.update(humanMove);
	
	if (gameOver()){
		showWinnerMessage();
	}else{
		updatePrediction();
		enableGame();
	}	
}

///////////////////////////////////////////////
//                                           //
//                Start Game                 //
//                                           //
///////////////////////////////////////////////

updatePrediction();
enableGame();