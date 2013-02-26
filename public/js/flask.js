


//
// Droplet
//

var Droplet = function(id, type, source, author) {
	this.id = id;
	this.type = type;
	this.src = (type === "photo") ? "http://" + location.host : "";
	this.src += source;
	this.author = author;
	this.init();
}

Droplet.prototype = {

	init: function() {
		this.x = 0;
		this.y = 0;
		this.width = 25;
		this.height = 25;
		this.maxSize = 256 + (Math.random() * 256);
		this.dX = 0.1 + Math.random() - 0.5;
		this.dY = 0.1 + Math.random() - 0.5;
		this.dO = 0;
		//this.rotation = 0;
		// this.spin = Math.random() * (Math.PI/2);
		// this.spin *= (Math.random() > 0.5) ? 1 : -1;
		// this.spin /= 1000;
		this.vel = 8;
		this.dropping = true;
		this.dropScale = 0;
		this.lifeTime = 0;
		this.dead = false;
		this.dummy = false;

		if ( this.type === "photo" ) {
			this.color = 'orange';
			this.image = new Image();
			this.image.src = this.src;
			this.image.onload = this.photoLoaded;
		}
		else {
			this.color = 'rgb(51,204,255)';
			this.canvas = this.createCanvas();
		}
    },

    photoLoaded: function(event) {
    	//console.log("Loaded: " + this.src);
    },

    createCanvas: function() {
    	var c = document.createElement('canvas');
    	c.id = "c"+this.id;
    	c.width = 512;
    	c.height = 512;
    	$('#surgery').append(c);
    	var ctx = c.getContext("2d");
    	if (this.type === "photo") {
			ctx.drawImage(this.image,0,0);
		}
		else {
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
    		ctx.font = "24pt Helvetica Neue";
    		prettifyTweet(ctx, this.src, this.author);
    		//ctx.fillText(this.src, 256, 270, 500);
    		this.image = new Image();
		}
		this.image.src = c.toDataURL("image/png");
		return ctx;
    },

    isReady: function() {
    	if (this.type === "photo" && this.image.complete) {
    		if (this.canvas)
    			return true;
    		else 
    			this.canvas = this.createCanvas();
    			return false;
    	}
    	else if (this.type === "tweet") {
    		return true;
    	}
    	else { return false; }
    },

    move: function() {

    	var self = this;
    	
		if (!self.dropping) {
			if (self.width < self.maxSize) {
				self.width += 1;
				self.height += 1;
			}
			// self.rotation += self.spin;
		}
		else {
			self.width -= 1;
			self.height -= 1;
			if (self.width <= 20) {
				self.dropping = false;
				self.vel = 2.0;
			}
		}

		self.dropScale += 0.1;
		self.x += self.dX * self.vel;
		self.y += self.dY * (self.vel / 2);
		self.lifeTime += 1;
		if (self.lifeTime > 1200) {
			self.dO += 0.01;
			if (self.dO >= 0.8)
				self.dO = 0.8;
		} else if (self.lifeTime > 1800) {
			self.dead = true;
		}

    },

    draw: function( ctx ) {
    	var self = this;
    	if (this.isReady()) {
	        ctx.fillStyle = this.color;

	        if (!self.dropping) {
	        	ctx.beginPath();
				ctx.arc( self.x, self.y, self.width/2 - 2, 0, TWO_PI );
				ctx.closePath();
				ctx.globalAlpha = 0.8 - self.dO;
				if (self.type == "tweet") {
					ctx.fill();
				}
				ctx.clip();
	        	ctx.drawImage(self.image, self.x - (self.width / 2), self.y - (self.height / 2), self.width, self.height);
	        	ctx.globalAlpha = 1.0;
	        }
	        else {
	        	//ctx.fillRect( self.x - (self.width/2), self.y - (self.width/2), self.width, self.height);
	        	ctx.fillStyle = this.color;
	        	ctx.beginPath();
				ctx.arc( self.x, self.y, self.width/2, 0, TWO_PI );
				ctx.closePath();
				ctx.fill();
	        }
	        ctx.globalAlpha = 1.0;
	    }
    }
};




//
// Visualisation
//

