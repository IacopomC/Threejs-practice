import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import 'http://lo-th.github.io/uil/build/uil.js';
import 'http://lo-th.github.io/uil/examples/js/math.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import cornelBox from './cornel_box.js';

var cw = 128*5, ch=148;
var screen = null;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let mouse2d = new THREE.Vector2();

function main() {

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

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
  {
      const color = 0xFFFFFF;
      const intensity = 0.8;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 4, 0);
      scene.add(light);
  }
  {
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
  }

  // Cornel Box
  const corbelBox = cornelBox();
  scene.add(corbelBox);
  
  // Gui
  const interactive = new THREE.Group();
  scene.add(interactive);

  const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 4.625 , 5, 1 ), new THREE.MeshBasicMaterial( { transparent:true } ) );
  plane.geometry.rotateX( -Math.PI90 );
  plane.position.set(4, 0, 7);
  plane.visible = false;
  plane.name = 'p1';

  interactive.add( plane );

  let sets = {
    intensity: 1,
    rotation:0,
    scale:1
  }

  let ui = new UIL.Gui(
              { w:cw, maxHeight:ch, parent:null, isCanvas:true, close:false, transparent:true }
              );

  ui.add( sets, 'intensity', { type:'Circular', min:0, max:10, w:128, precision:2, fontColor:'black' } );
  ui.add( sets, 'rotation', { type:'joystick', w:128, precision:2, fontColor:'black' } );
  ui.add( sets, 'scale', { type:'graph', w:128, precision:2, multiplicator:0.25, fontColor:'black', autoWidth:false } );

  ui.onDraw = function () {

    if( screen === null ){

      screen = new THREE.Texture( this.canvas );
      screen.minFilter = THREE.LinearFilter;
      screen.needsUpdate = true;
      plane.material.map = screen;
      plane.material.needsUpdate = true;
      plane.visible = true;
        
    } else {

      screen.needsUpdate = true;

    }

  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function onMouseUp( e ){

    e.preventDefault();
    if(!controls.enabled) controls.enabled = true;
  
  }
  
  function onMouseDown( e ){
  
    e.preventDefault();
    controls.enabled = raytest( e ) ? false : true;
  
  }
  
  function onMouseMove( e ) {
  
    e.preventDefault();
    raytest( e );
  
  }
  
  function raytest ( e ) {
  
    mouse.set( (e.clientX / window.innerWidth) * 2 - 1, - ( e.clientY / window.innerHeight) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactive.children );
  
    if ( intersects.length > 0 ){
  
       //console.log(intersects[ 0 ])
  
        var uv = intersects[ 0 ].uv;
        mouse2d.x = Math.round( uv.x*cw );
        mouse2d.y = ch - Math.round( uv.y*ch );
  
        if( intersects[ 0 ].object.name === 'p1' ) ui.setMouse( mouse2d );
        return true;
  
    } else {
  
        if(ui)ui.reset( true );
        return false;
    }
  
   
  }
  

  document.addEventListener( 'mouseup', onMouseUp, false );
  document.addEventListener( 'mousedown', onMouseDown, false );
  document.addEventListener( 'mousemove', onMouseMove, false );
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