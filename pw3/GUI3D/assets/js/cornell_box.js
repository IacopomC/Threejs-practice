import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function cornellBox() {

    // Meshes
    const cone_material =  new THREE.MeshLambertMaterial( {
        color: 0xE55C08,
    });

    const cylinder_material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
      });

    const sphere_material = new THREE.MeshPhysicalMaterial({
        color: 0x0000FF,
     });

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

    const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), cone_material);
    cone.position.set(-1, 1, -1);

    box_group.add(cone);

    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), cylinder_material);
    cylinder.position.set(2, 1, 0);

    box_group.add(cylinder);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), sphere_material);
    sphere.position.set(0, 1, 2);

    box_group.add(sphere);

    return box_group;
}

function createWallMaterial(color) {
    const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    return material;
}

export default cornellBox;