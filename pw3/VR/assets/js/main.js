import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { RectAreaLightUniformsLib } from '../../../../../node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {VRButton} from '../../../../../node_modules/three/examples/jsm/webxr/VRButton.js';

import cornellBox from './cornell_box.js';
import createGui from './3DGUI.js';
import ControllerPickHelper from './controller_pick_helper.js';

import 'https://lo-th.github.io/uil/build/uil.js';
import 'https://lo-th.github.io/uil/examples/js/math.js';

var cw = 120*3, ch=170;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let mouse2d = new THREE.Vector2();

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
  camera.position.set( 0, 4, 10 );

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
  const sphere = cornellBoxObj.children[7];
  const cylinder = cornellBoxObj.children[6];
  const cone = cornellBoxObj.children[5];

  // Set each mesh to cast shadow
  sphere.castShadow = true;
  cylinder.castShadow = true;
  cone.castShadow = true;

  // Set each mesh to receive a shadow
  cornellBoxObj.children.forEach( (element) => {
    element.receiveShadow = true;
  })

  //Gui
  const [gui3D, interactive] = createGui(scene, pointLight, cornellBoxObj);

  // VR Controllers
  const controllerPickHelper = new ControllerPickHelper(scene, renderer);

  controllerPickHelper.addEventListener('selectstart', (event) => {
    console.log(event) 
  });
  
  controllerPickHelper.addEventListener('selectend', () => {
  });
  
  function render() {
  
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controllerPickHelper.update(interactive.children);

    renderer.render(scene, camera);

  }
  // Let three js handle render loop
  renderer.setAnimationLoop(render);
  
  function onMouseUp( e ){

    e.preventDefault();
    if(!controls.enabled) controls.enabled = true;
  
  }
  
  function onMouseDown( e ){
  
    e.preventDefault();
    controls.enabled = raytest( e , gui3D, mouse, camera, interactive) ? false : true;
  
  }
  
  function onMouseMove( e ) {
  
    e.preventDefault();
    raytest( e , gui3D, mouse, camera, interactive);
  
  }
  
  document.addEventListener( 'pointerup', onMouseUp, false );
  document.addEventListener( 'pointerdown', onMouseDown, false );
  document.addEventListener( 'pointermove', onMouseMove, false );

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

function raytest ( e, gui3D, mouse, camera, interactive ) {
  
  mouse.set( (e.clientX / window.innerWidth) * 2 - 1, - ( e.clientY / window.innerHeight) * 2 + 1 );
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( interactive.children );

  if ( intersects.length > 0 ){
  
      var uv = intersects[ 0 ].uv;
      mouse2d.x = Math.round( uv.x*cw );
      mouse2d.y = ch - Math.round( uv.y*ch );

      if( intersects[ 0 ].object.name === 'p1' ) gui3D.setMouse( mouse2d );
      return true;

  } else {

      if(gui3D)gui3D.reset( true );
      return false;
  }

}

main();