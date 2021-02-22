import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import vertices from './vertices.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    var controls = new OrbitControls( camera, renderer.domElement );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const numVertices = vertices.length;
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    const positions = new Float32Array(numVertices * positionNumComponents);
    const normals = new Float32Array(numVertices * normalNumComponents);
    const uvs = new Float32Array(numVertices * uvNumComponents);
    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;
    for (const vertex of vertices) {
        positions.set(vertex.pos, posNdx);
        normals.set(vertex.norm, nrmNdx);
        uvs.set(vertex.uv, uvNdx);
        posNdx += positionNumComponents;
        nrmNdx += normalNumComponents;
        uvNdx += uvNumComponents;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(uvs, uvNumComponents));

    const geometryTriangles = [];

    for (let i = 0; i < vertices.length; i+=4) {
        let planeTriangle = [i,i+1,i+2,i+2,i+1,i+3]
        geometryTriangles.push(...planeTriangle)
    }

    geometry.setIndex(geometryTriangles);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./img/grenouille.jpg');

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color: color, map: texture});

        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        cube.position.x = x;
        cube.rotation.y = -Math.PI/2;
        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0xFFFFFF,  0),
    ];


    function render() {

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
