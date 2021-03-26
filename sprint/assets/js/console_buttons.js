import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';


function createConsole(scene) {

  let buttons = [];
  // Add console buttons
  {
    const width = 0.1;
    const height = 0.1;
    const depth = 0.05;
    addSolidGeometry(0.65, 2.2, 0, 0, 0, 0,
        new THREE.BoxGeometry(width, height, depth), 0x131414, scene,
        buttons, 'stop');
    }

  {
  const radius = 0.05;
  const height = 0.1;
  const radialSegments = 32;
  addSolidGeometry(0.65, 2.05, 0, 0, 0, -Math.PI/2,
      new THREE.ConeGeometry(radius, height, radialSegments), 0x131414, scene,
      buttons, 'play');
  }

  {
    const radius = 0.05;
    const height = 0.1;
    const radialSegments = 32;
    addSolidGeometry(0.65, 1.9, 0, 0, 0, -Math.PI/2,
        new THREE.ConeGeometry(radius, height, radialSegments), 0x131414, scene,
        buttons, 'addSecs');
  }

  {
    const radius = 0.05;
    const height = 0.1;
    const radialSegments = 32;
    addSolidGeometry(0.75, 1.9, 0, 0, 0, -Math.PI/2,
        new THREE.ConeGeometry(radius, height, radialSegments), 0x131414, scene,
        buttons, 'addSecs');
  }

  return buttons
}

export default createConsole;

function addSolidGeometry(x, y, z, thetax, thetay, thetaz, geometry, color, scene, buttons, name) {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: color,
      shininess: 50
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