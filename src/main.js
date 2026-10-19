import * as THREE from 'three';

import { createScene, createCamera} from './scene.js';
import { factories,createObject} from './items.js';
import { objectsConfig} from './configs.js';
import {initZones, getZoneUnderObject} from './zones.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

const resultText = document.getElementById('resultText');
const checkBtn = document.getElementById('check');

const scene = await createScene();

const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const { green_zone, red_zone } = initZones(scene);



//границы передвижения
const bounds = new THREE.Box3(
  new THREE.Vector3(-5, 0.5, -5),
  new THREE.Vector3(5, 2, 3)
);
function clampInArea(object) {
  object.position.x = THREE.MathUtils.clamp(object.position.x, bounds.min.x, bounds.max.x);
  object.position.z = THREE.MathUtils.clamp(object.position.z, bounds.min.z, bounds.max.z);
}

const objects = objectsConfig.map(createObject);
objects.forEach(o => scene.add(o));
const draggableObjects = objects;
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);
dragControls.addEventListener('dragstart', (event) => {
  event.object.material.emissive.set(0x222222);
});

dragControls.addEventListener('drag', (event) => {
  event.object.material.emissive.set(0x222222);
  event.object.position.y = 0;
  clampInArea(event.object);
});
dragControls.addEventListener('dragend', (event) => {
  event.object.material.emissive.set(0x000000);
  getZoneUnderObject(event.object,green_zone, red_zone);
  console.log(event.object.userData);
});

document.getElementById("check").addEventListener('click', () => {
  let correct = 0;

  for (const object of objects) {
    let isCorrect=false;
    if (object.userData.zone == object.userData.likes)isCorrect=true;
    else isCorrect=false;

    if (isCorrect) {
      correct++;
      object.material.color.set(0x00ff00);
    } else {
      object.material.color.set(0xff0000);
    }
  }

resultText.innerText = `Правильно: ${correct} из ${objects.length}`;
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();