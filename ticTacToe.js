var GameState = function(previousState){
	this.turn = '';
	this.board = [];
	this.result = 'running';
	if(previousState !== 'undefined'){
		for(var i = 0; i < 9; i++){
			this.board[i] = previousState.board[i];
		}
		this.turn = previousState.turn;
		this.result = previousState.result;
	}

	this.changeTurn = function(){
		if(previousState.turn === 'X') this.turn = 'O';
		else this.turn = 'X';
	}

	this.availableMoves = function(){
		var emptyCells = [];
		for(var i = 0; i < 9; i++){
			if(this.board[i] === 'E')
				emptyCells.push(i);
		}
		return emptyCells;
	}

	this.printGrid = function() {
		var str = '\n';
		for(var i = 0;i < 9;i++){
			str = str + '\t' + this.board[i] + '\t' + '|';
			if((i+1)%3 == 0) str = str +'\n' + '\t-----------------------------------------' + '\n';
		}
		console.log(str);
	}

	this.isTerminal = function() {
        var B = this.board;

        for(var i = 0; i <= 6; i = i + 3) {
            if(B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
                this.result = B[i] + "-won";
                return true;
            }
        }

        for(var i = 0; i <= 2 ; i++) {
            if(B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
                this.result = B[i] + "-won";
                return true;
            }
        }

        for(var i = 0, j = 4; i <= 2 ; i = i + 2, j = j - 2) {
            if(B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2*j]) {
                this.result = B[i] + "-won"; 
                return true;
            }
        }

        var available = this.availableMoves();
        if(available.length == 0) {
            this.result = "draw";
            return true;
        }
        else {
            return false;
        }
    };
}

var AI = function(currentState){
	this.AImove = 0;
	this.makeAIMove = function(){
		var possibleMoves = currentState.availableMoves();
		var preferredMoves = [4,2,8,6,0,1,3,5,7];
		console.log(possibleMoves);
		for(var i = 0; i < 9; i++){
			for(var j = 0; j < 9; j++){
				if(preferredMoves[i] === possibleMoves[j]) {
					this.AImove = preferredMoves[i];
					return;	
				}
			}
		}
		//this.AImove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
	}
	
}



var Game = function(){
	
	this.play = function(){
		console.log('Welcome to Tic-Tac-Toe!!\nYou are using symbol X\nE symbols denote empty spaces in the grid\nPlease Enter any number from 1-9 to put in the X symbol\n1,2,3 forms 1st row;4,5,6 forms second row and 7,8,9 forms 3rd row');
		var currentState = new GameState({
				board : ['E','E','E','E','E','E','E','E','E'],
				turn : 'X',
				result : 'running'
		});
		currentState.printGrid();
	  	this.getUserInput(currentState, this.makeMove);
	}

	this.makeMove = function(input, currentState){
		currentState.board[input] = 'X';
		currentState.changeTurn();
		if(currentState.isTerminal()) printResults(currentState);
		currentState.printGrid();
		var ai = new AI(currentState);
		ai.makeAIMove();
		currentState.board[ai.AImove] = 'O';
		currentState.changeTurn();
		console.log('\t----------AI plays at location '+ (ai.AImove+1) + '----------');
		if(currentState.isTerminal()) printResults(currentState);
		currentState.printGrid();
	}

	this.getUserInput = function(currentState, callback){
		var input;
		console.log('Enter your choice[0-9]: ');
		var stdin = process.openStdin();
		stdin.addListener("data", function(d) {
	        input = parseInt(d.toString().trim());
	        if(input > 0 && input < 10){
	        	var availMoves = currentState.availableMoves();
	        	if(availMoves.includes((input-1))){
	        		callback(input-1, currentState);
	        	}else{
	        		console.log('Cell ' + input + ' is already taken! Please pick an empty cell marked by E symbol');
	        	}	
	        }else{
	        	console.log('Invalid input!! Please enter value between 1 and 9')
	        }
	    	
	  	});
	  	
	}

	function printResults(currentState){
		currentState.printGrid();
		console.log(currentState.result);
		process.exit();
	}
}

var game = new Game();
game.play();
