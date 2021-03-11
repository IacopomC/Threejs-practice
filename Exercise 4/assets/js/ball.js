import * as THREE from '../../../../node_modules/three/build/three.module.js';

function generateBalls() {

    let balls = [];

    const radius = 0.4;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
     
    function rand(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + (max - min) * Math.random();
    }
     
    function randomColor() {
      return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 10%)`;
    }
     
    const numObjects = 20;
    for (let i = 0; i < numObjects; ++i) {
      const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });
     
      const ball = new THREE.Mesh(geometry, material);
     
      ball.position.set(rand(-9, 9), 0, rand(-10, 10));

      balls.push(ball);
    }

    return balls;
}

export default generateBalls;