import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function cornelBox() {

    // Meshes
    const cone_material =  new THREE.MeshLambertMaterial( {
        color: 0xE55C08,
    });

    const cylinder_material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
      });

    const sphere_material = new THREE.MeshPhysicalMaterial({ });

    const box_group = new THREE.Group();

    // Geometry
    const plane_geometry = new THREE.PlaneGeometry(6, 6);

    const left_wall = new THREE.Mesh(plane_geometry, createWallMaterial(0xFF0000));
    left_wall.position.set(-3, 3, 0);
    left_wall.rotation.set(0, Math.PI/2 , 0);

    box_group.add(left_wall);

    const right_wall = new THREE.Mesh(plane_geometry, createWallMaterial(0x009D00));
    right_wall.position.set(3, 3, 0);
    right_wall.rotation.set(0, Math.PI/2 , 0);

    box_group.add(right_wall);

    const back_wall = new THREE.Mesh(plane_geometry, createWallMaterial('white'));
    back_wall.position.set(0, 3, -3);

    box_group.add(back_wall);

    const floor = new THREE.Mesh(plane_geometry, createWallMaterial('white'));
    floor.position.set(0, 0, 0);
    floor.rotation.set(Math.PI/2, 0, 0);

    box_group.add(floor);

    const ceiling = new THREE.Mesh(plane_geometry, createWallMaterial('white'));
    ceiling.position.set(0, 6, 0);
    ceiling.rotation.set(Math.PI/2, 0, 0);

    box_group.add(ceiling);

    return box_group;
}

function createWallMaterial(color) {
    const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    return material;
}

export default cornelBox;