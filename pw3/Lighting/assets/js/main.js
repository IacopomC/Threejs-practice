import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import 'http://lo-th.github.io/uil/build/uil.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import cornellBox from './cornell_box.js';

const lightTypes = ['Point Light', 'Directional Light', 'Spot Light', 'Hemisphere Light'];

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

    // Lights
    const pointLight = new THREE.PointLight();
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xFFFFFF, 0);
    spotLight.position.set(0, 6, 0);
    scene.add(spotLight);

    const hemisphereLight = new THREE.HemisphereLight();
    hemisphereLight.visible = false;
    scene.add(hemisphereLight);

    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add(ambientLight);

    // Cornell Box
    const cornellBoxObj = cornellBox();
    scene.add(cornellBoxObj);

    // Define change light callback
    let changeLightCallback = function changeLight(value) {
      switch (value) {
        case 'Point Light':
          pointLight.intensity = 1;
          directionalLight.intensity = 0;
          spotLight.intensity = 0;
          hemisphereLight.visible = false;
          break;
        case 'Directional Light':
          pointLight.intensity = 0;
          directionalLight.intensity = 1;
          spotLight.intensity = 0;
          hemisphereLight.visible = false;
          break;
        case 'Spot Light':
          pointLight.intensity = 0;
          directionalLight.intensity = 0;
          spotLight.intensity = 1;
          hemisphereLight.visible = false;
          break;
        case 'Hemisphere Light':
          pointLight.intensity = 0;
          directionalLight.intensity = 0;
          spotLight.intensity = 0;
          hemisphereLight.visible = true;
          break;
        default:
          pointLight.intensity = 1;
          directionalLight.intensity = 0;
          spotLight.intensity = 0;
          hemisphereLight.visible = false;
      }
    }

    // Gui
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    ui.add( 'list', {name:'Light', list:lightTypes}).onChange(changeLightCallback);
    ui.add( pointLight, 'intensity', { min:0, max:5, rename:'Intensity' } ).listen();
    ui.add('color', { name:'Color', type:'rgba', value:[0,1,1,1]}).onChange(
      function(color){
        pointLight.color.setHex(color);
      });

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