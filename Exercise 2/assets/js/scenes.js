import * as THREE from '../../../../node_modules/three/build/three.module.js';
import {FirstPersonControls} from "../../../../node_modules/three/examples/jsm/controls/FirstPersonControls.js";
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createPrimitives from './primitive.js';

let left, right, renderer1, renderer2;
let sceneL, sceneR;
let cameraL, cameraR;
let controlsL, controlsR;

const clock = new THREE.Clock();

init();

function init() {

    left = document.querySelector( '#left' );
    right = document.querySelector( '#right' );

    THREE.Object3D.DefaultUp.set(0, 0, 1);

    sceneL = new THREE.Scene();
    sceneL.background = new THREE.Color( 0x4D5258 );

    sceneR = new THREE.Scene();
    sceneR.background = new THREE.Color( 0x21272e );

    cameraL = new THREE.PerspectiveCamera( 30, window.innerWidth / (2 * window.innerHeight), 0.1, 1000 );
    cameraL.position.z = 400;
    cameraL.position.x = 300;
    cameraL.position.y = 300;
    cameraL.lookAt(0,0,0);

    controlsL = new FirstPersonControls( cameraL, left );
    controlsL.movementSpeed = 1000;
    controlsL.lookSpeed = 0.01;

    cameraR = new THREE.OrthographicCamera(
        - 150, 150,
        150, - 150,
        1, 1000);
    
    controlsR = new OrbitControls(cameraR, right);
    
    cameraR.position.set(100, 100, 100);
    cameraR.lookAt( 0, 0, 20 );
    
    controlsR.update();

    const light = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
    light.position.set( - 2, 2, 2 );
    sceneL.add( light.clone() );
    sceneR.add( light.clone() );

    {
        const c = 0.6; //coverage
        let step;
        let points = [];
        let  centers = [];
        const size = 100;
        for (var i = -size; i <= size; i+=7){
            for (var j = -size; j <= size; j+=7){
                points.push(new THREE.Vector3(i, j, 0));
            }
        }

        step = points[0].distanceTo(points[1]);
        points.forEach((point) => {
            centers.push(new THREE.Vector3(point.x - (c*step/2), point.y, 0));
            centers.push(new THREE.Vector3(point.x + (c*step/2), point.y, 0));
            let geometry = new THREE.BufferGeometry().setFromPoints( centers );
            const material = new THREE.LineBasicMaterial( {
                color: 0xffffff,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round' //ignored by WebGLRenderer
            } );
            let line = new THREE.Line(geometry, material);
            line.computeLineDistances();
            sceneR.add(line.clone());
            sceneL.add(line.clone());
            
            centers = [];
            centers.push(new THREE.Vector3(point.x, point.y - (c*step/2), 0));
            centers.push(new THREE.Vector3(point.x, point.y + (c*step/2), 0));
            geometry = new THREE.BufferGeometry().setFromPoints( centers );
            line = new THREE.Line(geometry, material);
            line.computeLineDistances();
            sceneR.add(line.clone());
            sceneL.add(line.clone());
            
            centers = [];
        }); 
    }  


    initMeshes();

    renderer1 = new THREE.WebGLRenderer( { antialias: true } );
    renderer1.setPixelRatio( window.devicePixelRatio );
    renderer1.setSize( window.innerWidth/2, window.innerHeight );
    left.appendChild( renderer1.domElement );

    renderer2 = new THREE.WebGLRenderer();
    renderer2.setPixelRatio( window.devicePixelRatio );
    renderer2.setSize( window.innerWidth/2, window.innerHeight);
    right.appendChild( renderer2.domElement );

}

function initMeshes() {
    const primitives_arr = [];
    primitives_arr.push(createPrimitives(0.5));
    primitives_arr.push(createPrimitives(1.5));
    primitives_arr.push(createPrimitives(2.5));

    primitives_arr.forEach((primitive_gr) => {
        primitive_gr.forEach((primitive) => {
            sceneL.add(primitive.clone());
            sceneR.add(primitive.clone());
        });
    });
}

function animate() {

    requestAnimationFrame( animate );

    controlsL.update( clock.getDelta() );

    renderer1.render( sceneL, cameraL );

    renderer2.render( sceneR, cameraR );

}

animate()