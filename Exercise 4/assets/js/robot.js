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
    meshes.push(orange_base);
    /* // Create pivot point between base disc and rotation base disc (D1 to D2)
    const pivotPointD1toD2 = new THREE.Object3D();
    gray_base.add(pivotPointD1toD2);
    // Set base disc 1 (D1) as reference for base disc 2 (D2)
    pivotPointD1toD2.add(orange_base);
    // Set position from base disc 2 */
    orange_base.position.set(0, 0.3, 0);
    
    const base_box_geometry = new THREE.BoxGeometry(0.8, 2.0, 0.3);
    const base_box = new THREE.Mesh(base_box_geometry, orange_mesh);
    meshes.push(base_box);
    /* // Create pivot point between base disc 2 and arm 1 (D2 to A1)
    const pivotPointD2toA1 = new THREE.Object3D();
    orange_base.add(pivotPointD2toA1);
    // Set base disc 2 (D2) as reference for arm (A1)
    pivotPointD2toA1.add(arm1); */
    base_box.position.set(-0.4, 0.8, -0.2);
    base_box.rotation.z = Math.PI/4
    
    // Rotation disc 1 (D3)
    const junction_geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    const first_junction = new THREE.Mesh(junction_geometry, grey_mesh);
    meshes.push(first_junction);
 /*    // Create pivot point between arm 1 and rotation disc 1 (A1 to D3)
    const pivotPointA1toD3 = new THREE.Object3D();
    arm1.add(pivotPointA1toD3);
    // Set arm (A1) as reference for rotation disc 1 (D3)
    pivotPointA1toD3.add(rotationDisc1);*/
    first_junction.position.set(-0.9, 1.5, 0);
    first_junction.rotation.x = Math.PI/2
    
    // Decoration disc 1 (D4)
    /* const cylinderGeometryD4 = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 32);
    const rotationDisc2 = new THREE.Mesh(cylinderGeometryD4, grey_mesh);
    meshes.push(rotationDisc2); */
    /* // Create pivot point between rotation disc 1 and decoration disc 1 (D3 to D4)
    const pivotPointD3toD4 = new THREE.Object3D();
    rotationDisc1.add(pivotPointD3toD4);
    // Set rotation disc 1 (D3) as reference for decoration disc 1 (D4)
    pivotPointD3toD4.add(rotationDisc2); */
    //rotationDisc2.position.set(0, 0.3, 0);
    
    // Decoration disc 2 (D5)
/*     const cylinderGeometryD5 = new THREE.CylinderGeometry(0.3, 0.2, 0.1, 32);
    const rotationDisc3 = new THREE.Mesh(cylinderGeometryD5, grey_mesh);
    meshes.push(rotationDisc3); */
    /* // Create pivot point between rotation disc 1 and decoration disc 2 (D3 to D5)
    const pivotPointD3toD5 = new THREE.Object3D();
    rotationDisc1.add(pivotPointD3toD5);
    // Set rotation disc 1 (D3) as reference for decoration disc 2 (D5)
    pivotPointD3toD5.add(rotationDisc3); */
    //rotationDisc3.position.set(0, -0.3, 0);
    
    const first_arm_geometry = new THREE.BoxGeometry(0.8, 3.5, 0.3);
    const first_arm = new THREE.Mesh(first_arm_geometry, orange_mesh);
    meshes.push(first_arm);
    /* // Create pivot point between rotation disc 1 and arm 2 (A2 to D3)
    const pivotPointA2toD3 = new THREE.Object3D();
    rotationDisc1.add(pivotPointA2toD3);
    // Set base disc 2 (D3) as reference for arm (A2)
    pivotPointA2toD3.add(arm2); */
    first_arm.position.set(-2.4, 3, 0.2);
    first_arm.rotation.z = Math.PI/4
    
    // Rotation disc 3 (D6)
    const second_junction = new THREE.Mesh(junction_geometry, grey_mesh);
    meshes.push(second_junction);
    // Create pivot point between arm 2 and rotation disc 3 (A2 to D6)
    /* const pivotPointA2toD6 = new THREE.Object3D();
    arm2.add(pivotPointA2toD6);
    // Set arm (A2) as reference for rotation disc 3 (D6)
    pivotPointA2toD6.add(rotationDisc4); */
    second_junction.position.set(-3.9, 4.5, 0);
    second_junction.rotation.x = Math.PI/2
    
    // Rotation disc 4 (D7)
    /* const second_base_geometry = new THREE.CylinderGeometry(0.15, 0.25, 0.1, 32);
    const second_base = new THREE.Mesh(second_base_geometry, grey_mesh);
    meshes.push(second_base);
    /* // Create pivot point between rotation disc 3 and rotation disc 4 (D6 to D7)
    const pivotPointD6toD7 = new THREE.Object3D();
    rotationDisc4.add(pivotPointD6toD7);
    // Set rotation disc 3 (D6) as reference for rotation disc 4 (D7)
    pivotPointD6toD7.add(rotationDisc5); 
    second_base.position.set(0, 4.5, 1.5); */
    
    // Upper base (UB)
    const second_base_geometry = new THREE.CylinderGeometry(0.4, 0.6, 3, 32);
    const second_base = new THREE.Mesh(second_base_geometry, orange_mesh);
    meshes.push(second_base);
    // Create pivot point between rotation disc 3 and upper base (D6 to UB)
    /* const pivotPointD6toUB = new THREE.Object3D();
    rotationDisc4.add(pivotPointD6toUB);
    // Set rotation disc 3 (D6) as reference for upper base (UB)
    pivotPointD6toUB.add(upperBase); */
    second_base.position.set(-3.5, 4.9, -0.8);
    second_base.rotation.z = -Math.PI/3
    
    /* // Rotation cylinder (RC)
    const second_arm_geometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 32);
    const arm2 = new THREE.Mesh(second_arm_geometry, grey_mesh);
    meshes.push(arm2); */
    /* // Create pivot point between upper base and rotation cylinder (UB to RC)
    const pivotPointUBtoRC = new THREE.Object3D();
    upperBase.add(pivotPointUBtoRC); */
    // Set upper base (UB) as reference for rotation cylinder (RC)
    //pivotPointUBtoRC.add(rotationCylinder);
    //arm2.position.set(-2.5, 4.9, -0.8);
    
    // Pliers base (PB)
