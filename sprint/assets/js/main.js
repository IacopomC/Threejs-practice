import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import {VRButton} from '../../../../../node_modules/three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from '../../../../../node_modules/three/examples/jsm/geometries/BoxLineGeometry.js';

import ControllerPickHelper from './controller_pick_helper.js';
import PickHelper from './pick_helper.js';
import createConsole from './console_buttons.js';

import {vertexShader, fragmentShader,
        elevationVertexShader, elevationFragmentShader,
        colorCloudVertexShader, colorCloudFragmentShader} from "./shaders.js";

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

let camera, controls, scene, renderer, container, controllerPickHelper;
let plane;
let buttons = [];

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
    const intensity = 6;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xFFFFFF;
    const intensity = 6;
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
    new BoxLineGeometry( 3, 3, 3, 10, 10, 10 ),
    new THREE.LineBasicMaterial( { color: 0x808080 } )
  );
  room.geometry.translate( 0, 1.5, 0 );
  scene.add( room );

  video = document.createElement('video');

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

    var geometry = new THREE.PlaneGeometry(1, video.videoHeight / video.videoWidth);
    var material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 2, 0);
    plane.receiveShadow = false;
    plane.castShadow = true;
    scene.add(plane);

    buttons = createConsole(scene);

    // Elevation Map
    const lightDir = new THREE.Vector3 (-.5,-.5,.9);
    lightDir.normalize();

    const lightIntensity = 1.25;
    const discret = 2;
    const scaleElevation = 0.15;

    var lightElevationMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        lightDir: { type: '3f', value: lightDir },
        lightIntensity: { value: lightIntensity },
        discret: { value: discret },
        scaleElevation: { value: scaleElevation },
        tex: { value: videoTexture },
        stepPixel: { type: '2f', value: new THREE.Vector2( 1.0/(video.videoWidth-1.0), 1.0/(video.videoHeight-1.0) )},
        colorSpace: {type: "i", value: 1},
        colorChannel: {type: "i", value: 0}
        },

        vertexShader: elevationVertexShader,
        fragmentShader: elevationFragmentShader
    } );

    var scale = 1.0;
    var factor = video.videoHeight/video.videoWidth;
    var planeGeometry = new THREE.PlaneGeometry( scale, scale*factor, video.videoWidth/discret, video.videoHeight/discret );  
    var plane = new THREE.Mesh( planeGeometry, lightElevationMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.position.set(1, 1.8, 0.5);
    plane.rotation.set(-Math.PI/2, 0, -Math.PI/2);

    scene.add(plane);

    // Color Cloud
    /* const colClDiscret = 1;

    var colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: 0}
      }
    });

    geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < video.videoHeight; i += colClDiscret) {
      for (let j = 0; j < video.videoWidth; j += colClDiscret) {
        // positions

        const x = (i+0.5) / video.videoHeight;
        const y = (j+0.5) / video.videoWidth;
        const z = 0;

        positions.push(x, y, z);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();

    const points = new THREE.Points(geometry, colorSpaceMaterial);
    points.position.set(-0.8, 1.8, 0.3);
    points.scale.set(0.5, 0.5, 0.5);
    scene.add(points); */
 
    //video.play();

  };

  video.src = './assets/video/video.mp4';
  video.load();
  video.onloadeddata = videoProcessing;
  video.muted = true;
  video.loop = true;

  // Pick Helper controllers
  const controllerPickHelper = new ControllerPickHelper(scene, renderer);

  controllerPickHelper.addEventListener('selectstart', (event) => {
    if (event.selectedObject){
      console.log('item selected ', event.selectedObject)
    }   
  });

  // Pick Helper mouse
  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('pointerdown', clickButton);

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

  function clickButton(){
    if(pickHelper.pickedObject) {
      switch(pickHelper.pickedObject.name){
        case 'stop':
          video.pause();
          break;
        case 'play':
          video.play();
          break;
        case 'addSecs':
          video.currentTime = video.currentTime + 10;
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

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

