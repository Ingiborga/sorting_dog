import * as THREE from 'three';

import { createScene, createCamera, createSound} from './scene.js';
import { factories,createObject} from './items.js';
import { objectsConfig} from './configs.js';
import {initZones, getZoneUnderObject} from './zones.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { Store } from './store.js';
import { initUI } from './ui.js';

//инициализация

const scene = await createScene();
const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const wrap = document.getElementById('canvas-wrap');
wrap.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
const { green_zone, red_zone } = initZones(scene);
const {sound1,sound2} = await createSound(camera);
const objects = objectsConfig.map(createObject);
objects.forEach(o => scene.add(o));

//логика передвижения
//границы передвижения
const bounds = new THREE.Box3(
  new THREE.Vector3(-5, 0.5, -5),
  new THREE.Vector3(5, 2, 3)
);
function clampInArea(object) {
  object.position.x = THREE.MathUtils.clamp(object.position.x, bounds.min.x, bounds.max.x);
  object.position.z = THREE.MathUtils.clamp(object.position.z, bounds.min.z, bounds.max.z);
}
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

//взаимодействие с ui + логика подсчета
const gameStore = new Store({
  objects: objects,
  correct: 0,
  total: objects.length,
  phase: 'sorting',//'wrong_sort','true_sort'
  lastResult: null,
});
const { checkBtn } = initUI(gameStore,{sound1,sound2});
console.log('initUI прошёл, кнопка:', checkBtn);
checkBtn.addEventListener('click', () => {
  const { objects } = gameStore.get();
  let correct = 0;
  let isAllChanged=true;
let isCorrect=true;
  for (const object of objects) {
    if (object.userData.zone ==null){
        isAllChanged=false;
        break;
    }
    if (object.userData.zone == object.userData.likes)isCorrect=true;
    else isCorrect=false;
    if (isCorrect) {
      correct++;
      object.material.color.set(0x00ff00);
    } else {
      object.material.color.set(0xff0000);
    }
  }
  gameStore.update({
    score: correct,
    total: objects.length,
    phase: correct === objects.length ? 'true_sort' : 'wrong_sort',
  });
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();