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

    const sphere = cornellBoxObj.children[7];
    const cylinder = cornellBoxObj.children[6];
    const cone = cornellBoxObj.children[5];

    // Gui
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    // Light intensity
    ui.add( pointLight, 'intensity', { min:0, max:5, rename:'Intensity' } ).listen();
    // Wireframe
    ui.add('bool', { name:'Wireframe', }).onChange(
      function(value){
        sphere.material.wireframe = value;
        cylinder.material.wireframe = value;
      }
    );
    
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