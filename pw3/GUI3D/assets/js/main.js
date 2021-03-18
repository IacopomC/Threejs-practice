import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import 'http://lo-th.github.io/uil/build/uil.js';
import 'http://lo-th.github.io/uil/examples/js/math.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import cornelBox from './cornel_box.js';

var screen = null;

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );

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

    const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 4.625 , 5, 1 ), new THREE.MeshBasicMaterial( { transparent:true } ) );
    plane.geometry.rotateX( -Math.PI90 );
    plane.position.z = 1;
    plane.visible = false;

    // Cornel Box
    const corbelBox = cornelBox();
    scene.add(corbelBox);

    // Gui
    let cw = 128*5, ch=148;

    let sets = {
      intensity: 1,
      rotation:0,
      scale:1
    }

    let ui = new UIL.Gui(
                { w:cw, maxHeight:ch, parent:null, isCanvas:true, close:false, transparent:true }
                );

    ui.add( sets, 'intensity', { type:'Circular', min:0, max:10, w:128, precision:2, fontColor:'#D4B87B' } );
    ui.add( sets, 'rotation', { type:'joystick', w:128, precision:2, fontColor:'#D4B87B' } );
    ui.add( sets, 'scale', { type:'graph', w:128, precision:2, multiplicator:0.25, fontColor:'#D4B87B', autoWidth:false } );

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

    function render(time) {
        time *= 0.001;  // convert to seconds;
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        
        renderer.render(scene, camera);
    
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
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