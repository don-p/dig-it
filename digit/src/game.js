var main;

Game = {
  // Initialize and start our game.  Called by window.onLoad event.
  start: function() {
    // Start crafty framework and set a stage background color.
    Crafty.init(1020, 520);
    Crafty.background('green');
    
    // Add audio sound assets.
    Crafty.audio.add({
    	  place: ["sounds/Game-Spawn.mp3",
    	          "sounds/Game-Spawn.ogg"]
    	});

    Crafty.audio.add({
  	  correct: ["sounds/ToneWobble.mp3",
  	          "sounds/ToneWobble.ogg"]
  	});

    Crafty.audio.add({
  	  incorrect: [ "sounds/GU-StealDaisy.mp3",
  	          "sounds/GU-StealDaisy.ogg"]
  	});

    
    // Start the "Home" scene to get things going
    Crafty.scene('Home');


  }
};

// Starting state, where user can start a game using the "Play" button.
Crafty.scene('Home', function() {

    Crafty.background('lightblue');
	 Crafty.e('HTML')
	    .attr({id: 'welcomeElement',  x: 20, y: 20, w: Crafty.viewport.width})
		.replace("<p style='font-family: sans-serif;font-size:48px;font-weight:bold;margin-bottom:12px;border-bottom:2px solid;width:" + (Crafty.viewport.width - 2*20) +";'>Welcome To <span style='font-style:italic ;'>Number Matcher</span></p>");

    Crafty.e('2D, DOM, Text, Mouse')
    .attr({w: 80, h: 40, x: 40, x: Crafty.viewport.width - 120, y: Crafty.viewport.height - 100 })
    .text('Play')
    .textFont({ size: '36px', weight: 'bold' })
    .css({'cursor':'pointer', 'text-align': 'center', 'border':'1px solid #000', 'padding':'3px', 'position':'relative'})
    .bind('Click', function(MouseEvent){
	    Crafty.scene('Game');
	});
});

