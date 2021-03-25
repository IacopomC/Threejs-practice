import {colorCloudVertexShader, colorCloudFragmentShader} from "./shaders.js";
import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function colorCloud(scene, video, videoTexture, colorSpace) {
    const colClDiscret = 1;

    let colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: colorSpace},
        shadow : {value: 1.0}
      }
    });

    let geometry = new THREE.BufferGeometry();
    let positions = [];
    for (let i = 0; i < video.videoHeight; i += colClDiscret) {
      for (let j = 0; j < video.videoWidth; j += colClDiscret) {
        // positions

        const x = (i+0.5) / video.videoHeight;
        const y = (j+0.5) / video.videoWidth;
        const z = 0;

        positions.push(x, y, z);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();

    let points = new THREE.Points(geometry, colorSpaceMaterial);
    points.position.set(-0.8, 1.8, 0.3);
    points.scale.set(0.5, 0.5, 0.5);
    scene.add(points);
    
    colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: colorSpace},
        shadow : {value: 0.0}
      }
    });

    geometry = new THREE.BufferGeometry();
    positions = [];
    for (let i = 0; i < video.videoHeight; i += colClDiscret) {
      for (let j = 0; j < video.videoWidth; j += colClDiscret) {
        // positions

        const x = (i+0.5) / video.videoHeight;
        const y = (j+0.5) / video.videoWidth;
        const z = 0;

        positions.push(x, y, z);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();

    points = new THREE.Points(geometry, colorSpaceMaterial);
    points.position.set(-0.8, 1.8, 0.3);
    points.scale.set(0.5, 0.5, 0.5);
    scene.add(points);
}

export default colorCloud;