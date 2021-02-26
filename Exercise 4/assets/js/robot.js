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

    const boxGeometryPH1 = new THREE.BoxGeometry(0.03, 0.155, 0.5);
    const pliersHolder1 = new THREE.Mesh(boxGeometryPH1, grey_mesh);
    pliersHolder1.position.set(0.05, 0.2, 3);
    meshes.push(pliersHolder1);

    const boxGeometryPH2 = new THREE.BoxGeometry(0.03, 0.155, 0.5);
    const pliersHolder2 = new THREE.Mesh(boxGeometryPH2, grey_mesh);
    pliersHolder2.position.set(-0.05, 0.2, 1.5);
    meshes.push(pliersHolder2);

    // Pliers grabber base 1 (PGB1)
    const boxGeometryPGB1 = new THREE.BoxGeometry(0.08, 0.155, 0.3);
    const pliersGrabberBase1 = new THREE.Mesh(boxGeometryPGB1, grey_mesh);
    meshes.push(pliersGrabberBase1);
    // Create pivot point between pliers holder 1 and pliers grabber base 1 (PH1 to PGB1)
    /* const pivotPointPH1toPGB1 = new THREE.Object3D();
    pliersHolder1.add(pivotPointPH1toPGB1);
    // Set pliers rotation holder 1 (PCR) as reference for pliers grabber base 1 (PGB1)
    pivotPointPH1toPGB1.add(pliersGrabberBase1);
    pivotPointPH1toPGB1.position.set(0, 0, 0.18);
    pivotPointPH1toPGB1.rotation.x -= Math.PI/6; */
    pliersGrabberBase1.position.set(-0.05, 0, 0.15);
    
    // Pliers grabber base 2 (PGB1)
    const boxGeometryPGB2 = new THREE.BoxGeometry(0.08, 0.155, 0.3);
    const pliersGrabberBase2 = new THREE.Mesh(boxGeometryPGB2, grey_mesh);
    meshes.push(pliersGrabberBase2);
    // Create pivot point between pliers holder 2 and pliers grabber base 2 (PH1 to PGB2)
    const pivotPointPH1toPGB2 = new THREE.Object3D();
    pliersHolder1.add(pivotPointPH1toPGB2);
    // Set pliers rotation holder 2 (PCR) as reference for pliers grabber base 2 (PGB2)
    pivotPointPH1toPGB2.add(pliersGrabberBase2);
    pivotPointPH1toPGB2.position.set(0, 0, -0.18);
    pivotPointPH1toPGB2.rotation.x += Math.PI/6;
    pliersGrabberBase2.position.set(-0.05, 0, -0.15);
    
    // Pliers grabber 1 (PG1)
    const coneGeometryPG1 = new THREE.ConeGeometry(0.05, 0.5, 3);
    const pliersGrabber1 = new THREE.Mesh(coneGeometryPG1, grey_mesh);
    meshes.push(pliersGrabber1);
    // Create pivot point between pliers grabber base 1 and pliers grabber 1 (PGB1 to PG1)
    const pivotPointPGB1toPG1 = new THREE.Object3D();
    pliersGrabberBase1.add(pivotPointPGB1toPG1);
    // Set pliers rotation grabber base 1 (PGB1) as reference for pliers grabber 1 (PG1)
    pivotPointPGB1toPG1.add(pliersGrabber1);
    pliersGrabber1.position.set(0, 0.2, 0.1);
    
    // Pliers grabber 2 (PG2)
    const coneGeometryPG2 = new THREE.ConeGeometry(0.05, 0.5, 3);
    const pliersGrabber2 = new THREE.Mesh(coneGeometryPG2, grey_mesh);
    meshes.push(pliersGrabber2);
    // Create pivot point between pliers grabber base 2 and pliers grabber 2 (PGB1 to PG2)
    const pivotPointPGB2toPG2 = new THREE.Object3D();
    pliersGrabberBase2.add(pivotPointPGB2toPG2);
    // Set pliers rotation grabber base 2 (PGB2) as reference for pliers grabber 2 (PG2)
    pivotPointPGB2toPG2.add(pliersGrabber2);
    pliersGrabber2.position.set(0, 0.2, -0.1);  

    return meshes;
}

export default createRobot;