/*     const boxGeometryPB = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const pliersBase = new THREE.Mesh(boxGeometryPB, orange_mesh);
    meshes.push(pliersBase); */
    /* // Create pivot point between Rotation cylinder and pliers base (RC to PB)
    const pivotPointRCtoPB = new THREE.Object3D();
    rotationCylinder.add(pivotPointRCtoPB);
    // Set rotation cylinder (RC) as reference for pliers base (PB)
    pivotPointRCtoPB.add(pliersBase); */
    //pliersBase.position.set(0, 0.7, 0);
    
    // Pliers disc 1 (PD1)
 /*    const second_arm_geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const second_arm = new THREE.Mesh(second_arm_geometry, orange_mesh);
    meshes.push(second_arm);
    // Create pivot point between pliers base and pliers disc 1 (PB to PD1)
    /* const pivotPointPBtoPD1 = new THREE.Object3D();
    pliersBase.add(pivotPointPBtoPD1); 
    // Set pliers base (PB) as reference for pliers disc 1 (PD1)
    //pivotPointPBtoPD1.add(pliersDisc1);
    second_arm.position.set(0.0, 0.23, 1.5);
    second_arm.rotation.x += Math.PI/2; */
    
    // Pliers disc 2 (PD2)
/*     const cylinderGeometryPD2 = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const pliersDisc2 = new THREE.Mesh(cylinderGeometryPD2, orange_mesh);
    meshes.push(pliersDisc2);
    // Create pivot point between pliers base and pliers disc 2 (PB to PD2)
    /* const pivotPointPBtoPD2 = new THREE.Object3D();
    pliersBase.add(pivotPointPBtoPD2);
    // Set pliers base (PB) as reference for pliers disc 2 (PD2)
    //pivotPointPBtoPD2.add(pliersDisc2);
    pliersDisc2.position.set(0.0, 0.23, -0.175);
    pliersDisc2.rotation.x += Math.PI/2; */
    
    // Pliers rotation cylinder (PRC)
    const second_arm_geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
    const second_arm = new THREE.Mesh(second_arm_geometry, grey_mesh);
    meshes.push(second_arm);
    // Create pivot point between pliers base and pliers rotation cylinder (PB to PRC)
    //const pivotPointPBtoPRC = new THREE.Object3D();
    //pliersBase.add(pivotPointPBtoPRC);
    // Set pliers base (PB) as reference for pliers rotation cylinder (PRC)
/*     pivotPointPBtoPRC.add(pliersRotationCylinder);
    pivotPointPBtoPRC.position.set(0.0, 0.3, 0); */
    second_arm.position.set(-1.5, 6.1, -0.8);
    second_arm.rotation.z = -Math.PI/3;
    
    // Pliers decoration cylinder 2 (PDC)
/*     const cylinderGeometryPDC = new THREE.CylinderGeometry(0.2, 0.155, 0.15, 32);
    const pliersDecorationCylinder2 = new THREE.Mesh(cylinderGeometryPDC, orange_mesh);
    meshes.push(pliersDecorationCylinder2);
    // Create pivot point between pliers decoration cylinder and pliers decoration cylinder 2 (PRC to PDC)
    const pivotPointPRCtoPDC = new THREE.Object3D();
    pliersRotationCylinder.add(pivotPointPRCtoPDC);
    // Set pliers decoration cylinder (PCR) as reference for pliers decoration cylinder 2 (PDC)
    pivotPointPRCtoPDC.add(pliersDecorationCylinder2);
    pliersDecorationCylinder2.position.set(0.0, 0.05, 3); */
    
    // Pliers holder 1 (PH1)
    const boxGeometryPH1 = new THREE.BoxGeometry(0.03, 0.155, 0.5);
    const pliersHolder1 = new THREE.Mesh(boxGeometryPH1, grey_mesh);
    meshes.push(pliersHolder1);
    // Create pivot point between pliers rotation cylinder and pliers holder 1 (PRC to PH1)
    /* const pivotPointPRCtoPH1 = new THREE.Object3D();
    pliersRotationCylinder.add(pivotPointPRCtoPH1);
    // Set pliers rotation cylinder (PCR) as reference for pliers holder 1 (PH1)
    pivotPointPRCtoPH1.add(pliersHolder1); */
    pliersHolder1.position.set(0.05, 0.2, 3);
    
    // Pliers holder 2 (PH2)
    const boxGeometryPH2 = new THREE.BoxGeometry(0.03, 0.155, 0.5);
    const pliersHolder2 = new THREE.Mesh(boxGeometryPH2, grey_mesh);
    meshes.push(pliersHolder2);
    // Create pivot point between pliers rotation cylinder and pliers holder 2 (PRC to PH2)
    /* const pivotPointPRCtoPH2 = new THREE.Object3D();
    pliersRotationCylinder.add(pivotPointPRCtoPH2);
    // Set pliers rotation cylinder (PCR) as reference for pliers holder 2 (PH2)
    pivotPointPRCtoPH2.add(pliersHolder2); */
    pliersHolder2.position.set(-0.05, 0.2, 1.5);
    
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