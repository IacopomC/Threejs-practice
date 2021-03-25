import * as THREE from '../../../../../node_modules/three/build/three.module.js';


function colorSpaceConsole(scene) {

    let buttons = [];
    // Add color space console buttons

    {
        const radius = 0.05;
        const widthSegments = 12;
        const heightSegments = 8;
        addSolidGeometry(1.4, 1.9, 0.2, 0, 0, 0,
            new THREE.SphereGeometry(radius, widthSegments, heightSegments), 0x0000ff, scene,
            buttons, 'channel1');
    }

    {
        const radius = 0.05;
        const widthSegments = 12;
        const heightSegments = 8;
        addSolidGeometry(1.4, 2.0, 0.2, 0, 0, 0,
            new THREE.SphereGeometry(radius, widthSegments, heightSegments), 0x0000ff, scene,
            buttons, 'channel2');
    }

    {
        const radius = 0.05;
        const widthSegments = 12;
        const heightSegments = 8;
        addSolidGeometry(1.4, 2.1, 0.2, 0, 0, 0,
            new THREE.SphereGeometry(radius, widthSegments, heightSegments), 0x0000ff, scene,
            buttons, 'channel3');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 1.9, 0.5, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'RGB');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 1.9, 0.8, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'Yxy');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.1, 0.5, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'LAB');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.1, 0.8, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'HSV');
    }

    return buttons
}

export default colorSpaceConsole;

function addSolidGeometry(x, y, z, thetax, thetay, thetaz, geometry, color, scene, buttons, name) {
    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: color
    });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(x, y, z, thetax, thetay, thetaz, mesh, scene, buttons, name);
}

function addObject(x, y, z, thetax, thetay, thetaz, obj, scene, buttons, name) {
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    obj.name = name;

    obj.receiveShadow = true;
    obj.castShadow = true;

    obj.rotation.set(thetax, thetay, thetaz);

    scene.add(obj);
    buttons.push(obj);
}

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
    mesh.position.set(x, y, z);
    mesh.rotation.set(thetax, thetay, thetaz);

    scene.add(mesh);

    const radius = 0.05;
    const widthSegments = 12;
    const heightSegments = 8;

    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0x0000ff
    });

    mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;

    mesh.position.set(x, y, z);
    mesh.rotation.set(thetax, thetay, thetaz);

    scene.add(mesh);

    buttons.push(mesh);

    }
    doit();

}