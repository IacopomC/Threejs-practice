import * as THREE from '../../../../../node_modules/three/build/three.module.js';

import 'https://lo-th.github.io/uil/build/uil.js';

function addGui(pointLight, cornellBoxObj) {

    const sphere = cornellBoxObj.children[7];
    const cylinder = cornellBoxObj.children[6];
    const cone = cornellBoxObj.children[5];

    // Gui
    var ui = new UIL.Gui( { css:'top:10px; left:20%;', size:300, center:true } );
    // Light intensity
    ui.add( pointLight, 'intensity', { min:0, max:5, rename:'Intensity' } ).listen();
    // Wireframe
    ui.add('bool', { name:'Wireframe', }).onChange(
      function(value){
        sphere.material.wireframe = value;
        cone.material.wireframe = value;
        cylinder.material.wireframe = value;
      }
    );
    // Reflectivity
    ui.add('slide', { min:0, max:1, value: 0.5, rename:'Reflective' }).onChange(
      function(value){
        sphere.material.reflectivity = value;
        cone.material.reflectivity = value;
        cylinder.material.reflectivity = value;
      }
    );
    // Color
    ui.add('color', { name:'Color', type:'rgba', value:[0,1,1,1]}).onChange(
      function(color){
        sphere.material.color.setHex(color);
        cone.material.color.setHex(color);
        cylinder.material.color.setHex(color);
      }
    );
    // Map
    const texture = new THREE.TextureLoader().load('./assets/img/earth.jpg');
    ui.add('bool', { name:'Map'}).onChange(
      function(v){
        if (v) {
          sphere.material.color.setHex(0xFFFFFF);
          cone.material.color.setHex(0xFFFFFF);
          cylinder.material.color.setHex(0xFFFFFF);

          sphere.material.map = texture;
          cone.material.map = texture;
          cylinder.material.map = texture;
        }
        else{
          sphere.material.color.setHex(0x0000FF);
          cone.material.color.setHex(0xE55C08);
          cylinder.material.color.setHex(0xFF0000);

          sphere.material.map = null;
          cone.material.map = null;
          cylinder.material.map = null;
        }
        sphere.material.needsUpdate = true;
        cone.material.needsUpdate = true;
        cylinder.material.needsUpdate = true;
      }
    );

    // Alpha Map
    const textureChain = new THREE.TextureLoader().load('./assets/img/chainlink.png');
    const textureChainAlpha = new THREE.TextureLoader().load('./assets/img/chainlink_alpha.png');
    ui.add('bool', { name:'Alpha Map'}).onChange(
      function(v){
        if (v) {
          sphere.material.color.setHex(0xFFFFFF);
          cone.material.color.setHex(0xFFFFFF);
          cylinder.material.color.setHex(0xFFFFFF);

          sphere.material.map = textureChain;
          cone.material.map = textureChain;
          cylinder.material.map = textureChain;

          sphere.material.alphaMap = textureChainAlpha;
          cone.material.alphaMap = textureChainAlpha;
          cylinder.material.alphaMap = textureChainAlpha;

          sphere.material.transparent = true;
          cone.material.transparent = true;
          cylinder.material.transparent = true;
        }
        else{
          sphere.material.color.setHex(0x0000FF);
          cone.material.color.setHex(0xE55C08);
          cylinder.material.color.setHex(0xFF0000);

          sphere.material.map = null;
          cone.material.map = null;
          cylinder.material.map = null;

          sphere.material.alphaMap = null;
          cone.material.alphaMap = null;
          cylinder.material.alphaMap = null;

          sphere.material.transparent = false;
          cone.material.transparent = false;
          cylinder.material.transparent = false;
        }
        sphere.material.needsUpdate = true;
        cone.material.needsUpdate = true;
        cylinder.material.needsUpdate = true;
      }
    );

}

export default addGui;