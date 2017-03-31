function setup() {
	createCanvas(windowWidth, windowHeight);
	shapeCircle = new ShapeCircle(width/2, height/2, 100);
}

function draw() {
	background(220);
	shapeCircle.draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function ShapeCircle(x, y, radius){
	this.xpos = x;
	this.ypos = y;
	this.r = radius;

	//Mise en place du tableau comprennant tout les points(x,y)
	this.pointValue = [];

	this.pointSafe = [];

	for(var a = 0; a < TWO_PI+.02; a+=.1){
		var x = cos(a);
		var y = sin(a);

		var v = createVector(x,y);
		var v2 = createVector(x,y);

		this.pointValue.push(v);
		this.pointSafe.push(v2);
	}

	this.draw = function(){
		
		push();
		translate(this.xpos, this.ypos);
		beginShape();
		fill(20);
		stroke(51);
		for (var i = 0; i < this.pointValue.length; i++) {
			var r = this.r + random(-10, 100)
			var x = r * this.pointValue[i].x;
			var y = r * this.pointValue[i].y;
			vertex(x, y);
		};
		endShape();
		pop();
	}	
}