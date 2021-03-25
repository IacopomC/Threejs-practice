import {elevationVertexShader, elevationFragmentShader} from "./shaders.js";
import * as THREE from '../../../../../node_modules/three/build/three.module.js';

function elevationMap (scene, video, videoTexture, colorSpace, colorChannel) {

    // Elevation Map
    const lightDir = new THREE.Vector3 (-.5,-.5,.9);
    lightDir.normalize();

    const lightIntensity = 1.25;
    const discret = 2;
    const scaleElevation = 0.15;

    var lightElevationMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        lightDir: { type: '3f', value: lightDir },
        lightIntensity: { value: lightIntensity },
        discret: { value: discret },
        scaleElevation: { value: scaleElevation },
        tex: { value: videoTexture },
        stepPixel: { type: '2f', value: new THREE.Vector2( 1.0/(video.videoWidth-1.0), 1.0/(video.videoHeight-1.0) )},
        colorSpace: {type: "i", value: colorSpace},
        colorChannel: {type: "i", value:colorChannel}
        },

        vertexShader: elevationVertexShader,
        fragmentShader: elevationFragmentShader
    } );

    var scale = 1.0;
    var factor = video.videoHeight/video.videoWidth;
    var planeGeometry = new THREE.PlaneGeometry( scale, scale*factor, video.videoWidth/discret, video.videoHeight/discret );  
    var plane = new THREE.Mesh( planeGeometry, lightElevationMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.position.set(1, 1.8, 0.5);
    plane.rotation.set(-Math.PI/2, 0, -Math.PI/2);

    scene.add(plane);

    return plane;
}

export default elevationMap;