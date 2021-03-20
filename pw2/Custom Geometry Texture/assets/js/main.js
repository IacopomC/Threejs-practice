import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import vertices from './vertices.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(3, 3, 3);

    var controls = new OrbitControls( camera, renderer.domElement );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    // Light
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

    // Define array with vertices coordinates
    const verticesCoord = vertices;

    // Retrieve length for each attribute
    const posLength = verticesCoord[0].pos.length;
    const normLength = verticesCoord[0].norm.length;
    const uvLength = verticesCoord[0].uv.length;

    // Initialize Float32Array
    const position = new Float32Array(verticesCoord.length * posLength);
    const normal = new Float32Array(verticesCoord.length * normLength);
    const uvs = new Float32Array(verticesCoord.length * uvLength);

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, posLength));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normal, normLength));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, uvLength));

    let indexPos = 0;
    let indexNorm = 0;
    let indexUV = 0;

    vertices.forEach((vertex) => {
        position.set(vertex.pos, indexPos);
        normal.set(vertex.norm, indexNorm);
        uvs.set(vertex.uv, indexUV);
        indexPos += posLength;
        indexNorm += normLength;
        indexUV += uvLength;
    });

    const trianglesIndexes = [];

    for (let i = 0; i < verticesCoord.length; i+=4) {
        let indexes = [i,i+1,i+2,i+2,i+1,i+3];
        trianglesIndexes.push(...indexes);
    }

    geometry.setIndex(trianglesIndexes);

    const loader = new THREE.TextureLoader();
    function loadTexture(url) {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
    }

    async function createCube() {

        const texture = await loadTexture('./assets/img/grenouille.jpg');
        const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, map: texture});

        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        
    }

    createCube(geometry);

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

main();
