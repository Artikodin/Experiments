////////////////////////////////////////////////////////////////////////////////////
//                  Partie Web Audio API										  //
////////////////////////////////////////////////////////////////////////////////////
var loadCorrect;
window.addEventListener("load", init());
function init(){
	console.log('initialiser');
	context = new (window.AudioContext || window.webkitAudioContext)();
	
	bufferLoader = new BufferLoader(
		context,
		[
			'sound/biscuit.mp3',	
		],
		loadComplete
		);
	bufferLoader.load();
	loadCorrect = false;
}

function loadComplete(bufferList){
	console.log('load finish');
	var i = 0;
	var bufferSource = context.createBufferSource();
	window.analyseur = context.createAnalyser();

	var tailleMemoireTampon = analyseur.frequencyBinCount;
	window.tableauDonnees = new Uint8Array(tailleMemoireTampon);
	

	bufferSource.buffer = bufferList[i];

	bufferSource.connect(analyseur);
	analyseur.connect(context.destination);

	bufferSource.loop = true;
	bufferSource.start();


	var loader = document.getElementById('loader');
	loader.className += " fadeOut";


	loadCorrect = true;


}

// prevButton.addEventListener('click', goPrev);
// function goPrev(){
// 	if(loadCorrect){
// 		analyseur.getByteTimeDomainData(tableauDonnees);
// 		console.log(tableauDonnees);
// 	}
// }
////////////////////////////////////////////////////////////////////////////////////
//                  Partie P5													  //
////////////////////////////////////////////////////////////////////////////////////

setup = function() {
	createCanvas(windowWidth, windowHeight);
	dotGenerator = new DotGenerator(10 , height/1.7+40);
	dotGenerator1 = new DotGenerator(50 , height/1.7+80);
	dotGenerator2 = new DotGenerator(5, height/1.7+120);
	dotGenerator3 = new DotGenerator(20 , height/1.7);
}

draw = function() {
	background(51);
	dotGenerator.drawC(5);
	dotGenerator.collide(false);
	dotGenerator.dance(0);

	dotGenerator1.drawC(15);
	dotGenerator1.collide(false);
	dotGenerator1.dance(800);

	dotGenerator2.drawC(3);
	dotGenerator2.collide(false);
	dotGenerator2.dance(500);

	dotGenerator3.drawC(1);
	dotGenerator3.collide(false);
	dotGenerator3.dance(200);
	// analyseur.getByteTimeDomainData(tableauDonnees);
	// console.log(tableauDonnees);
}

windowResized = function() {
	resizeCanvas(windowWidth, windowHeight);
}

DotGenerator = function(spaceX, Y){
	this.spaceX = spaceX;
	this.Y = Y;

	this.dotValue = [];
	this.dotInit = [];

	//Mise en place des directions
	this.directionX = 1;
	this.directionY = 1;

	//Mise en place de l'acceleration
	this.acceleretionX = 0;
	this.acceleretionY = 0;


	for (x = 0; x < width; x+=this.spaceX){
		var v = createVector(x,this.Y);
		var v2 = createVector(x,this.Y);
		this.dotValue.push(v);
		this.dotInit.push(v2);
	}

	this.drawC = function(a){
		noFill();
		stroke(255);
		strokeWeight(a);
		beginShape(POINTS);
		for(i = 0; i < this.dotValue.length; i++){
			vertex(this.dotValue[i].x, this.dotValue[i].y);
		}
		endShape();
	}

	//Methode qui initialise les collision
	this.collide = function(collision){
		if (collision == true && collision !== undefined && collision !== false){
			for (var i = 0; i < this.dotValue.length; i++) {
				var d = dist(mouseX, mouseY, this.dotValue[i].x, this.dotValue[i].y);
				
				if (d < 50){
					if (mouseX < this.dotValue[i].x) {
						this.directionX = 1;
					}else if (mouseX > this.dotValue[i].x) {
						this.directionX = -1;
					}

					if (mouseY < this.dotValue[i].y) {
						this.directionY = 1;
					}
					else if (mouseY > this.dotValue[i].y) {
						this.directionY = -1;
					}
					this.acceleretionX = d/25 * this.directionX;
					this.dotValue[i].x += this.directionX;

					this.acceleretionY = d/25 * this.directionY;
					this.dotValue[i].y += this.acceleretionY ;
				}else{
					if (this.dotValue[i].y !== this.dotInit[i].y){
						this.dotValue[i].y += (this.dotInit[i].y - this.dotValue[i].y) * 0.2;
					}
					if (this.dotValue[i].x !== this.dotInit[i].x){
						this.dotValue[i].x += (this.dotInit[i].x - this.dotValue[i].x) * 0.2;
					}
				}
			};
		}
	}

	this.dance = function(a){
		if(loadCorrect){
			for (var i = 0; i < this.dotValue.length; i++) {
				analyseur.getByteTimeDomainData(tableauDonnees);
				this.dotValue[i].y = this.dotInit[i].y - tableauDonnees[i+a];
			}
		}
	}
}

