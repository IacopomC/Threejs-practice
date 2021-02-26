import * as THREE from '../../../../node_modules/three/build/three.module.js';

function createRobot() {
    let meshes = []

    // Mesh different colors
    const orange_mesh =  new THREE.MeshStandardMaterial( {
        color: 0xE55C08,
        metalness: 1.0,
        normalScale: 1.0
    });
  
    const grey_mesh =  new THREE.MeshStandardMaterial( {
        color: 0x756C6A,
        metalness: 1.0,
        normalScale: 1.0
    });
  
    // Robot primitives
    const grey_base_geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const gray_base = new THREE.Mesh(grey_base_geometry, grey_mesh);
    gray_base.position.set(0, 0, 0);
    meshes.push(gray_base);
  
    const orange_base_geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const orange_base = new THREE.Mesh(orange_base_geometry, orange_mesh);
    orange_base.position.set(0, 0.3, 0);
    meshes.push(orange_base);
    
    const base_box_geometry = new THREE.BoxGeometry(0.8, 2.0, 0.3);
    const base_box = new THREE.Mesh(base_box_geometry, orange_mesh);
    base_box.position.set(-0.4, 0.8, -0.2);
    base_box.rotation.z = Math.PI/4
    meshes.push(base_box);

    const junction_geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    const first_junction = new THREE.Mesh(junction_geometry, grey_mesh);
    first_junction.position.set(-0.9, 1.5, 0);
    first_junction.rotation.x = Math.PI/2
    meshes.push(first_junction);
    
    const first_arm_geometry = new THREE.BoxGeometry(0.8, 3.5, 0.3);
    const first_arm = new THREE.Mesh(first_arm_geometry, orange_mesh);
    first_arm.position.set(-2.4, 3, 0.2);
    first_arm.rotation.z = Math.PI/4
    meshes.push(first_arm);
 
    const second_junction = new THREE.Mesh(junction_geometry, grey_mesh);
    second_junction.position.set(-3.9, 4.5, 0);
    second_junction.rotation.x = Math.PI/2
    meshes.push(second_junction);

    const second_base_geometry = new THREE.CylinderGeometry(0.4, 0.6, 3, 32);
    const second_base = new THREE.Mesh(second_base_geometry, orange_mesh);
    second_base.position.set(-3.5, 4.9, -0.8);
    second_base.rotation.z = -Math.PI/3
    meshes.push(second_base);
    
    const second_arm_geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const second_arm = new THREE.Mesh(second_arm_geometry, grey_mesh);
    second_arm.position.set(-1.5, 6.1, -0.8);
    second_arm.rotation.z = -Math.PI/3;
    meshes.push(second_arm);

    return meshes;
}

export default createRobot;