import * as THREE from '../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createRobot from './robot.js'

let scene, camera, renderer;
let meshes = [];

function main() {
    const canvas = document.querySelector( '#c' );
    renderer = new THREE.WebGLRenderer( { canvas } );

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xB1ABA7 );

    // Light
    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -2, -4);
        scene.add(light);
    }

    // Camera
    const fov = 75;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 10, 10, 10 );

    // Controls
    const controls = new OrbitControls(camera, canvas);
    
    // Grid
    const grid = new THREE.GridHelper( 20, 20, 0x888888, 0x444444 );
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add( grid );

    // Robot
    meshes = createRobot();

    meshes.forEach(element =>{
        scene.add(element);
    })

    // Renderer
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

    animate()
}

function animate() {

    requestAnimationFrame( animate );

    renderer.render(scene, camera);

}

main();
