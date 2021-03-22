import * as THREE from '../../../../../node_modules/three/build/three.module.js';

import 'https://lo-th.github.io/uil/build/uil.js';
import 'https://lo-th.github.io/uil/examples/js/math.js';

function createGui(scene, pointLight, cornellBoxObj){

    var cw = 120*3, ch=170;
    var screen = null;

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let mouse2d = new THREE.Vector2();

    const sphere = cornellBoxObj.children[7];
    const cylinder = cornellBoxObj.children[6];
    const cone = cornellBoxObj.children[5];

    // Gui 3D
    const interactive = new THREE.Group();
    scene.add(interactive);

    const plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 3, 2 ), new THREE.MeshBasicMaterial( { transparent:true } ) );
    plane.position.set(1, 3, -2);
    plane.visible = false;
    plane.name = 'p1';

    interactive.add( plane );

    let ui3D = new UIL.Gui( { w:cw, maxHeight:ch, parent:null, isCanvas:true, close:true, transparent:true });
    // Light intensity
    ui3D.add( pointLight, 'intensity',
    { type:'slide', titleColor:'black', min:0, max:10, precision:1, fontColor:'black'} ).listen();
    // Wireframe
    ui3D.add('bool', { name:'Wireframe', titleColor:'black' }).onChange(
        function(value){
        sphere.material.wireframe = value;
        cone.material.wireframe = value;
        cylinder.material.wireframe = value;
        }
    );

    // Map
    const texture = new THREE.TextureLoader().load('./assets/img/earth.jpg');
    ui3D.add('bool', { name:'Map', titleColor:'black'}).onChange(
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
    ui3D.add('bool', { name:'Alpha Map', titleColor:'black'}).onChange(
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

    // Light Shadow Properties
    ui3D.add( pointLight.shadow.mapSize, 'x', { min:0, max:512, value:512, rename:'Shadow X', titleColor:'black', color: 'black'} ).listen();
    ui3D.add( pointLight.shadow.mapSize, 'y', { min:0, max:512, value:512, rename:'Shadow Y', titleColor:'black', color: 'black'} ).listen();
    ui3D.add( pointLight.shadow, 'radius', { min:0, max:100, value:1, rename:'Shadow R', titleColor:'black', color: 'black'} ).listen();

    ui3D.onDraw = function () {

        if( screen === null ){

        screen = new THREE.Texture( this.canvas );
        screen.minFilter = THREE.LinearFilter;
        screen.needsUpdate = true;
        plane.material.map = screen;
        plane.material.needsUpdate = true;
        plane.visible = true;
            
        } else {

        screen.needsUpdate = true;

        }

    }

    function raytest ( e ) {
  
    mouse.set( (e.clientX / window.innerWidth) * 2 - 1, - ( e.clientY / window.innerHeight) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactive.children );
  
    if ( intersects.length > 0 ){
    
      var uv = intersects[ 0 ].uv;
      mouse2d.x = Math.round( uv.x*cw );
      mouse2d.y = ch - Math.round( uv.y*ch );

      if( intersects[ 0 ].object.name === 'p1' ) ui3D.setMouse( mouse2d );
      return true;
  
    } else {
  
        if(ui3D)ui3D.reset( true );
        return false;
    }
  
  }

}

export default createGui;