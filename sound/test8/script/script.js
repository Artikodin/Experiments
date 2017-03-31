////////////////////////////////////////////////////////////////////////////////////
//                  Partie Web Audio API										  //
////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init());
var loadCorrect;
function init(){
	console.log('initialiser');
	context = new (window.AudioContext || window.webkitAudioContext)();
	
	bufferLoader = new BufferLoader(
		context,
		[
			// 'sound/biscuit.mp3',	
			// 'sound/migos.mp3',	
			'sound/starbound.mp3',	
			// 'sound/Vald - Ma meilleure amie.mp3',	
		],
		loadComplete
		);
	bufferLoader.load();
	loadCorrect = false;
}

function loadComplete(bufferList){
	console.log('load finish');
	// On initialise le buffer
	var bufferSource = context.createBufferSource();
	// On selectionne la musique à joué en fonction de celle presente dans la liste
	var i = 0;
	bufferSource.buffer = bufferList[i];

	// On initialise l'analyser
	analyseur = context.createAnalyser();

	// On connect le buffer à l'analyser et l'analyser au context de destination(enceintes)
	bufferSource.connect(analyseur);
	analyseur.connect(context.destination);

	// Boucle le son et le met en play
	bufferSource.loop = true;
	bufferSource.start();

	// On initialise la taille du tableau
	arrayFreq = new Uint8Array(analyseur.fftSize);

	arrayDomaine = new Uint8Array(analyseur.fftSize);
	// On remplit le tableau avec les frequences du son

	var loader = document.getElementById('loader');
	loader.className += " fadeOut";

	// Variable qui indique que le chargement est effectué
	loadCorrect = true;


}

var prevButton = document.getElementById('prevButton');
// prevButton.addEventListener('click', goPrev);
function goPrev(){
	if(loadCorrect){
		analyseur.getByteFrequencyData(arrayFreq); 
    	// console.log(arrayFreq);
    	analyseur.getByteTimeDomainData(arrayDomaine); 
    	console.log(arrayDomaine);
    	
	}
}


////////////////////////////////////////////////////////////////////////////////////
//                  Partie P5													  //
////////////////////////////////////////////////////////////////////////////////////
 
function setup() {
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight);
	shapeCircle = new ShapeCircle(2, 500, 150);
	randomDotGenerator = new RandomDotGenerator(100);

}

function draw() {
	background(23);
	shapeCircle.draw();
	randomDotGenerator.drawC(5, 500);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function ShapeCircle(x, y, radius){
	this.xpos = x;
	this.ypos = y;
	this.max = 100;

	this.r = radius;
	this.inc = 0.1;
	this.decrease = true;
	noiseDetail(2,.4);

	this.yoff = 10;

	//Mise en place du tableau comprennant tout les points(x,y)
	this.pointValue = [];

	this.pointSafe = [];

	for(var a = 0; a < this.max; a+=.2){
		var b = map(a, 0 , this.max, PI/3/4, TWO_PI/4)
		var x = cos(b);
		var y = sin(b);

		var v = createVector(x,y);
		var v2 = createVector(x,y);

		this.pointValue.push(v);
		this.pointSafe.push(v2);
	}

	this.draw = function(){
		if(loadCorrect){
			push();
			translate(map(noise(this.xpos), 0, 1, width/2-100, width/2+100), map(noise(this.ypos), 0, 1, height/2-50, height/2+50));
			beginShape();
			fill(255, 80);
			stroke(0, 0);
			this.xoff = 10;
			for (var i = 0; i < this.pointValue.length; i++) {
				analyseur.getByteFrequencyData(arrayFreq); 
				var r = map(arrayFreq[i], 0, 200, 0, 2000);
				// var r = this.r + random(-10, 100);
				// var r = this.r + map(noise(this.xoff, this.yoff), 0,  1, -20, 200);
				var x = r * this.pointValue[i].x;
				var y = r * this.pointValue[i].y;
				vertex(x, y);
				this.xoff+=this.inc;
			};
			this.yoff+=this.inc*0.1;
			endShape(CLOSE);
			pop();
			this.xpos+= .002;
			this.ypos+= .002;
		}
	}	
}

function RandomDotGenerator(nbrPoint){
	this.nbrPoint = nbrPoint;

	this.dotValue = [];
	this.dotInit = [];

	for (i = 0; i < this.nbrPoint; i++){
		var v = createVector(random(0, width),random(0, height));
		var v2 = createVector(random(0, width),random(0, height));
		this.dotValue.push(v);
		this.dotInit.push(v2);
	}

	this.drawC = function(a, b){
		if(loadCorrect){
			noFill();
			stroke(255);
			strokeWeight(a);
			beginShape(POINTS);
			for(i = 0; i < this.dotValue.length; i++){
				analyseur.getByteTimeDomainData(arrayDomaine);
				this.dotValue[i].y = this.dotInit[i].y - map(arrayDomaine[i+b], 100, 200, -50, 50);
				this.dotValue[i].x = this.dotInit[i].x - map(arrayDomaine[i], 100, 200, -50, 50);
				vertex(this.dotValue[i].x, this.dotValue[i].y);
			}
			endShape();
		}
	}
}