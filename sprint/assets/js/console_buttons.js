import * as THREE from '../../../../../node_modules/three/build/three.module.js';


function createConsole(scene) {

  let buttons = [];
  // Add console buttons
  {
  const radius = 0.1;
  addSolidGeometry(0.65, 2, 0, Math.PI/4, 0, -Math.PI/4,
      new THREE.TetrahedronGeometry(radius), 0xff0000, scene,
      buttons, 'play');
  }

  {
  const width = 0.1;
  const height = 0.1;
  const depth = 0.05;
  addSolidGeometry(0.65, 2.2, 0, 0, 0, 0,
      new THREE.BoxGeometry(width, height, depth), 0x00ff00, scene,
      buttons, 'stop');
  }

  {
  const radius = 0.07;
  const widthSegments = 12;
  const heightSegments = 8;
  addSolidGeometry(0.65, 1.8, 0, 0, 0, 0,
      new THREE.SphereGeometry(radius, widthSegments, heightSegments), 0x0000ff, scene,
      buttons, 'addSecs');
  }

  return buttons
}

export default createConsole;

function addSolidGeometry(x, y, z, thetax, thetay, thetaz, geometry, color, scene, buttons, name) {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: color
    });
    const mesh = new THREE.Mesh(geometry, material);
    addObject(x, y, z, thetax, thetay, thetaz, mesh, scene, buttons, name);
  }
  
function addObject(x, y, z, thetax, thetay, thetaz, obj, scene, buttons, name) {
  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  obj.name = name;

  obj.receiveShadow = true;
  obj.castShadow = true;

  obj.rotation.set(thetax, thetay, thetaz);

  scene.add(obj);
  buttons.push(obj)
}