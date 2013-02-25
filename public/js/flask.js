
//
// Droplet
//

var Droplet = function(id, type, source) {
	this.id = id;
	this.type = type;
	this.src = location.host + source;
	this.init();
}

Droplet.prototype = {

	init: function() {
		this.x = 0;
		this.y = 0;
		this.width = 10;
		this.height = 10;
		this.dX = Math.random() - 0.5;
		this.dY = Math.random() - 0.5;
		this.vel = 3.0;
		if ( this.type === "photo" ) {
			this.color = 'orange';
			this.image = new Image();
			this.image.src = this.src;
			this.image.onload = this.photoLoaded;
			flog("PHOTO");
		}
		else {
			this.color = 'rgb(51,204,255)';
			flog("TWEET");
		}
    },

    photoLoaded: function(event) {
    	console.log("Loaded: " + this.src);
    },

    createCanvas: function() {
    	var c = document.createElement('canvas');
    	c.id = "c"+this.id;
    	c.width = 512;
    	c.height = 512;
    	$('#surgery').append(c);
		var ctx = c.getContext("2d");
		ctx.drawImage(this.image,0,0);
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
    	this.x += this.dX * this.vel;
    	this.y += this.dY * this.vel;
    	this.width += 1;
    	this.height += 1;
    	this.vel -= (this.vel > 0) ? 0.01 : 0;
    },

    draw: function( ctx ) {
    	var self = this;

    	if (this.isReady()) {
	        //ctx.beginPath();
	        //ctx.arc( this.x, this.y, 50, 0, TWO_PI );
	        ctx.globalAlpha = 0.5;
	        if (self.type == "photo" && self.vel <= 0.1) {
	        	var imgd = self.canvas.getImageData(0, 0, 512, 512);
	        	//ctx.putImageData(imgd, self.x - 50, self.y - 50);
	        	ctx.fillStyle = ctx.createPattern(self.image, 'repeat');
	        }
	        else {
	        	ctx.fillStyle = this.color;
	    	}
	    	//ctx.globalCompositeOperation = 'lighter';
	    	ctx.fillRect( self.x - (self.width/2), self.y - (self.width/2), self.width, self.height);
	        ctx.fill();
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
		this.flowRate = 1;
		this.dropScale = 1;
		this.dropCount = 0;

		this.flask = Sketch.create({
			container: document.getElementById( 'container' )
		});

		this.flask.setup = function() {
			flog("READY");

			/*
			var droplet = new Droplet(0, 'photo', './test.jpg');
			droplet.init();
			self.pool.push(droplet);

			var droplet2 = new Droplet(1, 'photo', 'http://distilleryimage2.instagram.com/5e3745d47ec511e2925f22000a1fb71a_7.jpg');
			droplet2.init();
			self.pool.push(droplet2);

			self.dropCount = 2;
			*/
		}

		this.flask.update = function() {
			for (d in self.pool) {
				self.pool[d].move();
			}
		}

		this.flask.draw = function() {
			var flask = self.flask;
			
			for (d in self.pool) {
				flask.save();
				flask.translate(flask.width / 2, flask.height / 2);
				self.dropScale += 0.1;
				self.pool[d].draw(flask);
				flask.restore();
			}
			
			if (self.flowRate > 0 && self.dropScale < 20) {
				flask.save();
				flask.translate(flask.width / 2, flask.height / 2);
				flask.fillStyle = 'rgba(255,255,255,0.1)';
				flask.scale(self.dropScale, self.dropScale);
				flask.globalCompositeOperation = 'lighter';
				flask.fillRect(-50, -50, 100, 100);
				flask.restore();
			}
		}

	},

	enqueueDrop: function(params) {
		var drop = new Droplet(this.dropCount, params.type, params.content);
		this.pool.push(drop);
		this.dropCount++;
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
				self.flowRate = data.payload;

			} else if (data.topic === "content:update") {
				// data.payload gives obj with type, author, content
				self.enqueueDrop(data.payload);
			}
		};

		this.socket.onclose = function() {
			flog("DISCONNECTED");
			console.log("BYEBYE");
		};

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

$(document).ready(function() {
	main.init();
	main.connect("ws://"+location.host);
	$(window).on('keyup', function(event) {
		// console.log(event.keyCode);
		if (event.keyCode == 192)
			$('#surgery, #debug').toggle();
	});
});
