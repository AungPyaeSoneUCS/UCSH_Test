// https://discourse.threejs.org/t/glow-effect-to-linebasicmaterial-without-bloom/84313

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshEdgesGeometry } from "meg/MeshEdgesGeometry.js";


// general setup

console.clear( );

// a renderer that renders normal scene
var renderer = new THREE.WebGLRenderer( {canvas:document.getElementById('lower'), antialias:true} );
		renderer.setSize( innerWidth, innerHeight );

// a renderer that renderes blurred scene (blurring is done in CSS)
var blurderer = new THREE.WebGLRenderer( {canvas:document.getElementById('upper'), antialias:true} );
		blurderer.setSize( innerWidth, innerHeight );
					
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 30, innerWidth/innerHeight );
		camera.position.set( 0, 2, 10 );

var controls = new OrbitControls( camera, blurderer.domElement );
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.3;

window.addEventListener( "resize", (event) => {
		camera.aspect = innerWidth/innerHeight;
		camera.updateProjectionMatrix( );
		renderer.setSize( innerWidth, innerHeight );
		blurderer.setSize( innerWidth, innerHeight );
});


// load three 3D models

var models = ['tractor','ambulance','race'],
		colors = ['cyan','hotpink','orange'],
		path = 'https://boytchev.github.io/MeshEdgesGeometry/demos/models';
					
for( let i=0; i<models.length; i++)
{
		new GLTFLoader().load( `${path}/${models[i]}.glb`, gltf => {
		var model = new THREE.LineSegments(
						new MeshEdgesGeometry( gltf.scene ),
						new THREE.LineBasicMaterial( {color: colors[i]} )
				);
		model.position.set( 2.5*(i-1), -0.5, 0 );
							
		scene.add( model );
	} );
}	
		
		
// animation loop
		
renderer.setAnimationLoop( ( t ) => {
		controls.update( );

		// draw the normal scene
		renderer.render( scene, camera );
	
		// every second alternate drawing or not drawing the blurred scene
		if( (t/1000)%2<1 )
				blurderer.render( scene, camera );
		else
				blurderer.clear();
} );