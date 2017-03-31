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
			'sound/biscuit.mp3',	
			// 'sound/migos.mp3',	
			// 'sound/starbound.mp3',	
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
	createCanvas(windowWidth, windowHeight);

	shapeCircle3 = new ShapeCircle(width/2, height/2, 60, -PI*.15, PI*1.15, .01);
	shapeCircle2 = new ShapeCircle(width/2, height/2, 150, -PI*.3, PI*1.3, -.008);
	shapeCircle = new ShapeCircle(width/2, height/2, 200, 0, TWO_PI);

	randomDotGenerator = new RandomDotGenerator(height/2.8);

	yellow = color(255, 204, 0);
	b1 = color(238, 205, 163);
  	b2 = color(239, 98, 159);

  	pxDens = 1;
	pixelDensity(pxDens);
}

function draw() {
	background(255);
	setGradient(0, 0, width, height, b1, b2, Y_AXIS);
	// randomDotGenerator.drawC(3, 0);
	shapeCircle3.draw(310, 'rgba(0,255,0,0)', 400, true, .8);
	shapeCircle2.draw(200, 'rgba(0,255,0,0)', 100, true, .8);
	shapeCircle.draw(80, 'rgba(255,255,255,.8)', 0, true, .6);

	// pxDens -= .0001;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function ShapeCircle(x, y, pres, minAng, maxAng, rotation){
	this.xpos = x;
	this.ypos = y;
	this.pres = pres;
	this.minAng = minAng;
	this.maxAng = maxAng;
	this.rotation = rotation;
	this.rotInit = 0;

	this.inc = 0.1;
	this.decrease = true;
	noiseDetail(2,.4);

	this.yoff = 10;

	//Mise en place du tableau comprennant tout les points(x,y)
	this.pointValue = [];

	this.pointSafe = [];

	for(var a = 0; a < this.pres; a+=1){
		var b = map(a, 0 , this.pres,  this.minAng, this.maxAng);

		var x = cos(b);
		var y = sin(b);

		var v = createVector(x,y);
		var v2 = createVector(x,y);

		this.pointValue.push(v);
		this.pointSafe.push(v2);
	}

	this.draw = function(size, color, freq, str, dec){
		if(loadCorrect){
			push();
			translate(this.xpos, this.ypos);
			rotate(this.rotInit)
			beginShape();
			fill(color);
			if (str === true){
				stroke(255, 80);
			}else{
				noStroke();
			}
			strokeCap(ROUND);
			strokeJoin(ROUND);
			strokeWeight(3);
			this.xoff = 10;
			for (var i = 0; i < this.pointValue.length; i++) {
				analyseur.getByteFrequencyData(arrayFreq); 
				var r = map(arrayFreq[i+freq], 0, 200, size*dec, size);
				// var r = this.r + random(-10, 100);
				// var r = this.r + map(noise(this.xoff, this.yoff), 0,  1, -20, 200);
				var x = r * this.pointValue[i].x;
				var y = r * this.pointValue[i].y;
				vertex(x, y);
				this.xoff+=this.inc;
			};
			this.yoff+=this.inc*0.1;
			endShape();
			pop();
			this.rotInit+=this.rotation;
		}
	}	
}


function RandomDotGenerator(y){
	this.Y = y;
	this.point1 = [];
	this.pointInit1 = [];

	for (x = 0; x < width; x++){
		var v = createVector(x,this.Y);
		var v2 = createVector(x,this.Y);
		this.point1.push(v);
		this.pointInit1.push(v2);
	}

	this.drawC = function(a, b){
		if(loadCorrect){
			noFill();
			stroke(255, 80);
			strokeWeight(a);
			beginShape(POINTS);
			for(i = 0; i < this.point1.length; i++){
				analyseur.getByteTimeDomainData(arrayDomaine);
				this.point1[i].y = this.pointInit1[i].y - map(arrayDomaine[i+b], 100, 200, -200, 200);
				vertex(this.point1[i].x, this.point1[i].y);
			}
			endShape();
		}
	}
}


var Y_AXIS;
// Fonction piqué sur p5js.org
function setGradient(x, y, w, h, c1, c2, axis) {

  noFill();

  if (axis == Y_AXIS) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == X_AXIS) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}