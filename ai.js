///////////////////////////////////////////////
//                                           //
//                 AI Module                 //
//                                           //
///////////////////////////////////////////////

var ai = (function (){
	// Game variables
	var learnRate = 0.15;
	var moves = ["L", "R"];
	var points = {"L": -1, "R": 1};
	var gameTree = new Tree("", null);
	var history = "";

	// Tree class to store playing history
	function Tree(path, parent){
		this.path = path;
		this.parent = parent;
		this.children = [];
		this.weight = {};
		for (var i = 0; i < moves.length; i++){
			this.weight[moves[i]] = 1;
		}
		this.subtreeWeight = 1;
	}

	Tree.prototype.addChildren = function (){
		for (var i = 0; i < moves.length; i++){
			var newPath = this.path + moves[i];

			this.children.push(new Tree(newPath, this));
		}
	}

	Tree.prototype.search = function (path){
		if (path == this.path){
			return this;
		}else{
			if (this.children.length == 0){
				this.addChildren();
			}
			
			for (var i = 0; i < this.children.length; i++){
				var child = this.children[i];

				if (path.startsWith(child.path)){
					return child.search(path);
				}
			}
		}
	}

	Tree.prototype.meanWeight = function (){
		var sumWeight = 0;

		for (var i = 0; i < moves.length; i++){
			sumWeight += this.weight[moves[i]];
		}

		return sumWeight / moves.length;
	}

	Tree.prototype.meanPred = function (){
		var sumPred = 0;

		for (var i = 0; i < moves.length; i++){
			sumPred += this.weight[moves[i]] * points[moves[i]];
		}

		return sumPred / moves.length;
	}

	Tree.prototype.multChildSubtreeWeight = function (){
		var product = 1;

		for (var i = 0; i < this.children.length; i++){
			product *= this.children[i].subtreeWeight;
		}

		return product;
	}

	Tree.prototype.updateWeight = function (playerMove){
		for (var i = 0; i < moves.length; i++){
			this.weight[moves[i]] *= Math.exp(-learnRate * Math.abs(points[playerMove] - points[moves[i]]));
		}
	}

	Tree.prototype.updateSubtreeWeight = function (){
		if (this.children.length == 0){
			this.subtreeWeight = this.meanWeight();
		}else if (this.path != ""){
			this.subtreeWeight = this.meanWeight() + this.multChildSubtreeWeight();
		}else{
			this.subtreeWeight = this.multChildSubtreeWeight();
		}
	}

	// Helper functions
	function onPath(node){
		if (history.startsWith(node.path)){
			return false;
		}

		return true;
	}

	function getPrediction(){
		var prediction;
		var currentNode = gameTree.search(history);
		var subtreePred = currentNode.meanPred();

		if (currentNode.path == ""){
			subtreePred = 2 * Math.random() - 1;
		}

		while (currentNode.path != ""){
			currentNode = currentNode.parent;
			nonPathChild = currentNode.children.filter(onPath)[0];

			if (currentNode.path == ""){
				subtreePred *= nonPathChild.subtreeWeight;
			}else{
				subtreePred = subtreePred * nonPathChild.subtreeWeight + currentNode.meanPred();
			}
		}

		prediction = subtreePred / currentNode.subtreeWeight;

		if (prediction >= 0){
			return moves[1];
		}else{
			return moves[0];
		}

	}

	function updateWeights(playerMove){
		var currentNode = gameTree.search(history);

		while (currentNode){
			currentNode.updateWeight(playerMove);
			currentNode.updateSubtreeWeight();
			currentNode = currentNode.parent;
		}
	}

	function updateHistory(playerMove){
		history = playerMove + history;
	}

	function resetAI(){
		history = "";
		gameTree = new Tree("", null);
	}


	// Public API
	return {
		predict: getPrediction,
		reset: resetAI,
		update: function (playerMove){
			updateWeights(playerMove);
			updateHistory(playerMove);
		}
	}
	
})()