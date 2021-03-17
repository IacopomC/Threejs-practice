import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import './uil/uil.js'
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import cornelBox from './cornel_box.js';

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

    // Gui
    var obj1 = { speed: 5 };
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    ui.add( obj1, 'speed', { min:-5, max:5, rename:'speed R' } ).listen();
    ui.add( obj1, 'speed', { min:-5, max:5, stype:1 } ).listen();
    ui.add( obj1, 'speed', { min:-5, max:5, stype:2 } ).listen();
    ui.add( obj1, 'speed', { type:'Circular', min:-5, max:5, size:120 } ).listen();
    ui.add( obj1, 'speed', { type:'Knob', min:-5, max:5, size:120 } ).listen();

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