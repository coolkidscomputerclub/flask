var socket = io.connect("http://localhost:8080");

socket.on("data", function (data) {

	parseAccelReadings(data);

});

var accX, accY, accZ;

function parseAccelReadings (values) {

	var splitValues = values.split(",");

	accX = splitValues[0];
	accY = splitValues[1];
	accZ = splitValues[2];

	//console.log("X: ", accX);
	//console.log("Y: ", accY);
	//console.log("Z: ", accZ);

}


/* # Three.js
================================================== */

var camera, scene, renderer, geometry, material, mesh;
var text3d;

var canvas1 = document.getElementById('canvas1') ;

init();

animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 10000 );

	camera.position.z = 250;

	scene.add(camera);

	geometry = new THREE.CubeGeometry(40, 80, 40);

	material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture("/img/kitty.jpeg"), overdraw: true } )

	mesh = new THREE.Mesh( geometry, material ) ;

	scene.add( mesh );

	renderer = new THREE.WebGLRenderer(canvas1);

	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}

function animate () {

	requestAnimationFrame(animate);

	render();

}

function render () {

	console.log(accX);

	var rotX = accX / 6 * (Math.PI / 180);
	var rotY = accY / 6 * (Math.PI / 180);
	var rotZ = accZ / 6 * (Math.PI / 180);

	mesh.rotation.x = rotX;
	mesh.rotation.y = rotY;
	mesh.rotation.z = rotZ;

	renderer.render(scene, camera);

}
