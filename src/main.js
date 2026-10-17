import * as THREE from 'three';

import { createScene, createCamera} from './scene.js';
import { factories,createObject} from './items.js';
import { objectsConfig} from './configs.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';


const scene = await createScene();

const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const objects = objectsConfig.map(createObject);
objects.forEach(o => scene.add(o));
//const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform
const draggableObjects = objects;
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);
dragControls.addEventListener('dragstart', (event) => {
  event.object.material.emissive.set(0x222222); // подсветка
});

dragControls.addEventListener('dragstart', (event) => {
  event.object.material.emissive.set(0x222222);
});
dragControls.addEventListener('dragend', (event) => {
  event.object.material.emissive.set(0x000000);
});



function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();