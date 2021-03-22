import * as THREE from '../../../../../node_modules/three/build/three.module.js';
import { RectAreaLightUniformsLib } from '../../../../../node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'

function addWallsLight(scene) {
    // Call RectAreaLightUniformsLib
    RectAreaLightUniformsLib.init();

    // Add RectAreaLight left wall
    const width = 6;
    const height = 6;
    const rectIntensity = 0.2;
    const rectLightLeft = new THREE.RectAreaLight( 0xFF0000, rectIntensity,  width, height );
    rectLightLeft.position.set( -3, 3, 0 );
    rectLightLeft.rotation.set(0, Math.PI/2 , 0);
    rectLightLeft.lookAt( 0, 0, 0 );
    scene.add( rectLightLeft )

    // Add RectAreaLight right wall
    const rectLightRight = new THREE.RectAreaLight( 0x009D00, rectIntensity,  width, height );
    rectLightRight.position.set( 3, 3, 0 );
    rectLightRight.rotation.set(0, Math.PI/2 , 0);
    rectLightRight.lookAt( 0, 0, 0 );
    scene.add( rectLightRight )

    // Add RectAreaLight back wall
    const rectLightBack = new THREE.RectAreaLight( 0xffffff, rectIntensity,  width, height );
    rectLightBack.position.set( 0, 3, 3 );
    rectLightBack.lookAt( 0, 0, 0 );
    scene.add( rectLightBack )

}

export default addWallsLight;