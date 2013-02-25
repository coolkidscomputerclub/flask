


//
// Droplet
//

var Droplet = function(id, type, source) {
	this.id = id;
	this.type = type;
	this.src = (type === "photo") ? "http://" + location.host : "";
	this.src += source;
	this.init();
}

Droplet.prototype = {

	init: function() {
		this.x = 0;
		this.y = 0;
		this.width = 100;
		this.height = 100;
		this.dX = Math.random() - 0.5;
		this.dY = Math.random() - 0.5;
		this.vel = 5.0;
		this.dropping = true;
		this.dropScale = 0;
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
    		ctx.font = "24pt Helvetica";
    		ctx.fillText(this.src, 256, 232, 500);
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
    	
    	//if (this.dropping) {
    		this.width -= 1;
    		this.height -= 1;
    		this.vel -= (this.vel > 0) ? 0.01 : 0;
    		if (this.width < 20) {
    			this.x += this.dX * this.vel;
    			this.y += this.dY * this.vel;
    			//if (this.vel <= 0.1) {
    				this.dropping = false;
    			//}
    			self.dropScale += 0.1;
    		}
    	/*
    	} else {
    		this.x += this.dX * this.vel;
    		this.y += this.dY * this.vel;
    		this.width += 1;
    		this.height += 1;
    	}*/
    },

    draw: function( ctx ) {
    	var self = this;
    	if (this.isReady()) {
	        ctx.globalAlpha = 0.8;
	        if (!self.dropping) {
	        	ctx.drawImage(self.image, self.x - (self.width / 2), self.y - (self.height / 2), self.width, self.height);
	        }
	        else {
	        	//ctx.beginPath();
	        	//ctx.arc( this.x, this.y, 50, 0, TWO_PI );
	        	ctx.fillStyle = this.color;
	        	ctx.fillRect( self.x - (self.width/2), self.y - (self.width/2), self.width, self.height);
	        	ctx.fill();
	    	}
	    	ctx.globalCompositeOperation = 'lighter';
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
			for (d in self.pool) {
				self.pool[d].move();
			}
		}

		this.flask.pour = function() {
			self.flowStart = self.flask.now;
			console.log("Beginning to pour: " + self.flowStart);
		}

		this.flask.draw = function() {
			var flask = self.flask;
			
			for (d in self.pool) {
				var d = self.pool[d];
				if (d.dropScale > 0 && d.dropScale < 10) {
					flask.save();
					flask.translate(flask.width / 2, flask.height / 2);
					flask.fillStyle = 'rgba(200,200,200,'+ (1.0 - (d.dropScale / 10)) + ')';
					flask.scale(d.dropScale, d.dropScale);
					flask.globalCompositeOperation = 'lighter';
					flask.fillRect(-50, -50, 100, 100);
					//flask.beginPath();
	        		//flask.arc( -50, -50, 100, 0, TWO_PI );
					flask.restore();
				}
				flask.save();
				flask.translate(flask.width / 2, flask.height / 2);
				d.draw(flask);
				flask.restore();
			}

			// for (d in self.pool) {
			// 	flask.save();
			// 	flask.translate(flask.width / 2, flask.height / 2);
			// 	self.pool[d].draw(flask);
			// 	flask.restore();
			// }

		}

	},

	enqueueDrop: function(params) {
		var drop = new Droplet(this.dropCount, params.type, params.content);
		this.queue.push(drop);
		flog((params.type === "photo") ? "P" : "T");
	},

	releaseDrop: function() {
		if (this.queue.length > 0) {
			// take first drop out of queue and put into pool
			var d = this.queue.shift();
			this.pool.push(d);
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
				self.enqueueDrop(data.payload);
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
				self.enqueueDrop({type:"photo", content:"/img/test.jpg"});

			if (event.keyCode == 84) 
				self.enqueueDrop({type:"tweet", content:"blargh"});		
			
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
	$('#surgery').toggle();
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
