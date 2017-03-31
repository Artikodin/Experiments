function setup() {
	createCanvas(windowWidth, windowHeight);
	bezierFlow = new BezierFlow();
}

function draw() {
	background(220, 8);
	bezierFlow.draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function BezierFlow(){
	this.xoff = 0;

	this.draw = function(){
		noFill();
		stroke(150);
		stroke(0, 20);
		var x1 = width * noise(this.xoff + 15);
		var x2 = width * noise(this.xoff + 25);
		var x3 = width * noise(this.xoff + 35);
		var x4 = width * noise(this.xoff + 45);
		var y1 = height * noise(this.xoff + 55);
		var y2 = height * noise(this.xoff + 65);
		var y3 = height * noise(this.xoff + 75);
		var y4 = height * noise(this.xoff + 85);

		bezier(x1, y1, x2, y2, x3, y3, x4, y4);

		this.xoff += 0.005;
	}
}