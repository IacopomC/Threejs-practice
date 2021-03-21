import * as THREE from '../../../../../node_modules/three/build/three.module.js';

class ControllerPickHelper extends THREE.EventDispatcher{
    constructor(scene, renderer) {

        super();

        this.raycaster = new THREE.Raycaster();
        this.objectToColorMap = new Map();
        this.controllerToObjectMap = new Map();
        this.tempMatrix = new THREE.Matrix4();

        const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1),
      ]);
   
      this.controllers = [];
      for (let i = 0; i < 2; ++i) {
        const controller = renderer.xr.getController(i);
        controller.addEventListener('select', (event) => {
            const controller = event.target;
            const selectedObject = this.controllerToObjectMap.get(controller);
            if (selectedObject) {
              this.dispatchEvent({type: 'select', controller, selectedObject});
            }
        });
        scene.add(controller);
   
        const line = new THREE.Line(pointerGeometry);
        line.scale.z = 5;
        controller.add(line);
        this.controllers.push({controller, line});
      }
    }
    _reset() {
        // restore the colors
        this.objectToColorMap.forEach((color, object) => {
          object.material.emissive.setHex(color);
        });
        this.objectToColorMap.clear();
        this.controllerToObjectMap.clear();
    }
    update(balls, time) {
        this._reset();
        for (const {controller, line} of this.controllers) {
          // cast a ray through the from the controller
          this.tempMatrix.identity().extractRotation(controller.matrixWorld);
          this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
          this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
          // get the list of objects the ray intersected
          const intersections = this.raycaster.intersectObjects(balls);
          if (intersections.length) {
            const intersection = intersections[0];
            // make the line touch the object
            line.scale.z = intersection.distance;
            // pick the first object. It's the closest one
            const pickedObject = intersection.object;
            // save which object this controller picked
            this.controllerToObjectMap.set(controller, pickedObject);
            // highlight the object if we haven't already
            if (this.objectToColorMap.get(pickedObject) === undefined) {
              // save its color
              this.objectToColorMap.set(pickedObject, pickedObject.material.emissive.getHex());
              // set its emissive color to flashing red/yellow
              pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFF2000 : 0xFF0000);
            }
          } else {
            line.scale.z = 5;
          }
        }
    }
}

export default ControllerPickHelper;