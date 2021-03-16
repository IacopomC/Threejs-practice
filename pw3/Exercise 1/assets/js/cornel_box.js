import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function cornelBox() {

    // Meshes
    const cone_material =  new THREE.MeshLambertMaterial( {
        color: 0xE55C08,
        metalness: 1.5,
        normalScale: 1.0
    });

    const cylinder_material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        flatShading: true,
      });


    const sphere_material = new THREE.MeshPhysicalMaterial({ });

}

export default cornelBox;