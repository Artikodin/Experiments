function setup() {
	createCanvas(windowWidth, windowHeight);
	dotGenerator = new DotGenerator(20, 20);
}

function draw() {

	background(52);
	dotGenerator.drawC();
	dotGenerator.collide(true);

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}


function DotGenerator(spaceX, spaceY){
	this.spaceX = spaceX;
	this.spaceY = spaceY;

	this.dotValue = [];
	this.dotInit = [];

	//Mise en place des directions
	this.directionX = 1;
	this.directionY = 1;

	//Mise en place de l'acceleration
	this.acceleretionX = 0;
	this.acceleretionY = 0;


	for (x = 0; x < width; x+=this.spaceX){
		for (y = 0; y < height; y+=this.spaceY){
			var v = createVector(x,y);
			var v2 = createVector(x,y);
			this.dotValue.push(v);
			this.dotInit.push(v2);
		}
	}

	this.drawC = function(){
		noFill();
		stroke(255);
		strokeWeight(3);
		beginShape(LINES);
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
}