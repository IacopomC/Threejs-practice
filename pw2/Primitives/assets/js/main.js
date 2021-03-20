import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createPrimitives from './primitives.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    THREE.Object3D.DefaultUp.set(0, 0, 1);

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(200, 200, 220);

    // Controls
    const controls = new OrbitControls(camera, canvas);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21272e);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -2, -4);
        scene.add(light);
    }

    initMeshes(scene);

    {
        const c = 0.6; //coverage
        let step;
        let points = [];
        let  centers = [];
        const size = 100;
        for (var i = -size; i <= size; i+=7){
            for (var j = -size; j <= size; j+=7){
                points.push(new THREE.Vector3(i, j, 0));
            }
        }


        step = points[0].distanceTo(points[1]);
        points.forEach((point) => {
            centers.push(new THREE.Vector3(point.x - (c*step/2), point.y, 0));
            centers.push(new THREE.Vector3(point.x + (c*step/2), point.y, 0));
            let geometry = new THREE.BufferGeometry().setFromPoints( centers );
            const material = new THREE.LineBasicMaterial( {
                color: 0xffffff,
                linewidth: 1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round' //ignored by WebGLRenderer
            } );
            let line = new THREE.Line(geometry, material);
            line.computeLineDistances();
            scene.add(line);
            
            centers = [];
            centers.push(new THREE.Vector3(point.x, point.y - (c*step/2), 0));
            centers.push(new THREE.Vector3(point.x, point.y + (c*step/2), 0));
            geometry = new THREE.BufferGeometry().setFromPoints( centers );
            line = new THREE.Line(geometry, material);
            line.computeLineDistances();
            scene.add(line);
            
            centers = [];
        });   

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

function initMeshes(scene) {
    const primitives_arr = [];
    primitives_arr.push(createPrimitives(0.5));
    primitives_arr.push(createPrimitives(1.5));
    primitives_arr.push(createPrimitives(2.5));

    primitives_arr.forEach((primitive_gr) => {
        primitive_gr.forEach((primitive) => {
            scene.add(primitive);
        });
    });
}

main();
