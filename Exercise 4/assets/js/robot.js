import * as THREE from '../../../../node_modules/three/build/three.module.js';

function createRobot() {
    let meshes = []

    const baseBodyJoint = new THREE.Object3D();  // base to body joint (rotation limited to y axis)
	const bodyArmJoint = new THREE.Object3D(); // body to arm1 (rotation limited to z axis)
	const armArmJoint = new THREE.Object3D(); // arm1 to arm2 (rotation limited to z axis)
	const armHandJoint = new THREE.Object3D(); // arm2 to hand (rotation limited to z axis)

    let robotJointArray = [];

    return meshes;
}

export default createRobot;