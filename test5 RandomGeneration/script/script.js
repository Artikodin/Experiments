function setup() {
	createCanvas(windowWidth, windowHeight);
	random = new Randomizator();
	noisy = new Noisy(20);
	noiseColor = new NoiseColor(30);
	drawBeatiful = new DrawBeautiful();
}

function draw() {

	background(220);

	noisy.update(0.01);
	noiseColor.update(0.01);

	
	

	drawBeatiful.update(noisy.noisex, noisy.noiseY);
	drawBeatiful.drawQueu(4, noiseColor.r, noiseColor.v, noiseColor.b);
	// noLoop();

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function Randomizator(){
	this.table = [1,2,3,4];
	this.rand = this.table[Math.floor(Math.random() * this.table.length)];
}

function Noisy(xoff){
	var xoff = xoff == 0 ? 1 : xoff;
	this.xoff = xoff;
	this.xoff1 = xoff * 100;

	this.update = function(inc){
		this.noisex = map(noise(this.xoff), 0, 1, 0, width);
		this.noiseY = map(noise(this.xoff1), 0, 1, 0, height);
		this.xoff += inc;
		this.xoff1 += inc;
	}
}

function NoiseColor(xoff){
	var xoff = xoff == 0 ? 1 : xoff;
	this.xoff1 = xoff;
	this.xoff2 = xoff*100;
	this.xoff3 = xoff*10000;


	this.update = function(increase){
		this.r = map(noise(this.xoff1), 0, 1, 0, 255);
		this.v = map(noise(this.xoff2), 0, 1, 0, 255);
		this.b = map(noise(this.xoff3), 0, 1, 0, 255);
		this.xoff1 += increase;
		this.xoff2 += increase;
		this.xoff3 += increase;
	}
}

function DrawBeautiful(){
	this.history = [];

	this.update = function(speedX, speedY){
		this.speedX = speedX;
		this.speedY = speedY;

		var v = createVector(this.speedX, this.speedY);
		this.history.push(v);

		if(this.history.length > 20){
			this.history.splice(0, 1);
		}
	}

	this.drawQueu = function(weight, r, v, b){
		var weight = (typeof weight !== 'undefined') ? weight : 4;
		var r = (typeof r !== 'undefined') ? r : 255;
		var v = (typeof v !== 'undefined') ? v : 255;
		var b = (typeof b !== 'undefined') ? b : 255;
		strokeWeight(weight);
		stroke(r, v, b);
		noFill();
		beginShape();
		for(i = 0; i < this.history.length; i++){
			vertex(this.history[i].x, this.history[i].y);
		}
		endShape();
	}
}