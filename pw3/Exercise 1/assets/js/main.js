import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';


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
    camera.position.set( 10, 10, 10 );

    // Controls
    const controls = new OrbitControls(camera, canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB1ABA7);

    // Light
    {
        const color = 0xFFFFFF;
        const intensity = 8;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 8;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -2, -4);
        scene.add(light);
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