var main = {

	init: function() {

		var self = this;

		this.pool = [];
		this.queue = [];
		this.spillRate = 0;

		this.socket;
		this.flowRate = 0;
		this.flowStart = 0;
		this.dropCount = 0;

		this.flask = Sketch.create({
			container: document.getElementById( 'container' )
		});

		this.flask.setup = function() {
			//flog("READY");
		}

		this.flask.update = function() {

			if (self.flowRate > 0) {
				var dT = self.flask.now - self.flowStart;
				//console.log("Time elapsed: " + dT);
				if (dT > (1000 / self.flowRate)) {
					self.releaseDrop();
					self.flowStart = self.flask.now;
				}
			}

			var d;
			for (i in self.pool) {
				d = self.pool[i];
				if (!d.dead) {
					d.move();
				} else {	
					console.log("DEAD!");
					$('#c'+d.id).remove();
					self.pool.splice(i,1);
					self.dropCount--;
				}
			}

		}

		this.flask.pour = function() {
			self.releaseDrop();
			self.flowStart = self.flask.now;
			// console.log("Beginning to pour: " + self.flowStart);
		}

		this.flask.draw = function() {
			var flask = self.flask;
			
			for (i in self.pool) {
				var d = self.pool[i];
				
				// draw ripple behind drop
				if (d.dropScale > 0 && d.dropScale < 10) {
					flask.save();
					flask.translate(flask.width / 2, flask.height / 2);
					flask.strokeStyle = 'rgba(200,200,200,'+ (1.0 - (d.dropScale / 10)) + ')';
					flask.scale(d.dropScale, d.dropScale);

					//draw a circle at original scale
					flask.lineWidth = 1;
					flask.fillStyle = "transparent";
					flask.beginPath();
					flask.arc( 0, 0, d.width / 2, 0, TWO_PI );
					flask.closePath();
					flask.globalCompositeOperation = 'lighter';
					flask.stroke();
					
					//flask.fillRect(-50, -50, 100, 100);
					
					flask.restore();
				}
				flask.save();
				flask.translate(flask.width / 2, flask.height / 2);
				d.draw(flask);
				flask.restore();
			}

		}

	},

	enqueueDrop: function(params, isDummy) {
		var author = (params.author) ? params.author : null;
		var drop = new Droplet(this.dropCount, params.type, params.content, author);
		drop.dummy = isDummy;
		this.queue.push(drop);
		flog((params.type === "photo") ? "P" : "T");
	},

	releaseDrop: function() {

		var self = this;

		if (this.queue.length > 0) {
			// take first drop out of queue and put into pool
			var d = this.queue.shift();
			this.pool.push(d);
			if (!d.dummy) {
				self.socket.send(JSON.stringify({topic:"flow:update", payload: null}));
			}
			this.dropCount++;
			flog((d.type === "photo") ? "(P)" : "(T)");
		}
	},

	setFlowRate: function(rate) {
		
		var self = this;

		if (self.flowRate != rate) {
			if (rate == 2) {
				flog("FLOWWWING");
				self.flask.pour();
			} else if (rate == 1) {
				flog("FLOWING");
				self.flask.pour();
			} else {
				flog("STOPPING");
			}
		}
		self.flowRate = rate;
	},

	//
	// Socket
	//

	connect: function(address) {

		console.log("Connecting to Saul..");
		this.socket = new WebSocket(address);
		this.bindSocketEvents();

	},

	bindSocketEvents: function() {

		var self = this;

		this.socket.onopen = function() {
			flog("CONNECTED");
		};

		this.socket.onmessage = function(message) {
			console.log("Message received: " + message.data);
			var data = JSON.parse(message.data);
			if (data.topic === "flow:update") {
				// data.payload gives values 0, 1 or 2
				self.setFlowRate(data.payload);

			} else if (data.topic === "content:update") {
				// data.payload gives obj with type, author, content
				self.enqueueDrop(data.payload), false;
			}
		};

		this.socket.onclose = function() {
			flog("DISCONNECTED");
			$("#debug").show();
			console.log("BYEBYE");
		};

	},

	addDebugHandlers: function() {

		var self = this;
		
		$(window).on('keyup', function(event) {
			
			// console.log(event.keyCode);

			if (event.keyCode == 192)
				toggleDebug();

			if (event.keyCode == 80) 
				self.enqueueDrop({type:"photo", content:"/img/test.jpg"}, true);

			if (event.keyCode == 84) 
				self.enqueueDrop({type:"tweet", content:"I'm a tweet machine, look at ma juiceyyy tweets. Oh sweet tweet o' mine. ({}) Making pancakes, making bacon paaaancakes. New York, New York.", author:"bloomingbridges"}, true);		
			
			if (event.keyCode == 32)
				self.releaseDrop();

			if (event.keyCode == 48)
				self.setFlowRate(0);

			if (event.keyCode == 49)
				self.setFlowRate(1);

			if (event.keyCode == 50)
				self.setFlowRate(2);

		});
	}

};



//
// Helper function
//

function flog(message, values) {
	$('#debug').append(" === " + message);
	if (values instanceof Array) {
		var v = ": ";
		for (var i in values) {
			v += i;
		}
		$('#debug').append(v);
	}
}

function toggleDebug() {
	$('#surgery, #debug').toggle();
}

function prettifyTweet(context, text, author) {
	var amountRows = Math.round(text.length / 24);
	//console.log("TWEET LENGTH: " + text.length);
	var offset = 0, start = 0, remaining = 0;
	for ( var i=0; i<amountRows; i++ ) {
		if (i < amountRows - 1) {
			offset = getCharOffset(amountRows,i) * 2;
			remaining += offset;
		}
		else {
			offset = -remaining;
		}
		context.fillText(text.substr(start,28-offset), 256, 270+(i*48)-(Math.floor(amountRows/2) * 48), 500);
		start += 28 - offset;
	}
	context.fillStyle = 'rgb(25,100,128)';
	context.fillText("@"+author, 256, 270+Math.ceil(amountRows/2)*48, 500);

}

function getCharOffset(rows, index) {
	var map = [
		[0,0,0,0,0,0],
		[1,1,0,0,0,0],
		[1,0,1,0,0,0],
		[2,1,1,2,0,0],
		[2,1,0,1,2,0],
		[2,1,0,0,1,2]
	];
	return map[rows-1][index];
}



//
// Ready
//

$(document).ready(function() {

	main.init();
	main.connect("ws://"+location.host);
	main.addDebugHandlers();

	$(document).bind('touchmove', function(e) {
		e.preventDefault();
	});

});
