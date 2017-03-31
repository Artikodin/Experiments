var square = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	for(i=0;i<25;i++){
		square[i] = new Square(random(width), random(height));
	}
}

function draw() {
	background(220);
	for(var i=square.length-1;i>=0;i--){
		for(var j=square.length-1;j>=0;j--){
			if(square[i].alphaSquare>120 && square[j].alphaSquare>120 && i!==j){
				square[i].collide(square[j]);
			}
		}
		if(square[i].xArrive>width || square[i].yArrive>height || square[i].xArrive<0 || square[i].yArrive<0){
			square.splice(i,1);
			square.push(new Square(random(width), random(height)));
		}
		square[i].draw();
		square[i].move();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function Square(x,y,square){
	this.size = random(3,7);
	this.xArrive = x;
	this.yArrive = y;

	this.colour = map(this.size, 3, 7, 150, 0);

	this.xVitesse = random(-.2,.2);
	this.yVitesse = random(-.2,.2);
	
	this.alphaSquare = 0;

	this.draw = function(){
			push();
			stroke(this.colour, this.alphaSquare);
			fill(this.colour, this.alphaSquare);
			rect(this.xArrive, this.yArrive, this.size, this.size);
			pop();
			this.xCenter = this.xArrive + this.size / 2;
			this.yCenter = this.yArrive + this.size / 2;
			if(this.alphaSquare<255){
				this.alphaSquare++;
			}
	}

	this.move = function(){
			this.xArrive += this.xVitesse;
			this.yArrive += this.yVitesse;
	}

	this.collide = function(other){
		var d = dist(this.xArrive, this.yArrive, other.xArrive, other.yArrive)
		if(d<200){
			var alpha = map(d, 0, 200, 50, 0);
			push();
			stroke(0, alpha);
			strokeWeight(1);
			line(this.xCenter, this.yCenter, other.xCenter, other.yCenter);
			pop();
		}
	}
}

function drawLine(x1,y1,x2,y2){
	push();
	stroke(0, 50);
	strokeWeight(1);
	line(x1,y1,x2,y2);
	pop();
}