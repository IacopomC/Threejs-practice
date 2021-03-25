import * as THREE from '../../../../../node_modules/three/build/three.module.js';


function colorSpaceConsole(scene) {

    let buttons = [];
    // Add color space console buttons
    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 1.9, 0.2, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 1.9, 0.5, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 1.9, 0.8, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.1, 0.2, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.1, 0.5, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.1, 0.8, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.3, 0.2, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.3, 0.5, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
    }

    {
        const width = 0.2;
        const height = 0.1;
        const depth = 0.05;
        addSolidGeometry(1.4, 2.3, 0.8, 0, Math.PI/2, 0,
            new THREE.BoxGeometry(width, height, depth), 0xd15241, scene,
            buttons, 'stop');
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