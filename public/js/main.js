/* # Sockets
================================================== */

if (Modernizr.websockets === true) {

	console.log("WebSockets enabled!");

	var socket = new WebSocket("ws://" + location.host);

	socket.onopen = function () {

		console.log("Socket connected.");

		socket.send("Hello server!");

	};

	socket.onmessage = function (message) {

		// parseAccelReadings(data);

		console.log("Message: ", JSON.parse(message.data));

	};

	socket.onclose = function () {

		console.log("Socket closed.");

	};

} else {

	console.log("WebSockets not enabled!");

}

/* # Accelerometer shit
================================================== */

var accX, accY, accZ;

function parseAccelReadings (values) {

	var splitValues = values.split(",");

	accX = splitValues[0];
	accY = splitValues[1];
	accZ = splitValues[2];

}


/* # Three.js
================================================== */

var camera, scene, renderer, geometry, material, mesh;

var cnvs = document.getElementById('cnvs') ;

init();

animate();

function init() {

	// Scene

	scene = new THREE.Scene();

	// Camera

	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000 );

	camera.position.z = 250;

	scene.add(camera);

	// Geometry

	geometry = new THREE.CubeGeometry(20, 60, 20);

	mesh = new THREE.Mesh(geometry);

	scene.add(mesh);

	// Renderer

	renderer = new THREE.WebGLRenderer(cnvs);

	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}

function animate () {

	requestAnimationFrame(animate);

	render();

}

function render () {

	//console.log(accX);

	var rotX = accX / 6 * (Math.PI / 180);
	var rotY = accY / 6 * (Math.PI / 180);
	var rotZ = accZ / 6 * (Math.PI / 180);

	//mesh.rotation.z += 1 * (Math.PI / 180);
	//mesh.rotation.y += 1 * (Math.PI / 180);
	//mesh.rotation.x += 1 * (Math.PI / 180);

	//renderer.render(scene, camera);

}

document.onkeydown = function (e) {

	switch (e.keyCode) {

		case 37:
			pourBottle("left");
			break;

		case 39:
			pourBottle("right");
			break;

	}

};


