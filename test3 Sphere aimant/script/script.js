var color = {
	r : 0,
	v : 0,
	b : 0
}

var inc = 0.1;

var xoff1 = 0;
var xoff2 = 100;
var xoff3 = 10000;

var diametre = 15;

var grow = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	dotCircle = new DotCircle(width/2, height/2, 100, 500);
	dotCircle2 = new DotCircle(width/2, height/2, 120, 500);
	dotCircle3 = new DotCircle(width/2, height/2, 110, 500);
	dotCircle4 = new DotCircle(width/2, height/2, 150, 500);
	dotCircle5 = new DotCircle(width/2, height/2, 300, 500);

	noiseColor = new NoiseColor(0);
	noiseColor2 = new NoiseColor(4);
	// dotCircle2 = new dotCircle(width, height, 100, 1000);
	// dotCircle3 = new dotCircle(width/2, height/8, 100, 1000, true);
	// dotCircle4 = new dotCircle(width/9, height/4, 100, 1000, true);
}

function draw() {

	var size = map(noise(xoff1), 0, 1, 0, 20)
	// backgroundColor();

	// var dirX = (mouseX / width - 0.5) *2;
	// var dirY = (mouseY / height - 0.5) *(-2);
	// directionalLight(250, 250, 250, dirX, dirY, 0.25)
	// sphere(200);
	noiseColor.update(0.01);

	background(61);
	dotCircle.drawC(7, noiseColor.r, noiseColor.v, noiseColor.b);
	dotCircle.collide(true);

	dotCircle2.drawC(6);
	dotCircle2.collide(true);

	dotCircle3.drawC(2, 50, 10, 3);
	dotCircle3.collide(true);

	dotCircle4.drawC(1);
	dotCircle4.collide(true);

	dotCircle5.drawC(size);
	dotCircle5.collide(true);

	// dotCircle.noisy(true, 0.1);

	// dotCircle2.create();
	// dotCircle2.collide(true);

	// dotCircle3.create();
	// dotCircle3.collide(true);

	// dotCircle4.create();
	// dotCircle4.collide(true);
	// dotCircle(width/2, height/2, 500, 100, true);
	// dotCircle(width/2, height/2, 100, 100, true);
	// noLoop();
	xoff1 += 0.01;

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function backgroundColor(){
	background(color.r, color.v, color.b);

	color.r = map(noise(xoff1), 0, 1, 0, 255);
	color.v = map(noise(xoff2), 0, 1, 0, 255);
	color.b = map(noise(xoff3), 0, 1, 0, 255);

	// r = random(255);
	// v = random(255);
	// b = random(255);

	xoff1 += 0.001;
	xoff2 += 0.001;
	xoff3 += 0.001;

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

function circleGrow(){
	for (x = diametre/2; x < width; x += diametre){
	    for (y = diametre/2; y < height; y += diametre){
			noFill();
	      	ellipse(x , y, diametre, diametre)
      		line(x, y, width/2, height/2)
	    }
	}

	if (grow === true){
		diametre += 0.01;
	}else{
		diametre -= 0.01;
	}

	if (diametre == 50){
		grow = false;
	}

	if (diametre == 15){
		grow = true;
	}
}

function sphere(){
	var r = 100;
	var total = 10;
	for (var i = 0; i < total; i++) {
		var lon = map(i, 0, total, -PI, PI)
		for (var j = 0; j < total; j++) {
			var lat = map(j, 0, total, -HALF_PI, HALF_PI)
			var x = r * sin(lon) * cos(lat);
			var y = r * cos(lon) * sin(lat);
			var z = r * cos(lon);
			stroke(255);
			point(x,y,z);
		};
	};
}

function DotCircle(x, y, radius, detail){
	//Mise en place des parametres de base
	this.x = x;
	this.y = y;
	this.r = radius;
	this.detail = detail;


	//Mise en place des directions
	this.directionX = 1;
	this.directionY = 1;

	//Mise en place de l'acceleration
	this.acceleretionX = 0;
	this.acceleretionY = 0;


	//Mise en place du Perlin noise
	this.xoff1 = 0;
	this.xoff2 = 100;

	this.noiseX = 0;
	this.noiseY = 0;


	//Mise en place du tableau comprennant tout les points(x,y)
	this.pointValue = [];

	this.pointSafe = [];

	

	//Creation de tout les points les assigner à un vector et les inserer dans un tableau
	for (var i = 0; i < this.detail; i++) {
		var angle = map(i, 0, this.detail, -PI, PI)
		var x = this.r * cos(angle) + this.x;
		var y = this.r * sin(angle) + this.y;


		var v = createVector(x,y);
		var v2 = createVector(x,y);
		this.pointValue.push(v);
		this.pointSafe.push(v2);
	};


	//Methode qui dessine la forme 
	this.drawC = function(weight, r, v ,b){
		var weight = (typeof weight !== 'undefined') ? weight : 4;
		var r = (typeof r !== 'undefined') ? r : 255;
		var v = (typeof v !== 'undefined') ? v : 255;
		var b = (typeof b !== 'undefined') ? b : 255;
		beginShape();
		for (var i = 0; i < this.detail; i++) {
			strokeWeight(weight);
			stroke(r, v, b);
			point(this.pointValue[i].x,this.pointValue[i].y);
		};
		endShape();
	}

	//Methode qui initialise les collision
	this.collide = function(collision){
		if (collision == true && collision !== undefined && collision !== false){
			for (var i = 0; i < this.detail; i++) {
				var d = dist(mouseX, mouseY, this.pointValue[i].x, this.pointValue[i].y);
				
				if (d < 50){
					if (mouseX < this.pointValue[i].x) {
						this.directionX = 1;
					}else if (mouseX > this.pointValue[i].x) {
						this.directionX = -1;
					}

					if (mouseY < this.pointValue[i].y) {
						this.directionY = 1;
					}
					else if (mouseY > this.pointValue[i].y) {
						this.directionY = -1;
					}
					this.acceleretionX = d/25 * this.directionX;
					this.pointValue[i].x += this.directionX;

					this.acceleretionY = d/25 * this.directionY;
					this.pointValue[i].y += this.acceleretionY ;
				}else{
					if (this.pointValue[i].y !== this.pointSafe[i].y){
						this.pointValue[i].y += (this.pointSafe[i].y - this.pointValue[i].y) * 0.2;
					}
					if (this.pointValue[i].x !== this.pointSafe[i].x){
						this.pointValue[i].x += (this.pointSafe[i].x - this.pointValue[i].x) * 0.2;
					}
				}
			};
		}
	}

	//Methode qui initialise le bruit
	this.noisy = function(noisy, increase){
		if (noisy == true && noisy !== undefined && noisy !== false){
				this.noiseX = map(noise(this.xoff1), 0, 1, 0, 3);
				this.noiseY = map(noise(this.xoff2), 0, 1, 0, 3);
			for (var i = 0; i < this.detail; i++) {
				this.pointValue[i].x += this.noiseX;
				this.pointValue[i].y += this.noiseY;
			}
				this.xoff1 += increase;
				this.xoff2 += increase;
		}	
	}
}