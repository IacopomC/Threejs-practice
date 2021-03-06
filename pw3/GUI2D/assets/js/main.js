import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import 'http://lo-th.github.io/uil/build/uil.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import cornellBox from './cornell_box.js';

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
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const pointLight = new THREE.PointLight(color, intensity);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add(ambientLight);

    // Cornell Box
    const cornellBoxObj = cornellBox();
    scene.add(cornellBoxObj);

    let sphereCallback = function scaleSphere(value) {
      let sphere = cornellBoxObj.children[7];
      sphere.scale.set(1,1,1).multiplyScalar( value );
    }

    // Gui
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    ui.add( pointLight, 'intensity', { min:0, max:5, rename:'Intensity' } ).listen();
    ui.add( cornellBoxObj.children[6].rotation, 'y',
            { type:'Circular', min:-5, max:5, size:80, rename:'Cylinder Orientation' } ).listen();
    ui.add( 'Knob',
            {name:'Sphere radius',
             callback: sphereCallback, value:1, min:0, max:2}).listen();

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