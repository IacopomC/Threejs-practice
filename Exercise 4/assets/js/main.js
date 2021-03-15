import * as THREE from '../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createRobot from './robot.js';
import generateBalls from './ball.js';
import PickHelper from './pick_helper.js';

let scene, camera, renderer;

function main() {
    const canvas = document.querySelector( '#c' );
    renderer = new THREE.WebGLRenderer( { canvas } );

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xB1ABA7 );

    // Light
    {
        const color = 0xFFFFFF;
        const intensity = 8;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 8;
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
    const robot_arm = createRobot();

    scene.add(robot_arm);

    // Balls
    const balls = generateBalls();

    balls.forEach( ball => {
        scene.add(ball);
    });

    // Initialize PickHelper and clear position
    const pickPosition = {x: 0, y: 0};
    const pickHelper = new PickHelper();
    clearPickPosition();

    function animate(time) {
        time *= 0.001;  // convert to seconds;
        
        pickHelper.pick(pickPosition, scene, camera, time);
    
        requestAnimationFrame( animate );
    
        renderer.render(scene, camera);
    
    }
    
    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) * canvas.width  / rect.width,
          y: (event.clientY - rect.top ) * canvas.height / rect.height,
        };
    }
    
    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }
    
    function clearPickPosition() {
        // Pick a value unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    function pickBall(event) {
        console.log('pick position ', pickPosition);
    }

    // Renderer
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
    window.addEventListener('pointerdown', pickBall);

    animate(pickHelper, pickPosition, scene, camera);
}

function cartesianToPolar(x, y){
    // Convert cartesian coordinates
    // to polar coordinates
    r = Math.sqrt(x*x + y*y);
    theta = Math.atan2(y,x);
    return { radius: r, angle: theta }
}

function polarToCartesian ( t, theta ) {
    // Convert polar coordinates
    // to cartesian coordinates
    let x = r * cos(theta);
    let y = r * sin(theta);

    return {x: x, y: y};
}

main();
