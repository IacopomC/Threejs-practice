import {colorCloudVertexShader, colorCloudFragmentShader} from "./shaders.js";
import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function colorCloud(scene, video, videoTexture, colorSpace) {
    const colClDiscret = 1;

    var colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: colorSpace}
      }
    });

    const geometry = new THREE.BufferGeometry();
    const positions = [];
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

    const points = new THREE.Points(geometry, colorSpaceMaterial);
    points.position.set(-0.8, 1.8, 0.3);
    points.scale.set(0.5, 0.5, 0.5);
    scene.add(points); 
}

export default colorCloud;