// Game state, where user can play the equation game.
Crafty.scene('Game', function() {
	var answer = null;
	var num1 = null;
	var num2 = null;
	
	var userAnswer;
    Crafty.background('orange');
    var gameDiv = Crafty.e('2D, DOM').attr({id: 'gameDiv', w: Crafty.viewport.width, h: Crafty.viewport.height});
    gameDiv.id = 'gameDiv';


    var boxSize = 85;
    
    Game.equationResults = [];
    this.numEquations = 2; // Show a series of equations.
    
    /*
	 * Initialize a new equation for display in the game.
	 */
	this.loadEquation = function() {
		num1 = this.getRandomIntInRange(10, 99999);
		num2 = this.getRandomIntInRange(10, 99999);
		answer = num1 + num2;
		delete userAnswer;
		userAnswer = [];
		this.digits = this.numDigits(answer);
		var digitBox = null;
		for(var i = 0; i < this.digits; i++) {
			digitBox = Crafty.e('digitBox').attr({w: boxSize, h: boxSize, x: (i*boxSize + i*10)});
			userAnswer.push(digitBox);
		}
		
		this.equationElementNum1.text(num1 + " + " + num2);
		
	};
	
	this.getRandomIntInRange = function (min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	this.bind('digitSet', function() {
		var allDigitsSet = false;
		var digits = this.digits;
		
		// Check if all digits are set.
		for(var digit = 0; digit < digits; digit ++) {
			if(!!userAnswer[digit] && typeof userAnswer[digit].text() === 'number') {
				allDigitsSet = true;
			} else {
				allDigitsSet = false;
				break;
			}
		}
		
		if(allDigitsSet) {
			var correct = this.checkAnswer(answer, userAnswer),
				scope = this;
			setTimeout(function(){ 
				scope.showResult(correct);; 
			}, 750);
			setTimeout(function(){ 
				if(Game.equationResults.length < scope.numEquations) {
					// Load a new equation.
					for(var i = 0; i < scope.digits; i++) {
						digitBox = userAnswer[i];
						digitBox.destroy();
					}
					scope.resultElement.visible = false;
					
					scope.loadEquation();
				} else {
					Crafty.scene('Results');
				}
			}, 2000);
			
			
		}
	});
	
	// Equation display.
	this.equationElementNum1 = Crafty.e('2D, DOM, Text')
		.attr({id: 'equation', w: Crafty.viewport.width, h: 40, y:100})
	    .textFont({ size: '48px', weight: 'bold' })
	    .css({'margin-left':'auto', 'margin-right':'auto', 'text-align':'center'});

	// Result display.
	this.resultElement = Crafty.e('2D, DOM, Text')
		.attr({id: 'result', w: Crafty.viewport.width, h: 40, y:40})
	    .textFont({ size: '48px', weight: 'bold' })
	    .css({'margin-left':'auto', 'margin-right':'auto'});
	this.resultElement.visible = false;

	/*
	 * Return the number of digits in a base-10 integer number.
	 */
	this.numDigits = function (x) {
		  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
	};
	
	this.checkAnswer = function(answer, userAnswerArray) {
		var userAnswerValue = 0;
		for(var digit = 0; digit < this.digits; digit ++) {
			userAnswerValue = userAnswerValue*10 + userAnswerArray[digit].text();
		}
		
		return userAnswerValue === answer;
	};
	
	this.showResult = function(correct) {
		var text = correct?'Correct!':'Incorrect';
		Game.equationResults[Game.equationResults.length] = text;

		var color = correct?'#22aa22':'#aa2222'
		this.resultElement.text(text);
		this.resultElement.textColor(color);
		this.resultElement.visible = true;
		Crafty.audio.play(correct?"correct":"incorrect");
	}
	
	this.loadEquation();
	
    // Set up row of number buttons.
	var numberButton = null;
	for(var j = 0; j <= 9; j++) {
	    numberButton = Crafty.e('digitItem').attr({w: boxSize, h: boxSize, x: (j*boxSize + j*10)});
	    numberButton.text(j);
	}


	}
);	


// "Game over" state, where user can see the results/score of their game.
Crafty.scene('Results', function() {
	 var resultsElement = Crafty.e('HTML')
	    .attr({id: 'resultsElement',  x: 0, y: 20, w: Crafty.viewport.width})
		.append("<p style='font-family: sans-serif;font-size:48px;font-weight:bold;margin-bottom:12px;border-bottom:2px solid;width:" + (Crafty.viewport.width - 2*20) +";'>Your Scores</p>");

	  var result = '', resultElement;
	  for(var i = 0; i < Game.equationResults.length; i++) {
		  result = Game.equationResults[i];
		  resultElement = resultsElement.addComponent('HTML');
		  resultElement.append("<p style='font-family: sans-serif;font-size:48px;width:200px;height:55px;margin-top:12px;position:relative !important'>" + result + "</p>");
	  }
			  
	    Crafty.e('2D, DOM, Text, Mouse')
	    .attr({w: 200, h: 40, x: 40, y: Crafty.viewport.height - 100 })
	    .text('Home')
	    .textFont({ size: '36px', weight: 'bold' })
	    .css({'cursor':'pointer', 'text-align': 'center', 'border':'1px solid #000', 'padding':'3px'})
	    .bind('Click', function(MouseEvent){
		    Crafty.scene('Home');
		});
			  
	    Crafty.e('2D, DOM, Text, Mouse')
	    .attr({w: 200, h: 40, x: Crafty.viewport.width - 240, y: Crafty.viewport.height - 100 })
	    .text('Play Again')
	    .textFont({ size: '36px', weight: 'bold' })
	    .css({'cursor':'pointer', 'text-align': 'center', 'border':'1px solid #000', 'padding':'3px'})
	    .bind('Click', function(MouseEvent){
		    Crafty.scene('Game');
		});
			  
	});