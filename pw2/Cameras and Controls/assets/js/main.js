import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import {FirstPersonControls} from "../../../../../node_modules/three/examples/jsm/controls/FirstPersonControls.js";
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createPrimitives from './primitive.js';

let left, right, renderer1, renderer2;
let sceneL, sceneR;
let cameraL, cameraR;
let controlsL, controlsR;

const fontUrl = '../../../../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json';
const spread = 15;
const z_spread = 50;

const clock = new THREE.Clock();

function main() {

    left = document.querySelector( '#left' );
    right = document.querySelector( '#right' );

    THREE.Object3D.DefaultUp.set(0, 0, 1);

    sceneL = new THREE.Scene();
    sceneL.background = new THREE.Color( 0x4D5258 );

    sceneR = new THREE.Scene();
    sceneR.background = new THREE.Color( 0x21272e );

    cameraL = new THREE.PerspectiveCamera( 30, window.innerWidth / (2 * window.innerHeight), 0.1, 1000 );
    cameraL.position.set(300, 400, 400);
    cameraL.lookAt(0,0,0);

    controlsL = new FirstPersonControls( cameraL, left );
    controlsL.movementSpeed = 1000;
    controlsL.lookSpeed = 0.005;

    cameraR = new THREE.OrthographicCamera(- 150, 150, 150,- 150,1, 1000);
    
    controlsR = new OrbitControls(cameraR, right);
    
    cameraR.position.set(100, 100, 100);
    
    controlsR.update();

    const light = new THREE.HemisphereLight( 0xffffff, 0x444444, 1 );
    light.position.set( - 2, 2, 2 );
    sceneL.add( light.clone() );
    sceneR.add( light.clone() );

    // Create cross pattern on both scenes
    createGroundPattern(sceneR);
    createGroundPattern(sceneL);

    initMeshes();

    renderer1 = new THREE.WebGLRenderer( { antialias: true } );
    renderer1.setPixelRatio( window.devicePixelRatio );
    renderer1.setSize( window.innerWidth/2, window.innerHeight );
    left.appendChild( renderer1.domElement );

    renderer2 = new THREE.WebGLRenderer();
    renderer2.setPixelRatio( window.devicePixelRatio );
    renderer2.setSize( window.innerWidth/2, window.innerHeight);
    right.appendChild( renderer2.domElement );

    requestAnimationFrame( animate );
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

    addTextMesh(fontUrl, 0.5, sceneL);
    addTextMesh(fontUrl, 1.5, sceneL);
    addTextMesh(fontUrl, 2.5, sceneL);

    addTextMesh(fontUrl, 0.5, sceneR);
    addTextMesh(fontUrl, 1.5, sceneR);
    addTextMesh(fontUrl, 2.5, sceneR);
}

function createGroundPattern(scene) {

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
        scene.add(line);
        
        centers = [];
        centers.push(new THREE.Vector3(point.x, point.y - (c*step/2), 0));
        centers.push(new THREE.Vector3(point.x, point.y + (c*step/2), 0));
        geometry = new THREE.BufferGeometry().setFromPoints( centers );
        line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        scene.add(line);
        
        centers = [];
    });
}

function addObject(x, y, z, obj, scene) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    obj.position.z = z * z_spread;

    scene.add(obj);
}

function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
}

function addSolidGeometry(x, y, z, geometry, scene) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, z, mesh, scene);
}

function addTextMesh(fontUrl, z, scene) {
    const loader = new THREE.FontLoader();
    // promisify font loading
    function loadFont(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
    }

    async function doit() {
    const font = await loadFont(fontUrl);  
    const geometry = new THREE.TextGeometry('3D-XR', {
        font: font,
        size: 3.0,
        height: .2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: .3,
        bevelSegments: 5,
    });

    addSolidGeometry(-1.5, -1, z, geometry, scene);
    }
    doit();

}

function animate() {

    requestAnimationFrame( animate );

    controlsL.update( clock.getDelta() );

    renderer1.render( sceneL, cameraL );

    renderer2.render( sceneR, cameraR );

}

main();