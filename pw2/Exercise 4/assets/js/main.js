import * as THREE from '../../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import createRobot from './robot.js';
import PickHelper from './pick_helper.js';
import generateBalls from './ball.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  // Camera
  const fov = 75;
  const aspect = window.innerWidth/window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 10, 10, 10 );

  // Controls
  const controls = new OrbitControls(camera, canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xB1ABA7);

  // Grid
  const grid = new THREE.GridHelper( 20, 20, 0x888888, 0x444444 );
  grid.material.opacity = 0.5;
  grid.material.depthWrite = false;
  grid.material.transparent = true;
  scene.add( grid );

  // Light
  {
    const color = 0xFFFFFF;
    const intensity = 8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
   }
   {
    const color = 0xFFFFFF;
    const intensity = 8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
   }

   // Robot
   const robot_arm = createRobot();

   scene.add(robot_arm);

   let initialAngle = - Math.PI/4;

  // Balls
  const balls = generateBalls();

  balls.forEach( ball => {
      scene.add(ball);
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.001;  // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    pickHelper.pick(pickPosition, scene, camera, balls, time);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = - (pos.y / canvas.height) * 2 + 1;  // note we flip Y
  }

  function clearPickPosition() {
    // Ppick a value unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function pickBall() {
      let fps = 60;           // fps/seconds
      let tau = 2;            // 2 seconds
      const step = 1 / (tau * fps);  // step per frame

      const polaCoord = cartesianToPolar(pickPosition.x, pickPosition.y);
      
      // console.log('INITIAL RAD ',initialAngle);
      console.log('INITIAL DEGREE', initialAngle*180/3.14159);
      // console.log('ANGLE RAD ', polaCoord.angle);
      console.log('ANGLE DEGREE', polaCoord.angle*180/3.14159);
      
      const deltaRotation = polaCoord.angle - initialAngle;
      initialAngle = polaCoord.angle;
      console.log('delta Rotation ', deltaRotation*180/3.14159);
      const angleStep = deltaRotation * step;
      let t = 0;

      function animateRobotArm(t){
          if (t >= 1) return; // Motion ended
          t += step;  // Increment time
          robot_arm.rotation.y += angleStep; // Increment rotation
          requestAnimationFrame(() => animateRobotArm(t));
        }

      animateRobotArm(t);
    }

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('pointerdown', pickBall);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});

  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });

  window.addEventListener('touchend', clearPickPosition);
}

function cartesianToPolar(x, y){
    // Convert cartesian coordinates
    // to polar coordinates
    let r = Math.sqrt(x*x + y*y);
    let theta = Math.atan2(y,x);
    return { radius: r, angle: theta }
}

function polarToCartesian ( t, theta ) {
    // Convert polar coordinates
    // to cartesian coordinates
    let x = r * cos(theta);
    let y = r * sin(theta);

    return {x: x, y: y};
}

main();
