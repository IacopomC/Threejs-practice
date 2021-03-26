import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

const fontUrl = 'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json';

function colorSpaceConsole(scene) {

    let buttons = [];
    // Add color space console buttons

    createChannelButton(fontUrl, 1.4, 1.9, 0.2, 0, -Math.PI/2, 0, scene, 'Ch 1', 'channel1', buttons);

    createChannelButton(fontUrl, 1.4, 2.0, 0.2, 0, -Math.PI/2, 0, scene, 'Ch 2', 'channel2', buttons);

    createChannelButton(fontUrl, 1.4, 2.1, 0.2, 0, -Math.PI/2, 0, scene, 'Ch 3', 'channel3', buttons);

    createColorSpaceButton(fontUrl, 1.4, 1.9, 0.5, 0, -Math.PI/2, 0, scene, 'RGB', 'RGB', buttons)

    createColorSpaceButton(fontUrl, 1.4, 1.9, 0.8, 0, -Math.PI/2, 0, scene, 'Yxy', 'Yxy', buttons)

    createColorSpaceButton(fontUrl, 1.4, 2.1, 0.5, 0, -Math.PI/2, 0, scene, 'LAB', 'LAB', buttons)

    createColorSpaceButton(fontUrl, 1.4, 2.1, 0.8, 0, -Math.PI/2, 0, scene, 'HSV', 'HSV', buttons)

    return buttons
}

export default colorSpaceConsole;

function createChannelButton(fontUrl, x, y, z, thetax, thetay, thetaz, scene, text, name, buttons) {

    const loader = new THREE.FontLoader();
    // promisify font loading
    function loadFont(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
    }

    async function doit() {
    const font = await loadFont(fontUrl);  
    let geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 3.0,
        height: .2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: .03,
        bevelSegments: 5,
    });

    let material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 'black'
    });
    let mesh = new THREE.Mesh(geometry, material);

    //mesh.scale.set(0.009, 0.009, 0.009);
    mesh.position.set(x-0.05, y, z-0.05);
    mesh.rotation.set(thetax, thetay, thetaz);
    mesh.scale.set(0.008, 0.008, 0.008);

    scene.add(mesh);

    }
    doit();

    const radius = 0.05;
    const widthSegments = 12;
    const heightSegments = 8;

    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0x0000ff
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;

    mesh.position.set(x, y, z);
    mesh.rotation.set(thetax, thetay, thetaz);

    scene.add(mesh);

    buttons.push(mesh);

}

function createColorSpaceButton(fontUrl, x, y, z, thetax, thetay, thetaz, scene, text, name, buttons) {

    const loader = new THREE.FontLoader();
    // promisify font loading
    function loadFont(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
    }

    async function doit() {
    const font = await loadFont(fontUrl);  
    let geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 3.0,
        height: .2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: .03,
        bevelSegments: 5,
    });

    let material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 'black'
    });
    let mesh = new THREE.Mesh(geometry, material);

    //mesh.scale.set(0.009, 0.009, 0.009);
    mesh.position.set(x-0.05, y, z-0.05);
    mesh.rotation.set(thetax, thetay, thetaz);
    mesh.scale.set(0.008, 0.008, 0.008);

    scene.add(mesh);

    }
    doit();

    const width = 0.2;
    const height = 0.1;
    const depth = 0.05;

    const geometry = new THREE.BoxGeometry(width, height, depth);

    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xd15241
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;

    mesh.position.set(x, y, z);
    mesh.rotation.set(thetax, thetay, thetaz);

    scene.add(mesh);

    buttons.push(mesh);

}