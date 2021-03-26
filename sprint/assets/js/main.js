import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {VRButton} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/geometries/BoxLineGeometry.js';

import ControllerPickHelper from './controller_pick_helper.js';
import PickHelper from './pick_helper.js';
import createConsole from './console_buttons.js';
import elevationMap from './elevationMap.js';
import colorCloud from './color_cloud.js';
import colorSpaceConsole from './color_space_console.js';

import {vertexShader, fragmentShader} from "./shaders.js";

function IVimageProcessing(height, width, imageProcessingMaterial) {
  
  this.height = height;
  this.width = width;

  //3 rtt setup
  this.scene = new THREE.Scene();
  this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);

  //4 create a target texture
  var options = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    //            type:THREE.FloatType
    type: THREE.UnsignedByteType
  };
  this.rtt = new THREE.WebGLRenderTarget(width, height, options);

  var geom = new THREE.BufferGeometry();
  geom.addAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
  geom.addAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), 2));
  this.scene.add(new THREE.Mesh(geom, imageProcessingMaterial));
}

function IVprocess(imageProcessing, renderer) {
  renderer.setRenderTarget(imageProcessing.rtt);
  renderer.render(imageProcessing.scene, imageProcessing.orthoCamera);
  renderer.setRenderTarget(null);
};

let camera, controls, scene, renderer;
let plane;


let buttons = [];
let colorSpace = 1;
let colorChannel = 2;
let ccLab = 1.0;

let elevationMapPlane;
let colorCloudObj;
let colorCloudObjShadow;

// VIDEO AND THE ASSOCIATED TEXTURE
var video, videoTexture;

var imageProcessing, imageProcessingMaterial;


init();

