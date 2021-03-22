import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { RectAreaLightUniformsLib } from '../../../../../node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {VRButton} from '../../../../../node_modules/three/examples/jsm/webxr/VRButton.js';
import cornellBox from './cornell_box.js';
import 'https://lo-th.github.io/uil/build/uil.js';


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    // Turn on shadows in renderer
    renderer.shadowMap.enabled = true;

    // Enable WebXR and add VR button to page
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));

    // Camera
    const fov = 75;
    const aspect = window.innerWidth/window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 12, 12 );

    // Controls
    const controls = new OrbitControls(camera, canvas);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB1ABA7);

    // Light
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const pointLight = new THREE.PointLight(color, intensity);
    pointLight.position.set(0, 4, 0);
    pointLight.castShadow = true; // set light to cast shadow
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add(ambientLight);

    // Cornell Box
    const cornellBoxObj = cornellBox();
    scene.add(cornellBoxObj);

    // Call RectAreaLightUniformsLib
    RectAreaLightUniformsLib.init();

    // Add RectAreaLight left wall
    const width = 6;
    const height = 6;
    const rectIntensity = 0.2;
    const rectLightLeft = new THREE.RectAreaLight( 0xFF0000, rectIntensity,  width, height );
    rectLightLeft.position.set( -3, 3, 0 );
    rectLightLeft.rotation.set(0, Math.PI/2 , 0);
    rectLightLeft.lookAt( 0, 0, 0 );
    scene.add( rectLightLeft )

    // Add RectAreaLight right wall
    const rectLightRight = new THREE.RectAreaLight( 0x009D00, rectIntensity,  width, height );
    rectLightRight.position.set( 3, 3, 0 );
    rectLightRight.rotation.set(0, Math.PI/2 , 0);
    rectLightRight.lookAt( 0, 0, 0 );
    scene.add( rectLightRight )

    // Add RectAreaLight back wall
    const rectLightBack = new THREE.RectAreaLight( 0xffffff, rectIntensity,  width, height );
    rectLightBack.position.set( 0, 3, 3 );
    rectLightBack.lookAt( 0, 0, 0 );
    scene.add( rectLightBack )

    // Retrieve Meshes
    const leftWall = cornellBoxObj.children[0];
    const rightWall = cornellBoxObj.children[1];
    const backWall = cornellBoxObj.children[2];
    const floor = cornellBoxObj.children[3];
    const sphere = cornellBoxObj.children[7];
    const cylinder = cornellBoxObj.children[6];
    const cone = cornellBoxObj.children[5];

    // Set each mesh to cast or receive a shadow
    leftWall.receiveShadow = true;
    rightWall.receiveShadow = true;
    backWall.receiveShadow = true;
    floor.receiveShadow = true;
    sphere.receiveShadow = true;
    cylinder.receiveShadow = true;
    cone.receiveShadow = true;

    sphere.castShadow = true;
    cylinder.castShadow = true;
    cone.castShadow = true;
    
    // Gui
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    // Light intensity
    ui.add( pointLight, 'intensity', { min:0, max:5, rename:'Intensity' } ).listen();
    // Wireframe
    ui.add('bool', { name:'Wireframe', }).onChange(
      function(value){
        sphere.material.wireframe = value;
        cone.material.wireframe = value;
        cylinder.material.wireframe = value;
      }
    );
    // Reflectivity
    ui.add('slide', { min:0, max:1, value: 0.5, rename:'Reflective' }).onChange(
      function(value){
        sphere.material.reflectivity = value;
        cone.material.reflectivity = value;
        cylinder.material.reflectivity = value;
      }
    );
    // Color
    ui.add('color', { name:'Color', type:'rgba', value:[0,1,1,1]}).onChange(
      function(color){
        sphere.material.color.setHex(color);
        cone.material.color.setHex(color);
        cylinder.material.color.setHex(color);
      }
    );
    // Map
    const texture = new THREE.TextureLoader().load('./assets/img/earth.jpg');
    ui.add('bool', { name:'Map'}).onChange(
      function(v){
        if (v) {
          sphere.material.color.setHex(0xFFFFFF);
          cone.material.color.setHex(0xFFFFFF);
          cylinder.material.color.setHex(0xFFFFFF);

          sphere.material.map = texture;
          cone.material.map = texture;
          cylinder.material.map = texture;
        }
        else{
          sphere.material.color.setHex(0x0000FF);
          cone.material.color.setHex(0xE55C08);
          cylinder.material.color.setHex(0xFF0000);

          sphere.material.map = null;
          cone.material.map = null;
          cylinder.material.map = null;
        }
        sphere.material.needsUpdate = true;
        cone.material.needsUpdate = true;
        cylinder.material.needsUpdate = true;
      }
    );

    // Alpha Map
    const textureChain = new THREE.TextureLoader().load('./assets/img/chainlink.png');
    const textureChainAlpha = new THREE.TextureLoader().load('./assets/img/chainlink_alpha.png');
    ui.add('bool', { name:'Alpha Map'}).onChange(
      function(v){
        if (v) {
          sphere.material.color.setHex(0xFFFFFF);
          cone.material.color.setHex(0xFFFFFF);
          cylinder.material.color.setHex(0xFFFFFF);

          sphere.material.map = textureChain;
          cone.material.map = textureChain;
          cylinder.material.map = textureChain;

          sphere.material.alphaMap = textureChainAlpha;
          cone.material.alphaMap = textureChainAlpha;
          cylinder.material.alphaMap = textureChainAlpha;

          sphere.material.transparent = true;
          cone.material.transparent = true;
          cylinder.material.transparent = true;
        }
        else{
          sphere.material.color.setHex(0x0000FF);
          cone.material.color.setHex(0xE55C08);
          cylinder.material.color.setHex(0xFF0000);

          sphere.material.map = null;
          cone.material.map = null;
          cylinder.material.map = null;

          sphere.material.alphaMap = null;
          cone.material.alphaMap = null;
          cylinder.material.alphaMap = null;

          sphere.material.transparent = false;
          cone.material.transparent = false;
          cylinder.material.transparent = false;
        }
        sphere.material.needsUpdate = true;
        cone.material.needsUpdate = true;
        cylinder.material.needsUpdate = true;
      }
    );

    // Light Shadow Properties
    ui.add( pointLight.shadow.mapSize, 'x', { min:0, max:512, value:512, rename:'Shadow X' } ).listen();
    ui.add( pointLight.shadow.mapSize, 'y', { min:0, max:512, value:512, rename:'Shadow Y' } ).listen();
    ui.add( pointLight.shadow, 'radius', { min:0, max:100, value:1, rename:'Shadow R' } ).listen();

    function render() {
    
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      
      renderer.render(scene, camera);
  
    }
    // Let three js handle render loop
    renderer.setAnimationLoop(render);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

main();