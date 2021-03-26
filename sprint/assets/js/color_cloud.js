import {colorCloudVertexShader, colorCloudFragmentShader} from "./shaders.js";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function colorCloud(scene, video, videoTexture, colorSpace, ccLab) {
    const colClDiscret = 1;

    let colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: colorSpace},
        ccLab: {value: ccLab},
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

    // Add axis
    const axesHelper = new THREE.AxesHelper( 0.7 );
    axesHelper.position.set(-0.8, 1.55, 0.3);
    axesHelper.scale.set(0.7, 0.7, 0.7);
    scene.add( axesHelper );

    // Add grid 
    const size = 1.0;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions );
    gridHelper.position.set(-0.8, 1.55, 0.3);
    gridHelper.scale.set(0.5, 0.5, 0.5);
    scene.add( gridHelper );
    
    colorSpaceMaterial = new THREE.ShaderMaterial({
      vertexShader: colorCloudVertexShader,
      fragmentShader: colorCloudFragmentShader,
      uniforms: {
        tex: { value: videoTexture },
        colorSpace: {value: colorSpace},
        ccLab: {value: ccLab},
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

    let pointsShadow = new THREE.Points(geometry, colorSpaceMaterial);
    pointsShadow.position.set(-0.8, 1.8, 0.3);
    pointsShadow.scale.set(0.5, 0.5, 0.5);
    scene.add(pointsShadow);

    return [points, pointsShadow];
}

export default colorCloud;