function init() {

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x505050 );

  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Turn on shadows in renderer
  renderer.shadowMap.enabled = false;

  // Enable WebXR and add VR button to page
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 10);
  camera.position.set(0, 3, 3);
  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableRotate = true;
  controls.addEventListener('change', render);
  controls.update();

  // Light
  {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    light.castShadow = true; // set light to cast shadow
    scene.add(light);
  }

  const room = new THREE.LineSegments(
    new BoxLineGeometry( 3, 2.99, 3, 10, 10, 10 ),
    new THREE.LineBasicMaterial( { color: 0x808080 } )
  );
  room.geometry.translate( 0, 1.5, 0 );
  scene.add( room );

  // Add floor
  const floor_geometry = new THREE.PlaneGeometry(3, 3);
  var floor_material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
  const floor = new THREE.Mesh(floor_geometry, floor_material);
  floor.position.set(0, 0, 0);
  floor.rotation.set(Math.PI/2, 0, 0);
  floor.receiveShadow = false;
  scene.add(floor);

  const video = document.getElementById( 'video' );

  const videoProcessing = function () {
    videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.format = THREE.RGBFormat;

    imageProcessingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sizeDiv2: { type: 'i', value: 5 },
        image: { type: 't', value: videoTexture },
        resolution: { type: '2f', value: new THREE.Vector2(video.videoWidth, video.videoHeight) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    imageProcessing = new IVimageProcessing(video.videoHeight, video.videoWidth, imageProcessingMaterial);

    // Curved plane parameters
    const radius = 0.7;  
    const widthSegments = 12;  
    const heightSegments = 12;  
    const phiStart = Math.PI;  
    const phiLength = Math.PI;  
    const thetaStart = Math.PI * 0.3;  
    const thetaLength = Math.PI * 0.35;  

    let geometry = new THREE.SphereGeometry(
    radius,
    widthSegments, heightSegments,
    phiStart, phiLength,
    thetaStart, thetaLength);

    let material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

    plane = new THREE.Mesh(geometry, material);
    plane.position.set(-0.2, 2, 0);

    scene.add(plane);

    // Add play/stop buttons
    buttons = createConsole(scene);

    // Elevation Map
    elevationMapPlane = elevationMap(scene, video, videoTexture, colorSpace, colorChannel);

    // Color Cloud
    [colorCloudObj, colorCloudObjShadow] = colorCloud(scene, video, videoTexture, colorSpace, ccLab);

    // Add color space buttons
    const colorSpaceButtons = colorSpaceConsole(scene);

    buttons = [...buttons, ...colorSpaceButtons];
 
    video.play();

  };

  //video.src = './assets/video/video.mp4';
  video.load();
  video.onloadeddata = videoProcessing;
  video.muted = true;
  video.loop = true;

  // Pick Helper controllers
  const controllerPickHelper = new ControllerPickHelper(scene, renderer);

  controllerPickHelper.addEventListener('selectstart', (event) => {
    if (event.selectedObject){
      console.log('item selected ', event.selectedObject);
      clickButton(event.selectedObject);
    }   
  });

  // Pick Helper mouse
  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('pointerdown', () => {
      clickButton(pickHelper.pickedObject);
    }
  );

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
    pickPosition.y = - (pos.y / canvas.height) * 2 + 1;  // note we flip Y
  }

  function clearPickPosition() {
    // Pick a value unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function clickButton(selecteObj){
    if(selecteObj) {
      switch(selecteObj.name){
        case 'stop':
          video.pause();
          break;
        case 'play':
          video.play();
          break;
        case 'addSecs':
          video.currentTime = video.currentTime + 10;
          break;
        case 'stop':
          video.pause();
          break;
        case 'channel1':
          elevationMapPlane.material.uniforms.colorChannel.value = 0;
          break;
        case 'channel2':
          elevationMapPlane.material.uniforms.colorChannel.value = 1;
          break;
        case 'channel3':
          elevationMapPlane.material.uniforms.colorChannel.value = 2;
          break;
        case 'RGB':
          elevationMapPlane.material.uniforms.colorSpace.value = 0;

          colorCloudObj.material.uniforms.colorSpace.value = 0;
          colorCloudObj.material.uniforms.ccLab.value = 1.0;

          colorCloudObjShadow.material.uniforms.colorSpace.value = 0;
          colorCloudObjShadow.material.uniforms.ccLab.value = 1.0;
          break;
        case 'Yxy':
          elevationMapPlane.material.uniforms.colorSpace.value = 1;

          colorCloudObj.material.uniforms.colorSpace.value = 1;
          colorCloudObj.material.uniforms.ccLab.value = 1.0;

          colorCloudObjShadow.material.uniforms.colorSpace.value = 1;
          colorCloudObjShadow.material.uniforms.ccLab.value = 1.0;
          break;
        case 'LAB':
          elevationMapPlane.material.uniforms.colorSpace.value = 2;

          colorCloudObj.material.uniforms.colorSpace.value = 2;
          colorCloudObj.material.uniforms.ccLab.value = 100.0;

          colorCloudObjShadow.material.uniforms.colorSpace.value = 2;
          colorCloudObjShadow.material.uniforms.ccLab.value = 100.0;
          break;
        case 'HSV':
          elevationMapPlane.material.uniforms.colorSpace.value = 3;

          colorCloudObj.material.uniforms.colorSpace.value = 3;
          colorCloudObj.material.uniforms.ccLab.value = 1.0;

          colorCloudObjShadow.material.uniforms.colorSpace.value = 3;
          colorCloudObjShadow.material.uniforms.ccLab.value = 1.0;
          break;
        default:
          console.log('Select action');
      }
    }
  }

  function render() {
    renderer.clear();
  
    if (typeof imageProcessing !== "undefined")
      IVprocess(imageProcessing, renderer);
    renderer.render(scene, camera);
  }
  
  function animate(time) {
    controls.update();
    time *= 0.001;  // convert to seconds;

    controllerPickHelper.update(buttons, time);
    pickHelper.pick(pickPosition, camera, buttons, time);
    render();
    // Let three js handle render loop
  }
  renderer.setAnimationLoop(animate);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  window.addEventListener('resize', onWindowResize, false);
}


